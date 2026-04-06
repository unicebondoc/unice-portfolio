/**
 * Compact / touch-primary layout (nav pills, larger orb hit targets, mobile camera tuning).
 * Portrait phones match CSS max-width: 768px. Landscape phones are often >768px wide but
 * should still use mobile affordances — detect via coarse pointer + width cap.
 */
export function getMobileLayoutFlag() {
  if (typeof window === 'undefined') return false
  const w = window.innerWidth
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return w <= 768 || (coarse && w < 1024)
}
