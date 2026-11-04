import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferences } from '@/lib/db/schema'

export async function GET() {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ tableCorners: null }, { status: 401 })

  const [preference] = await db
    .select({ tableCorners: userPreferences.tableCorners })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1)

  return NextResponse.json({ tableCorners: preference?.tableCorners ?? 'rounded' })
}

export async function PUT(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const tableCorners = body?.tableCorners === 'square' ? 'square' : body?.tableCorners === 'rounded' ? 'rounded' : null
  if (!tableCorners) return NextResponse.json({ error: 'Invalid preference' }, { status: 400 })

  await db
    .insert(userPreferences)
    .values({ userId: session.user.id, tableCorners, updatedAt: new Date() })
    .onConflictDoUpdate({ target: userPreferences.userId, set: { tableCorners, updatedAt: new Date() } })

  return NextResponse.json({ tableCorners })
}
