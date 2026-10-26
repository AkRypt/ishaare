import { getAdminDb } from './admin'
import { ISHAARE_COLLECTIONS } from './collections'
import type { SessionUser } from './session'

export type UserProfile = {
  id: string
  email?: string
  purchased_topics: number[]
}

export async function upsertUser(user: SessionUser): Promise<UserProfile> {
  const db = getAdminDb()
  const ref = db.collection(ISHAARE_COLLECTIONS.USERS).doc(user.uid)
  const snap = await ref.get()

  if (!snap.exists) {
    const profile: UserProfile = {
      id: user.uid,
      email: user.email,
      purchased_topics: [],
    }
    await ref.set({
      email: user.email ?? null,
      purchased_topics: [],
      createdAt: new Date(),
    })
    return profile
  }

  const data = snap.data() ?? {}
  if (user.email && data.email !== user.email) {
    await ref.set({ email: user.email }, { merge: true })
  }

  return {
    id: user.uid,
    email: (data.email as string | undefined) ?? user.email,
    purchased_topics: (data.purchased_topics as number[]) ?? [],
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getAdminDb().collection(ISHAARE_COLLECTIONS.USERS).doc(uid).get()
  if (!snap.exists) return null
  const data = snap.data() ?? {}
  return {
    id: uid,
    email: data.email as string | undefined,
    purchased_topics: (data.purchased_topics as number[]) ?? [],
  }
}

export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const query = await getAdminDb()
    .collection(ISHAARE_COLLECTIONS.USERS)
    .where('email', '==', email)
    .limit(1)
    .get()

  if (query.empty) return null
  const doc = query.docs[0]
  const data = doc.data()
  return {
    id: doc.id,
    email: data.email as string | undefined,
    purchased_topics: (data.purchased_topics as number[]) ?? [],
  }
}

export async function addPurchasedTopic(email: string, topicId: number): Promise<void> {
  const user = await findUserByEmail(email)
  if (!user) {
    console.error('User not found for email:', email)
    return
  }

  const current = user.purchased_topics || []
  if (current.includes(topicId)) return

  await getAdminDb()
    .collection(ISHAARE_COLLECTIONS.USERS)
    .doc(user.id)
    .update({ purchased_topics: [...current, topicId] })
}
