/**
 * Delete legacy flat collections after remigrating to ishaare_* / spycy_*.
 * Usage: node scripts/cleanup-legacy-collections.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

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
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvLocal()

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
const LEGACY = ['decks', 'words', 'users', 'lobbies']

async function deleteCollection(name) {
  const snap = await db.collection(name).get()
  if (snap.empty) {
    console.log(`${name}: already empty`)
    return 0
  }
  let deleted = 0
  const CHUNK = 400
  const docs = snap.docs
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = db.batch()
    for (const doc of docs.slice(i, i + CHUNK)) {
      batch.delete(doc.ref)
      deleted++
    }
    await batch.commit()
  }
  console.log(`${name}: deleted ${deleted}`)
  return deleted
}

console.log('Cleaning legacy flat collections…')
for (const name of LEGACY) {
  await deleteCollection(name)
}
console.log('Done. Prefer ishaare_* / spycy_* going forward.')
