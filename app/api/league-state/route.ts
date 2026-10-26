import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const STATE_ID = 'shared-anonymous-league'

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS league_state (id text PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  if (url.searchParams.get('stream') === '1') {
    const encoder = new TextEncoder()
    const client = await pool.connect()
    let closed = false
    const stream = new ReadableStream({
      async start(controller) {
        const sendState = async () => {
          const result = await client.query('SELECT payload FROM league_state WHERE id = $1', [STATE_ID])
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ state: result.rows[0]?.payload ?? null })}\n\n`))
        }
        try {
          await ensureTable()
          await client.query('LISTEN league_state_changed')
          await sendState()
          client.on('notification', () => { void sendState().catch(() => undefined) })
          request.signal.addEventListener('abort', () => {
            closed = true
            client.release()
            controller.close()
          }, { once: true })
        } catch (error) {
          client.release()
          controller.error(error)
        }
      },
      cancel() {
        if (!closed) client.release()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' } })
  }

  try {
    await ensureTable()
    const result = await pool.query('SELECT payload FROM league_state WHERE id = $1', [STATE_ID])
    return NextResponse.json({ state: result.rows[0]?.payload ?? null })
  } catch (error) {
    console.error('[v0] Error leyendo estado de Neon:', error)
    return NextResponse.json({ error: 'No se pudo leer el estado' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const state = await request.json()
  if (!state || typeof state !== 'object' || Array.isArray(state)) return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
  try {
    await ensureTable()
    await pool.query('INSERT INTO league_state (id, payload) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()', [STATE_ID, JSON.stringify(state)])
    await pool.query("SELECT pg_notify('league_state_changed', $1)", [STATE_ID])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] Error guardando estado en Neon:', error)
    return NextResponse.json({ error: 'No se pudo guardar el estado' }, { status: 500 })
  }
}
