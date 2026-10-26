import { NextResponse, type NextRequest } from 'next/server'

/**
 * Legacy Supabase OAuth callback. Firebase Google sign-in uses
 * /auth/google (client popup) + /api/auth/session instead.
 */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/auth/google', request.url))
}
