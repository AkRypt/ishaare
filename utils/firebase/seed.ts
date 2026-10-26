import decksSeed from '@/data/firestore-seed/decks.json'
import wordsSeed from '@/data/firestore-seed/words.json'
import { resolveDeckImage } from '@/utils/deck-image'

export type SeedDeck = {
  id: number
  name: string
  description?: string
  image?: string
  is_premium?: boolean
  enabled?: boolean
  coming_soon?: boolean
  buy_link?: string | null
  created_at?: string
}

export type SeedWord = {
  id: number
  deck_id: number
  word: string
}

export function getSeedDecks(): SeedDeck[] {
  return (decksSeed as SeedDeck[]).map((deck) => ({
    ...deck,
    id: Number(deck.id),
    image: resolveDeckImage(deck.image),
  }))
}

export function getSeedWords(deckId: number): SeedWord[] {
  return (wordsSeed as SeedWord[])
    .filter((w) => Number(w.deck_id) === deckId)
    .map((w) => ({
      id: Number(w.id),
      deck_id: Number(w.deck_id),
      word: w.word,
    }))
}
