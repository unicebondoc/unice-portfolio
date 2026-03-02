import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MEMORIES } from '../../data/memories'
import useStore from '../../hooks/useStore'

/**
 * Particles — bioluminescent underwater spores / fireflies.
 *
 * Three separate point clouds:
 *   WARM    — amber/ember tones  (firefly, forest spore)
 *   COOL    — deep ocean blue/teal (no green)
 *   CAUSTIC — large, very slow, faint shimmer (light through water)
 *
 * On hover: whole cloud gently drifts toward the hovered orb,
 * creating a "particles drawn to it" pull effect. Bias fades
 * out smoothly when hover ends.
 */

const WARM_COUNT    = 140
const COOL_COUNT    = 100
const CAUSTIC_COUNT = 28

const COOL_PALETTE = [
  new THREE.Color('#00AACC'),
  new THREE.Color('#0077AA'),
  new THREE.Color('#44CCCC'),
  new THREE.Color('#005577'),
  new THREE.Color('#22AABB'),
]

const WARM_PALETTE = [
  new THREE.Color('#FFB800'),
  new THREE.Color('#FF8C00'),
  new THREE.Color('#FF6A00'),
  new THREE.Color('#FFD060'),
  new THREE.Color('#E87800'),
]

const CAUSTIC_PALETTE = [
  new THREE.Color('#88EEFF'),
  new THREE.Color('#AAFFEE'),
  new THREE.Color('#CCFFFF'),
]

function makeCrowd(count, palette, spread) {
  const positions = new Float32Array(count * 3)
  const colors    = new Float32Array(count * 3)
  const speeds    = new Float32Array(count)
  const phases    = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * spread.x
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z

    const c = palette[Math.floor(Math.random() * palette.length)].clone()
    c.multiplyScalar(0.35 + Math.random() * 0.55)
    colors[i * 3]     = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b

    speeds[i] = 0.08 + Math.random() * 0.18
    phases[i] = Math.random() * Math.PI * 2
  }

  return { positions, colors, speeds, phases }
}

// ── Single particle cloud ─────────────────────────────────────────
function ParticleCloud({ count, palette, spread, size, opacity, isCaustic = false, hoveredPos }) {
  const ref      = useRef()
  const matRef   = useRef()
  const timerRef = useRef(new THREE.Timer())

  const { positions, colors, speeds, phases } = useMemo(
    () => makeCrowd(count, palette, spread),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const originX = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = positions[i * 3]
    return arr
  }, [count, positions])

  const originY = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = positions[i * 3 + 1]
    return arr
  }, [count, positions])

  // Attraction bias — shared cloud drift toward hovered orb
  const bias = useRef({ x: 0, y: 0, z: 0 })

  // Keep latest hoveredPos readable inside useFrame without re-render cost
  const hoveredPosRef = useRef(null)
  hoveredPosRef.current = hoveredPos

  useFrame(() => {
    if (!ref.current || !matRef.current) return
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    const pos = ref.current.geometry.attributes.position
    const hpos = hoveredPosRef.current

    // ── Attraction bias — ease toward hovered orb, else return to 0 ──
    if (hpos) {
      bias.current.x = THREE.MathUtils.lerp(bias.current.x, hpos[0] * 0.10, 0.018)
      bias.current.y = THREE.MathUtils.lerp(bias.current.y, hpos[1] * 0.07, 0.018)
      bias.current.z = THREE.MathUtils.lerp(bias.current.z, hpos[2] * 0.05, 0.018)
    } else {
      bias.current.x = THREE.MathUtils.lerp(bias.current.x, 0, 0.018)
      bias.current.y = THREE.MathUtils.lerp(bias.current.y, 0, 0.018)
      bias.current.z = THREE.MathUtils.lerp(bias.current.z, 0, 0.018)
    }

    // ── Update particle positions ──────────────────────────────────
    const halfY = spread.y / 2
    const wrapY = spread.y
    // Phase offset maps each particle to a different starting point in Y range
    const phaseOffsetScale = wrapY / (Math.PI * 2)

    for (let i = 0; i < count; i++) {
      const s = speeds[i]
      const p = phases[i]

      if (isCaustic) {
        // Caustic: slow upward drift + gentle horizontal sway
        const drift   = (t * s * 1.0 + p * phaseOffsetScale) % wrapY
        const rawY    = originY[i] + drift
        const wrapped = ((rawY + halfY) % wrapY + wrapY) % wrapY - halfY
        pos.array[i * 3]     = originX[i] + bias.current.x + Math.sin(t * s * 0.5 + p) * 1.8
        pos.array[i * 3 + 1] = wrapped + bias.current.y
      } else {
        // Regular: upward drift with gentle horizontal micro-wobble
        const drift   = (t * s * 2.0 + p * phaseOffsetScale) % wrapY
        const rawY    = originY[i] + drift
        const wrapped = ((rawY + halfY) % wrapY + wrapY) % wrapY - halfY
        pos.array[i * 3]     = originX[i] + bias.current.x + Math.sin(t * s * 0.08 + p * 1.5) * 0.14
        pos.array[i * 3 + 1] = wrapped + bias.current.y
        pos.array[i * 3 + 2] = (positions[i * 3 + 2]) + bias.current.z
      }
    }
    pos.needsUpdate = true

    // Slow global breathing
    matRef.current.opacity = isCaustic
      ? opacity * (0.40 + Math.sin(t * 0.22 + 1.0) * 0.35)
      : opacity * (0.68 + Math.sin(t * 0.28) * 0.28)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── Root export — subscribes to store once, passes down ───────────
export default function Particles() {
  const hoveredOrb = useStore((s) => s.hoveredOrb)

  // Derive hovered orb position (null when nothing hovered)
  const hoveredPos = useMemo(() => {
    if (!hoveredOrb) return null
    return MEMORIES.find((m) => m.id === hoveredOrb)?.position ?? null
  }, [hoveredOrb])

  return (
    <>
      <ParticleCloud
        count={WARM_COUNT}
        palette={WARM_PALETTE}
        spread={{ x: 26, y: 14, z: 14 }}
        size={0.082}
        opacity={0.60}
        hoveredPos={hoveredPos}
      />
      <ParticleCloud
        count={COOL_COUNT}
        palette={COOL_PALETTE}
        spread={{ x: 22, y: 12, z: 16 }}
        size={0.068}
        opacity={0.45}
        hoveredPos={hoveredPos}
      />
      <ParticleCloud
        count={CAUSTIC_COUNT}
        palette={CAUSTIC_PALETTE}
        spread={{ x: 18, y: 10, z: 10 }}
        size={0.18}
        opacity={0.12}
        isCaustic
        hoveredPos={hoveredPos}
      />
    </>
  )
}
