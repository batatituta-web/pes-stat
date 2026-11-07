import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferences } from '@/lib/db/schema'

const CORNERS = ['rounded', 'square'] as const
const THEMES = ['green', 'black', 'purple'] as const

export async function GET() {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ tableCorners: null, theme: null }, { status: 401 })

  const [preference] = await db
    .select({ tableCorners: userPreferences.tableCorners, theme: userPreferences.theme })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1)

  return NextResponse.json({
    tableCorners: preference?.tableCorners ?? 'rounded',
    theme: preference?.theme ?? 'green',
  })
}

export async function PUT(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const update: { tableCorners?: (typeof CORNERS)[number]; theme?: (typeof THEMES)[number] } = {}

  if (body?.tableCorners !== undefined) {
    if (!CORNERS.includes(body.tableCorners)) return NextResponse.json({ error: 'Invalid preference' }, { status: 400 })
    update.tableCorners = body.tableCorners
  }
  if (body?.theme !== undefined) {
    if (!THEMES.includes(body.theme)) return NextResponse.json({ error: 'Invalid preference' }, { status: 400 })
    update.theme = body.theme
  }
  if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Invalid preference' }, { status: 400 })

  await db
    .insert(userPreferences)
    .values({ userId: session.user.id, ...update, updatedAt: new Date() })
    .onConflictDoUpdate({ target: userPreferences.userId, set: { ...update, updatedAt: new Date() } })

  return NextResponse.json(update)
}
