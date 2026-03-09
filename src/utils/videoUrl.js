/**
 * Resolve video (and other static asset) URLs so they work in dev and production.
 * Vite's import.meta.env.BASE_URL is '/' in dev; in production it may be a subpath (e.g. '/unice-portfolio/').
 */
export function getVideoUrl(path) {
  if (!path) return ''
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/'
  const baseNorm = base.endsWith('/') ? base.slice(0, -1) : base
  const pathNorm = path.startsWith('/') ? path : '/' + path
  return baseNorm + pathNorm
}
