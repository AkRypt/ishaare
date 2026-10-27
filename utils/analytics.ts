/**
 * Firebase Analytics (GA4) for Ishaare on the shared akxh-games project.
 * Reads the public NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID already in the web config.
 * Nothing is written to Firestore and there is no in-app dashboard.
 *
 * Every event includes `app: "ishaare"`.
 * `mode` is `pass_and_play` (Ishaare is one shared phone) or `online`.
 * GA4 records `session_start` on its own when Analytics initializes.
 */
import type { Analytics } from 'firebase/analytics'

export const ANALYTICS_APP = 'ishaare'

export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  lobbyCreated: 'lobby_created',
  lobbyJoined: 'lobby_joined',
  deckSelected: 'deck_selected',
  gameStarted: 'game_started',
  gameFinished: 'game_finished',
} as const

export type AnalyticsMode = 'online' | 'pass_and_play'

type Params = Record<string, string | number>

let loading: Promise<Analytics | null> | null = null

function measurementId() {
  return process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() || ''
}

async function analytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null
  if (!measurementId()) return null
  if (!loading) {
    loading = (async () => {
      try {
        const { getAnalytics, initializeAnalytics, isSupported } = await import('firebase/analytics')
        const { getClientApp } = await import('@/utils/firebase/client')
        if (!(await isSupported())) return null
        const firebaseApp = getClientApp()
        const config: Record<string, string | boolean> = { send_page_view: false }
        if (process.env.NODE_ENV === 'development') config.debug_mode = true
        try {
          return initializeAnalytics(firebaseApp, { config })
        } catch {
          return getAnalytics(firebaseApp)
        }
      } catch {
        return null
      }
    })()
  }
  return loading
}

/** Dedupe strict-mode double effects without sending the key to GA4. */
export function claimOnce(key: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const full = `akxh_analytics:${ANALYTICS_APP}:${key}`
    if (sessionStorage.getItem(full)) return false
    sessionStorage.setItem(full, '1')
    return true
  } catch {
    return true
  }
}

function deckId(value: string | number) {
  const raw = String(value).trim()
  return (raw || 'unknown').slice(0, 100)
}

export function track(name: string, params: Params = {}) {
  void analytics().then(async (instance) => {
    if (!instance) return
    const { logEvent } = await import('firebase/analytics')
    const send = logEvent as (
      analyticsInstance: Analytics,
      eventName: string,
      eventParams?: Params
    ) => void
    send(instance, name, { app: ANALYTICS_APP, ...params })
  })
}

export function trackPageView(path: string) {
  const page_path = path || '/'
  const bucket = Math.floor(Date.now() / 1000)
  if (!claimOnce(`page:${page_path}:${bucket}`)) return
  track(ANALYTICS_EVENTS.pageView, {
    page_path,
    page_title: typeof document !== 'undefined' ? document.title : ANALYTICS_APP,
    page_location:
      typeof window !== 'undefined' ? `${window.location.origin}${page_path}` : page_path,
  })
}

/** Deck picker is the pass-and-play lobby. There is no online lobby in Ishaare. */
export function trackLobbyCreated() {
  track(ANALYTICS_EVENTS.lobbyCreated, { mode: 'pass_and_play' })
}

export function trackDeckSelected(id: number | string) {
  track(ANALYTICS_EVENTS.deckSelected, { mode: 'pass_and_play', deck_id: deckId(id) })
}

export function trackGameStarted(id: number | string) {
  const idValue = deckId(id)
  const bucket = Math.floor(Date.now() / 2000)
  if (!claimOnce(`game_started:${idValue}:${bucket}`)) return
  track(ANALYTICS_EVENTS.gameStarted, { mode: 'pass_and_play', deck_id: idValue })
}

/** Round end. One Ishaare timer run is one finished game. */
export function trackGameFinished(id: number | string, durationS: number) {
  const idValue = deckId(id)
  const bucket = Math.floor(Date.now() / 2000)
  if (!claimOnce(`game_finished:${idValue}:${bucket}`)) return
  track(ANALYTICS_EVENTS.gameFinished, {
    mode: 'pass_and_play',
    deck_id: idValue,
    duration_s: Math.max(0, Math.round(durationS)),
  })
}
