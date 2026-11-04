'use client'

import { FormEvent, useState } from 'react'
import { signIn, signOut, signUp, useSession } from '@/lib/auth-client'

export function AuthControls() {
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isPending) return null
  if (session?.user) {
    return <button type="button" onClick={() => signOut()} className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-emerald-50 hover:bg-white/10">Cerrar sesión</button>
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const result = mode === 'sign-in'
      ? await signIn.email({ email, password })
      : await signUp.email({ email, password, name })
    setBusy(false)
    if (result.error) {
      setError('No se pudo completar la autenticación. Revisa tus datos.')
      return
    }
    setOpen(false)
    window.location.reload()
  }

  return <div className="relative"><button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-emerald-950 hover:bg-emerald-300">Iniciar sesión</button>{open && <div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-emerald-300/30 bg-emerald-950 p-4 shadow-2xl"><div className="mb-3 flex gap-2 text-xs font-semibold"><button type="button" onClick={() => setMode('sign-in')} className={mode === 'sign-in' ? 'text-white' : 'text-emerald-300/60'}>Ingresar</button><button type="button" onClick={() => setMode('sign-up')} className={mode === 'sign-up' ? 'text-white' : 'text-emerald-300/60'}>Crear cuenta</button></div><form onSubmit={submit} className="flex flex-col gap-2">{mode === 'sign-up' && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" required className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none" />}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña" minLength={8} required className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none" />{error && <p role="alert" className="text-xs text-red-200">{error}</p>}<button type="submit" disabled={busy} className="rounded-md bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/25 disabled:opacity-50">{busy ? 'Procesando...' : mode === 'sign-in' ? 'Ingresar' : 'Registrarme'}</button></form></div>}</div>
}
