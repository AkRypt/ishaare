import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // refreshing the auth token
  const { data, error } = await supabase.auth.getUser()

  // If the user is loggedin, they are redirected from main to lobby
  if (request.nextUrl.pathname === "/" && data?.user) {
    return NextResponse.redirect(new URL("/lobby", request.url))
  }

  // Topic purchase validation
  if (request.nextUrl.pathname === "/game") {
    const urlParams = new URLSearchParams(request.nextUrl.search)
    const deckId = parseInt(urlParams.get("deck_id") || "") || null;

    const { data: deckData, error: deckError } = await supabase
      .from('decks')
      .select('*')
      .eq('id', deckId)

    if (deckData && deckData[0].is_premium) {
      const { data: userData, error: userError }: { data: any, error: any } = await supabase
        .from('users')
        .select('*')
        .eq('id', data?.user?.id)

      //// TODO REDIRECT TO BUY TOPIC PAGE
      if (!userData[0].purchased_topics.includes(deckId)) {
        return NextResponse.redirect(new URL("/lobby", request.url))
      }
    }


  }


  return response
}