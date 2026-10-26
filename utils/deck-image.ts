/** Default cover for decks with missing or broken images. */
export const DEFAULT_DECK_IMAGE = '/decks/default.svg'

/**
 * Normalize a deck image to a static public path.
 * Accepts legacy Supabase storage URLs, absolute /decks paths, or empty values.
 */
export function resolveDeckImage(image?: string | null): string {
  if (!image || typeof image !== 'string') return DEFAULT_DECK_IMAGE

  const trimmed = image.trim()
  if (!trimmed) return DEFAULT_DECK_IMAGE

  // Already a local public path
  if (trimmed.startsWith('/decks/')) return trimmed

  // Legacy Supabase topic_images URL → /decks/<filename>
  const match = trimmed.match(
    /\/storage\/v1\/object\/public\/topic_images\/([^/?#]+)/i
  )
  if (match?.[1]) return `/decks/${match[1]}`

  // Other absolute http(s) URLs: keep as-is (onError will fall back in UI)
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  // Bare filename
  if (!trimmed.includes('/')) return `/decks/${trimmed}`

  return DEFAULT_DECK_IMAGE
}
