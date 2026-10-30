import { NextResponse } from 'next/server'
import { isPreviewAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  return NextResponse.json({ canEdit: isPreviewAdmin(request) })
}
