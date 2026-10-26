import { cert, getApps, initializeApp, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { isFirebaseAdminConfigured } from './config'

function getPrivateKey(): string {
  const key = process.env.FIREBASE_PRIVATE_KEY
  if (!key) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set')
  }
  return key.replace(/\\n/g, '\n')
}

function getAdminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing

  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      'Firebase Admin is not configured. Add a real service-account FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local (do not overwrite existing non-empty values).'
    )
  }

  const projectId = process.env.FIREBASE_PROJECT_ID!
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: getPrivateKey(),
    }),
  })
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}
