export function isPreviewAdmin(request: Request): boolean {
  if (request.headers.get('x-v0-preview') === '1') return true
  const hostname = new URL(request.url).hostname.toLowerCase()
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
  const isV0Preview = hostname === 'v0.app' || hostname === 'v0.dev' || hostname.endsWith('.v0.build') || hostname.endsWith('.v0.app') || hostname.endsWith('.v0.dev')
  const isVercelPreview = process.env.VERCEL_ENV === 'preview' || isV0Preview || (hostname.endsWith('.vercel.app') && process.env.VERCEL_ENV !== 'production')
  return isLocal || isVercelPreview
}
