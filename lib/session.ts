import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  authenticated: boolean
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'expo-carrelage-secret-key-change-me-32ch',
  cookieName: 'expo_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    httpOnly: true as const,
  },
}

// Pour Server Components et Route Handlers utilisant next/headers
export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions)
}
