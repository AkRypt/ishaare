'use server'

import { getAdminDb } from '@/utils/firebase/admin'
import { ISHAARE_COLLECTIONS } from '@/utils/firebase/collections'
import { isFirebaseAdminConfigured } from '@/utils/firebase/config'
import { getSeedWords } from '@/utils/firebase/seed'

export async function getWords(deck_id: number) {
  if (isFirebaseAdminConfigured()) {
    try {
      const snapshot = await getAdminDb()
        .collection(ISHAARE_COLLECTIONS.WORDS)
        .where('deck_id', '==', deck_id)
        .get()

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => {
          const data = doc.data() as Record<string, unknown>
          return {
            id: String(doc.id),
            deck_id: Number(data.deck_id),
            word: typeof data.word === 'string' ? data.word : '',
          }
        })
      }
    } catch (error) {
      console.error('Firestore words read failed; using local seed', error)
    }
  }

  return getSeedWords(deck_id).map((w) => ({
    id: String(w.id),
    deck_id: w.deck_id,
    word: w.word,
  }))
}

export async function ilog(text: string) {
  console.log(text)
}
