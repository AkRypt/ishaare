'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { resolveDeckImage } from '@/utils/deck-image'
import { getAdminDb } from '@/utils/firebase/admin'
import { ISHAARE_COLLECTIONS } from '@/utils/firebase/collections'
import { isFirebaseAdminConfigured } from '@/utils/firebase/config'
import { getSeedDecks } from '@/utils/firebase/seed'
import { getSessionUser, SESSION_COOKIE_NAME } from '@/utils/firebase/session'
import { getUserProfile, upsertUser } from '@/utils/firebase/users'

function serializeDeck(docId: string, data: Record<string, unknown>) {
  return {
    id: typeof data.id === 'number' ? data.id : Number(docId),
    name: typeof data.name === 'string' ? data.name : '',
    description: typeof data.description === 'string' ? data.description : '',
    image: resolveDeckImage(typeof data.image === 'string' ? data.image : null),
    is_premium: Boolean(data.is_premium),
    enabled: data.enabled !== false,
    coming_soon: Boolean(data.coming_soon),
    buy_link: typeof data.buy_link === 'string' ? data.buy_link : null,
  }
}

export async function getDecks() {
  if (isFirebaseAdminConfigured()) {
    try {
      const snapshot = await getAdminDb().collection(ISHAARE_COLLECTIONS.DECKS).get()
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) =>
          serializeDeck(doc.id, doc.data() as Record<string, unknown>)
        )
      }
    } catch (error) {
      console.error('Firestore decks read failed; using local seed', error)
    }
  }
  return getSeedDecks()
}

export async function getCurrentUser() {
  if (!isFirebaseAdminConfigured()) return null

  try {
    const session = await getSessionUser()
    if (!session) return null

    const existing = await getUserProfile(session.uid)
    if (existing) return existing
    return upsertUser(session)
  } catch (error) {
    console.error('getCurrentUser failed', error)
    return null
  }
}

export async function signOut() {
  const cookieStore = cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  redirect('/')
}
