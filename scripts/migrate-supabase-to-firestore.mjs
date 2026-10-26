/**
 * Migrate Ishaare decks/words into Firestore (project akxh-games / shared Firebase).
 * Target collections: ishaare_decks, ishaare_words (namespaced per game).
 *
 * Sources (first match wins for catalog data):
 *   1. data/firestore-seed/{decks,words}.json  (committed export from Supabase)
 *   2. scripts/.migrate-output/               (fresh REST export)
 *
 * Requires real Admin credentials in .env.local:
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 *
 * Usage: node scripts/migrate-supabase-to-firestore.mjs
 * Optional: --dry-run
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const require = createRequire(import.meta.url)
const dryRun = process.argv.includes('--dry-run')

function loadEnvLocal() {
  const path = resolve(root, '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 0) continue
    const key = line.slice(0, i).trim()
    let val = line.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = val
    }
  }
}

function readJson(rel) {
  const path = resolve(root, rel)
  if (!existsSync(path)) return null
  const raw = readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
  return JSON.parse(raw)
}

function adminConfigured() {
  const email = process.env.FIREBASE_CLIENT_EMAIL || ''
  const key = process.env.FIREBASE_PRIVATE_KEY || ''
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      email.includes('@') &&
      (key.includes('BEGIN') || key.includes('\\n'))
  )
}

loadEnvLocal()

const decks =
  readJson('data/firestore-seed/decks.json') ||
  readJson('scripts/.migrate-output/decks.json')
const words =
  readJson('data/firestore-seed/words.json') ||
  readJson('scripts/.migrate-output/words.json')

if (!decks?.length || !words?.length) {
  console.error('No seed JSON found. Expected data/firestore-seed/{decks,words}.json')
  process.exit(1)
}

console.log(`Loaded ${decks.length} decks, ${words.length} words`)

if (dryRun) {
  console.log(
    'Dry run OK — would write decks + words to Firestore and skip empty users.' +
      (adminConfigured()
        ? ' Admin credentials look present.'
        : ' Admin credentials are missing/placeholder — real migrate will exit 2 until set.')
  )
  process.exit(0)
}

if (!adminConfigured()) {
  console.error(
    'Firebase Admin credentials look missing or placeholder.\n' +
      'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local\n' +
      '(Console → Project settings → Service accounts → Generate new private key).\n' +
      'Non-empty .env.local values are never overwritten by this script.'
  )
  process.exit(2)
}

const { cert, getApps, initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })

const db = getFirestore(app)
const DECKS = 'ishaare_decks'
const WORDS = 'ishaare_words'

async function commitBatches(items, writeOne) {
  const CHUNK = 400
  for (let i = 0; i < items.length; i += CHUNK) {
    const slice = items.slice(i, i + CHUNK)
    const batch = db.batch()
    for (const item of slice) writeOne(batch, item)
    await batch.commit()
    console.log(`Committed ${Math.min(i + CHUNK, items.length)}/${items.length}`)
  }
}

function resolveDeckImage(image) {
  if (!image || typeof image !== 'string') return '/decks/default.svg'
  const trimmed = image.trim()
  if (!trimmed) return '/decks/default.svg'
  if (trimmed.startsWith('/decks/')) return trimmed
  const match = trimmed.match(
    /\/storage\/v1\/object\/public\/topic_images\/([^/?#]+)/i
  )
  if (match?.[1]) return `/decks/${match[1]}`
  if (!trimmed.includes('/')) return `/decks/${trimmed}`
  return '/decks/default.svg'
}

await commitBatches(decks, (batch, deck) => {
  const id = String(deck.id)
  const ref = db.collection(DECKS).doc(id)
  const { created_at, ...rest } = deck
  batch.set(
    ref,
    {
      ...rest,
      id: Number(deck.id),
      image: resolveDeckImage(deck.image),
      migratedFrom: 'supabase',
      migratedAt: new Date(),
    },
    { merge: true }
  )
})

await commitBatches(words, (batch, word) => {
  const id = String(word.id)
  const ref = db.collection(WORDS).doc(id)
  batch.set(
    ref,
    {
      id: Number(word.id),
      deck_id: Number(word.deck_id),
      word: word.word,
      migratedFrom: 'supabase',
      migratedAt: new Date(),
    },
    { merge: true }
  )
})

console.log(`Migration complete: wrote to ${DECKS} + ${WORDS}.`)
console.log(
  'Users: profiles go to ishaare_users on first Google sign-in; restore purchased_topics manually if needed.'
)
