'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getClientAuth } from '@/utils/firebase/client'
import { Loading } from '@/app/components/loading'

export default function GoogleAuthPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function signIn() {
      try {
        const auth = getClientAuth()
        const provider = new GoogleAuthProvider()
        const credential = await signInWithPopup(auth, provider)
        const idToken = await credential.user.getIdToken()

        const res = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })

        if (!res.ok) {
          throw new Error('Failed to create session')
        }

        if (!cancelled) {
          router.replace('/lobby')
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError('Google sign-in failed. Please try again.')
        }
      }
    }

    signIn()
    return () => {
      cancelled = true
    }
  }, [router])

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600 text-center">{error}</p>
        <button
          className="underline text-primary-bg"
          onClick={() => router.push('/')}
        >
          Back home
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Loading />
    </main>
  )
}
