'use client'

import { createAuthClient } from '@neondatabase/auth'

const authBaseUrl = typeof window === 'undefined'
  ? 'http://localhost:3000/api/auth'
  : new URL('/api/auth', window.location.origin).toString()

export const authClient = createAuthClient(authBaseUrl)
export const { signIn, signUp, signOut } = authClient
