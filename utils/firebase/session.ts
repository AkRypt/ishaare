import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth } from './admin'
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from './constants'

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS }

export type SessionUser = {
  uid: string
  email?: string
}

export async function createSessionCookie(idToken: string): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  })
}

export async function verifySessionCookie(
  sessionCookie: string
): Promise<SessionUser | null> {
  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true)
    return {
      uid: decoded.uid,
      email: decoded.email,
    }
  } catch {
    return null
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!session) return null
  return verifySessionCookie(session)
}

export function getSessionFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value
}

export function attachSessionCookie(response: NextResponse, sessionCookie: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionCookie,
    maxAge: SESSION_MAX_AGE_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response
}
