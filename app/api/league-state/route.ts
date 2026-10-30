import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Client, Pool } from 'pg'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const STATE_ID = 'shared-anonymous-league'
const CHANNEL = 'league_state_changed'
const STREAM_LIFETIME_MS = 270_000
const HEARTBEAT_MS = 15_000

function hasEditorAccess(token: string | undefined) {
  const password = process.env.EDIT_PASSWORD
  if (!password || !token) return false
  const expected = Buffer.from(createHmac('sha256', password).update('league-editor-access').digest('hex'))
  const actual = Buffer.from(token)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

// LISTEN/NOTIFY does not work through the pooled (pgbouncer) connection, so the listener needs the direct one.
const listenerUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS league_state (id text PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`)
}

async function readState() {
  const result = await pool.query('SELECT payload, updated_at FROM league_state WHERE id = $1', [STATE_ID])
  return { state: result.rows[0]?.payload ?? null, version: result.rows[0]?.updated_at ?? null }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function openStateStream(request: Request) {
  const encoder = new TextEncoder()
  const listener = new Client({ connectionString: listenerUrl })
  let closed = false
  let heartbeat: ReturnType<typeof setInterval> | undefined
  let lifetime: ReturnType<typeof setTimeout> | undefined

  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk: string) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(chunk))
        } catch {
          // The client already disconnected.
        }
      }

      const close = async () => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        clearTimeout(lifetime)
        listener.removeAllListeners()
        listener.on('error', () => undefined)
        await listener.end().catch(() => undefined)
        try {
          controller.close()
        } catch {
          // Already closed.
        }
      }

      const sendState = async () => {
        try {
          send(`data: ${JSON.stringify(await readState())}\n\n`)
        } catch (error) {
          console.error('[v0] Error leyendo estado para SSE:', error)
        }
      }

      try {
        await ensureTable()
        await listener.connect()
        listener.on('error', () => void close())
        listener.on('end', () => void close())
        listener.on('notification', () => void sendState())
        await listener.query(`LISTEN ${CHANNEL}`)
        send('retry: 2000\n\n')
        await sendState()
        heartbeat = setInterval(() => send(': ping\n\n'), HEARTBEAT_MS)
        // Close before the platform kills the function so EventSource reconnects cleanly.
        lifetime = setTimeout(() => void close(), STREAM_LIFETIME_MS)
        request.signal.addEventListener('abort', () => void close(), { once: true })
      } catch (error) {
        console.error('[v0] Error abriendo stream SSE:', error)
        await close()
      }
    },
    async cancel() {
      closed = true
      clearInterval(heartbeat)
      clearTimeout(lifetime)
      listener.removeAllListeners()
      listener.on('error', () => undefined)
      await listener.end().catch(() => undefined)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get('stream') === '1') return openStateStream(request)

  try {
    await ensureTable()
    return NextResponse.json(await readState())
  } catch (error) {
    console.error('[v0] Error leyendo estado de Neon:', error)
    return NextResponse.json({ error: 'No se pudo leer el estado' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  if (!hasEditorAccess(cookieStore.get('league_editor_access')?.value)) return NextResponse.json({ error: 'Editor access required' }, { status: 401 })
  const state = await request.json()
  if (!state || typeof state !== 'object' || Array.isArray(state)) return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
  try {
    await ensureTable()
    const current = await pool.query('SELECT payload FROM league_state WHERE id = $1', [STATE_ID])
    if (current.rows[0] && stableJson(current.rows[0].payload) === stableJson(state)) {
      return NextResponse.json({ ok: true, changed: false })
    }
    await pool.query('INSERT INTO league_state (id, payload) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()', [STATE_ID, JSON.stringify(state)])
    await pool.query('SELECT pg_notify($1, $2)', [CHANNEL, STATE_ID])
    return NextResponse.json({ ok: true, changed: true })
  } catch (error) {
    console.error('[v0] Error guardando estado en Neon:', error)
    return NextResponse.json({ error: 'No se pudo guardar el estado' }, { status: 500 })
  }
}
