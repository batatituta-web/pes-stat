import { NextResponse } from 'next/server'

const CHANNEL_URL = 'https://www.youtube.com/@elparchequemegustaok/videos'
const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id='

function decodeXml(value: string) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

function collectPageVideos(value: unknown, output: { title: string; url: string }[]) {
  if (!value || typeof value !== 'object') return
  const item = value as Record<string, unknown>
  if (typeof item.videoId === 'string' && item.title && typeof item.title === 'object') {
    const title = item.title as { simpleText?: string; runs?: { text?: string }[] }
    const text = title.simpleText ?? title.runs?.map((run) => run.text ?? '').join('')
    if (text) output.push({ title: text, url: `https://www.youtube.com/watch?v=${item.videoId}` })
  }
  Object.values(item).forEach((child) => collectPageVideos(child, output))
}

export async function GET() {
  try {
    const channelHtml = await fetch(CHANNEL_URL, { next: { revalidate: 300 }, headers: { 'User-Agent': 'Mozilla/5.0' } }).then((response) => response.text())
    const channelId = channelHtml.match(/(?:channelId|externalId)"?\s*[:=]\s*"(UC[a-zA-Z0-9_-]+)"/)?.[1]
    if (!channelId) return NextResponse.json({ videos: [] })

    const xml = await fetch(`${FEED_URL}${channelId}`, { next: { revalidate: 300 }, headers: { 'User-Agent': 'Mozilla/5.0' } }).then((response) => response.text())
    const feedVideos = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match) => {
      const entry = match[1]
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
      return title && videoId ? { title: decodeXml(title), url: `https://www.youtube.com/watch?v=${videoId}`, published } : null
    }).filter(Boolean)

    const pageVideos: { title: string; url: string }[] = []
    const initialDataMatch = channelHtml.match(/var ytInitialData = ([\s\S]*?);<\/script>/)
    if (initialDataMatch) {
      try { collectPageVideos(JSON.parse(initialDataMatch[1]), pageVideos) } catch { /* The feed remains available if YouTube changes its page payload. */ }
    }
    const allVideos = [...pageVideos, ...feedVideos].filter((video): video is { title: string; url: string; published?: string } => Boolean(video))
    const uniqueVideos = Array.from(new Map(allVideos.map((video) => [video.url, video])).values())
    return NextResponse.json({ videos: uniqueVideos })
  } catch (error) {
    console.error('[v0] Error leyendo videos de YouTube:', error)
    return NextResponse.json({ videos: [] }, { status: 200 })
  }
}
