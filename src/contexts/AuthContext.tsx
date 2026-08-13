'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '@/lib/firebase'

const adminEmails = new Set(['arrivals@hkflal.com', 'hkdl902@gmail.com'])
const authInitializationTimeoutMs = 8000
const authTokenTimeoutMs = 5000
const usingFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
  || process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH_EMULATOR === 'true'

type AuthState = {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function isAdminEmail(email: string | null | undefined) {
  return Boolean(email && adminEmails.has(email.trim().toLowerCase()))
}

async function hasAdminClaim(nextUser: User) {
  try {
    const token = await Promise.race([
      nextUser.getIdTokenResult(true),
      new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('Auth token refresh timed out.')), authTokenTimeoutMs)),
    ])
    return token.claims.admin === true
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let requestId = 0
    const initializationTimeout = window.setTimeout(() => {
      if (requestId !== 0) return
      requestId += 1
      setUser(null)
      setIsAdmin(false)
      setLoading(false)
    }, authInitializationTimeoutMs)
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      window.clearTimeout(initializationTimeout)
      const currentRequestId = ++requestId
      setUser(nextUser)
      if (!nextUser) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      void (async () => {
        const tokenHasAdminClaim = await hasAdminClaim(nextUser)
        if (currentRequestId !== requestId) return
        setIsAdmin(tokenHasAdminClaim || isAdminEmail(nextUser.email))
        setLoading(false)
      })()
    })

    return () => {
      window.clearTimeout(initializationTimeout)
      unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    user,
    isAdmin,
    loading,
    signIn: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase()
      try {
        await signInWithEmailAndPassword(auth, normalizedEmail, password)
      } catch (error) {
        const mayCreateLocalAdmin = usingFirebaseEmulators
          && isAdminEmail(normalizedEmail)
          && error instanceof FirebaseError
          && ['auth/user-not-found', 'auth/invalid-credential'].includes(error.code)

        if (!mayCreateLocalAdmin) throw error
        await createUserWithEmailAndPassword(auth, normalizedEmail, password)
      }
    },
    sendPasswordReset: async (email: string) => sendPasswordResetEmail(auth, email),
    signOutUser: async () => signOut(auth),
  }), [user, isAdmin, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
