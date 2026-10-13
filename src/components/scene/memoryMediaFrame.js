// Inscribe the entire source rectangle inside the vessel, with room for its rim.
export function memoryMediaFrame(aspect, inset = 0.82) {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 1
  const halfHeight = inset / Math.hypot(safeAspect, 1)
  return { halfWidth: halfHeight * safeAspect, halfHeight }
}
