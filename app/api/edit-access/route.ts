import { NextResponse } from 'next/server'

const COOKIE_NAME = 'pes6-edit-access'

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }))
  if (!process.env.EDIT_PASSWORD || password !== process.env.EDIT_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, 'authorized', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}
