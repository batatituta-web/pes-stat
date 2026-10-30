import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const COOKIE_NAME = 'league_editor_access'
const COOKIE_MAX_AGE = 60 * 60 * 8

function expectedToken() {
  const password = process.env.EDIT_PASSWORD
  return password ? createHmac('sha256', password).update('league-editor-access').digest('hex') : null
}

function hasAccess(token: string | undefined) {
  const expected = expectedToken()
  if (!expected || !token) return false
  const actual = Buffer.from(token)
  const target = Buffer.from(expected)
  return actual.length === target.length && timingSafeEqual(actual, target)
}

export async function GET() {
  const cookieStore = await cookies()
  return NextResponse.json({ authorized: hasAccess(cookieStore.get(COOKIE_NAME)?.value) })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const password = typeof body?.password === 'string' ? body.password : ''
  const expected = expectedToken()
  const token = expected && process.env.EDIT_PASSWORD === password ? expected : null

  if (!token) return NextResponse.json({ authorized: false }, { status: 401 })

  const response = NextResponse.json({ authorized: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return response
}
