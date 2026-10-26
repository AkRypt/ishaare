import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from './constants'

/**
 * Edge-safe session gate. Full cookie verification happens in Node
 * (server actions / route handlers) via firebase-admin.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (request.nextUrl.pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/lobby', request.url))
  }

  return response
}
