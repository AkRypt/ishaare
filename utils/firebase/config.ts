/** True when Admin env looks like a real service-account credential (not a placeholder). */
export function isFirebaseAdminConfigured(): boolean {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim()
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim()
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim()

  if (!projectId || !clientEmail || !privateKey) return false
  if (!clientEmail.includes('@')) return false
  if (!privateKey.includes('BEGIN') && !privateKey.includes('\\n')) return false
  return true
}
