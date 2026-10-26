import { NextRequest, NextResponse } from 'next/server'
import {
  attachSessionCookie,
  clearSessionCookie,
  createSessionCookie,
} from '@/utils/firebase/session'
import { upsertUser } from '@/utils/firebase/users'
import { getAdminAuth } from '@/utils/firebase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const idToken = body?.idToken as string | undefined
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken)
    const sessionCookie = await createSessionCookie(idToken)
    await upsertUser({ uid: decoded.uid, email: decoded.email })

    const response = NextResponse.json({ ok: true })
    return attachSessionCookie(response, sessionCookie)
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  return clearSessionCookie(response)
}
