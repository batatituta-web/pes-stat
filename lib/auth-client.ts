'use client'

import { createAuthClient } from '@neondatabase/auth'

export const authClient = createAuthClient('/api/auth')
export const { signIn, signUp, signOut } = authClient
