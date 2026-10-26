'use server'

import { getAdminDb } from '@/utils/firebase/admin'

export async function getWords(deck_id: number) {
  const snapshot = await getAdminDb()
    .collection('words')
    .where('deck_id', '==', deck_id)
    .get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function ilog(text: string) {
  console.log(text)
}
