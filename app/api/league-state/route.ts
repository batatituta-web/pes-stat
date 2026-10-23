import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const STATE_ID = 'shared-anonymous-league'

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS league_state (id text PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`)
}

export async function GET() {
  await ensureTable()
  const result = await pool.query('SELECT payload FROM league_state WHERE id = $1', [STATE_ID])
  return NextResponse.json({ state: result.rows[0]?.payload ?? null })
}

export async function PUT(request: Request) {
  const state = await request.json()
  if (!state || typeof state !== 'object' || Array.isArray(state)) return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
  await ensureTable()
  await pool.query('INSERT INTO league_state (id, payload) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()', [STATE_ID, JSON.stringify(state)])
  return NextResponse.json({ ok: true })
}
