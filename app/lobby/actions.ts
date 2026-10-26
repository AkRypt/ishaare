'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getAdminDb } from '@/utils/firebase/admin'
import { getSessionUser, SESSION_COOKIE_NAME } from '@/utils/firebase/session'
import { getUserProfile, upsertUser } from '@/utils/firebase/users'

export async function getDecks() {
  const snapshot = await getAdminDb().collection('decks').get()
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: typeof data.id === 'number' ? data.id : Number(doc.id),
      ...data,
    }
  })
}

export async function getCurrentUser() {
  const session = await getSessionUser()
  if (!session) return null

  const existing = await getUserProfile(session.uid)
  if (existing) return existing
  return upsertUser(session)
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
