export function isPreviewAdmin(request: Request): boolean {
  const hostname = new URL(request.url).hostname.toLowerCase()
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
  const isVercelPreview = process.env.VERCEL_ENV === 'preview' || (hostname.endsWith('.vercel.app') && process.env.VERCEL_ENV !== 'production')
  return isLocal || isVercelPreview
}
