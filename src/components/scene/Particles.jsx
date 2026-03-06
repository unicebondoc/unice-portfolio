import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MEMORIES } from '../../data/memories'
import useStore from '../../hooks/useStore'

/**
 * Particles — round dots via GLSL circle clip (dist > 0.5 discard, smoothstep soft edge).
 * Clouds: Blossom (purple/pink), Ring, Spore (soft purple), Ground Mist.
 */

const BLOSSOM_COUNT = 120
const SPORE_COUNT   = 80
const RING_COUNT    = 48   // Circle-form ring around scene (purple/lavender)
const MIST_COUNT    = 60   // Ground mist near water level

const BLOSSOM_PALETTE = [
  new THREE.Color('#9060ff'),
  new THREE.Color('#cc60ff'),
  new THREE.Color('#ff60cc'),
  new THREE.Color('#FFB7C5'),
  new THREE.Color('#FF9AB5'),
  new THREE.Color('#d4b8ff'),
]

/* Soft purple (no teal in ambient particles) */
const SPORE_PALETTE = [
  new THREE.Color('#9060ff'),
  new THREE.Color('#cc60ff'),
  new THREE.Color('#a070e8'),
  new THREE.Color('#c4a0ff'),
  new THREE.Color('#b080ff'),
]

// Purple/lavender for circle ring
const RING_PALETTE = [
  new THREE.Color('#9060ff'),
  new THREE.Color('#c4a0ff'),
  new THREE.Color('#d4b8ff'),
  new THREE.Color('#a070e8'),
  new THREE.Color('#e8d4ff'),
]

/* Ground mist: deep purple-blue #6040b0 */
const MIST_PALETTE = [
  new THREE.Color('#6040b0'),
  new THREE.Color('#7050c0'),
  new THREE.Color('#5544a0'),
]

/* Water-to-tree drift: purple + cyan for left orbs (from water at tree) */
const WATER_TREE_PALETTE = [
  new THREE.Color('#5060dd'),
  new THREE.Color('#4080ff'),
  new THREE.Color('#6040cc'),
  new THREE.Color('#22aacc'),
  new THREE.Color('#a070e8'),
]

// ── GLSL — vertex ──────────────────────────────────────────────────
const VERT = /* glsl */`
attribute vec3 aColor;
varying   vec3 vColor;
uniform   float uSize;

void main() {
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (80.0 / max(-mvPos.z, 1.0));
  gl_Position  = projectionMatrix * mvPos;
}
`

const FRAG = /* glsl */`
varying vec3  vColor;
uniform float uOpacity;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.35, 0.5, dist)) * uOpacity;
  gl_FragColor = vec4(vColor * alpha, alpha);
}
`

function makeCrowd(count, palette, spread) {
  const pos    = new Float32Array(count * 3)
  const col    = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  const phases = new Float32Array(count)
  const sway   = new Float32Array(count)
  const driftSpeedX = new Float32Array(count)
  const driftPhaseX = new Float32Array(count)
  const driftAmpX   = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * spread.x
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread.y
    pos[i * 3 + 2] = spread.zOffset - Math.random() * spread.z

    const c = palette[Math.floor(Math.random() * palette.length)].clone()
    c.multiplyScalar(0.30 + Math.random() * 0.30)
    col[i * 3]     = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b

    speeds[i]       = 0.030 + Math.random() * 0.060
    phases[i]       = Math.random() * Math.PI * 2
    sway[i]         = 0.12  + Math.random() * 0.24
    driftSpeedX[i]  = 0.015 + Math.random() * 0.035
    driftPhaseX[i]  = Math.random() * Math.PI * 2
    driftAmpX[i]    = 0.25  + Math.random() * 0.55
  }
  return { pos, col, speeds, phases, sway, driftSpeedX, driftPhaseX, driftAmpX }
}

// Circle-form ring: positions on concentric rings around origin (purple/lavender)
function makeCircleCrowd(count, palette, radiusMin, radiusMax, yMin, yMax, zOffset) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const baseAngle = new Float32Array(count)
  const baseRadius = new Float32Array(count)
  const baseY = new Float32Array(count)
  const orbitSpeed = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin)
    const y = yMin + Math.random() * (yMax - yMin)
    baseAngle[i] = angle
    baseRadius[i] = radius
    baseY[i] = y
    orbitSpeed[i] = 0.03 + Math.random() * 0.06
    pos[i * 3] = Math.cos(angle) * radius
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = zOffset + Math.sin(angle) * radius

    const c = palette[Math.floor(Math.random() * palette.length)].clone()
    c.multiplyScalar(0.35 + Math.random() * 0.35)
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  return { pos, col, baseAngle, baseRadius, baseY, orbitSpeed }
}

// Ground mist: y -2 to -0.5, slow horizontal drift, purple-blue
function makeMistCrowd(count, palette, xMin, xMax, yMin, yMax, zMin, zMax) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const driftSpeed = new Float32Array(count)
  const phase = new Float32Array(count)
  const originX = new Float32Array(count)
  const originY = new Float32Array(count)
  const originZ = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const x = xMin + Math.random() * (xMax - xMin)
    const y = yMin + Math.random() * (yMax - yMin)
    const z = zMin + Math.random() * (zMax - zMin)
    originX[i] = x
    originY[i] = y
    originZ[i] = z
    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
    driftSpeed[i] = 0.008 + Math.random() * 0.015
    phase[i] = Math.random() * Math.PI * 2
    const c = palette[Math.floor(Math.random() * palette.length)].clone()
    c.multiplyScalar(0.4 + Math.random() * 0.4)
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  return { pos, col, driftSpeed, phase, originX, originY, originZ }
}

function ParticleCloud({ count, palette, spread, uSize, baseOpacity, hoveredPos, selectedOrbWorldPos }) {
  const ptsRef   = useRef()
  const matRef   = useRef()
  const timerRef = useRef(new THREE.Timer())
  const burstStartRef  = useRef(null)
  const burstCenterRef = useRef(null)

  const { pos, col, speeds, phases, sway, driftSpeedX, driftPhaseX, driftAmpX } = useMemo(
    () => makeCrowd(count, palette, spread),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Cached origin X/Y for hover attraction
  const originX = useMemo(() => {
    const a = new Float32Array(count)
    for (let i = 0; i < count; i++) a[i] = pos[i * 3]
    return a
  }, [count, pos])
  const originY = useMemo(() => {
    const a = new Float32Array(count)
    for (let i = 0; i < count; i++) a[i] = pos[i * 3 + 1]
    return a
  }, [count, pos])

  const bias      = useRef({ x: 0, y: 0, z: 0 })
  const attract   = useRef(new Float32Array(count * 3))
  const hovRef    = useRef(null)
  hovRef.current  = hoveredPos

  const ATTR_R_SQ = 49          // 7² attract radius
  const ATTR_STR  = 0.08
  const ATTR_LERP = 0.016

  // Uniforms — declared once, updated in useFrame (no re-renders)
  const uniforms = useMemo(() => ({
    uSize:    { value: uSize },
    uOpacity: { value: baseOpacity },
  }), [uSize, baseOpacity])

  useFrame(() => {
    if (!ptsRef.current || !matRef.current) return
    timerRef.current.update()
    const t    = timerRef.current.getElapsed()
    const posA = ptsRef.current.geometry.attributes.position
    const hpos = hovRef.current
    const att  = attract.current

    // Burst: when an orb is selected, start one-time outward nudge for nearby particles (decays 0.5s)
    if (selectedOrbWorldPos) {
      if (burstStartRef.current === null) {
        burstStartRef.current = t
        burstCenterRef.current = selectedOrbWorldPos
      }
    } else {
      burstStartRef.current = null
      burstCenterRef.current = null
    }

    // No hover-driven drift: keep scene stable; only the hovered orb responds (Part 2/4).
    bias.current.x = 0
    bias.current.y = 0
    bias.current.z = 0

    const halfY = spread.y / 2
    const wrapY = spread.y

    for (let i = 0; i < count; i++) {
      const s = speeds[i], p = phases[i], sw = sway[i]
      const dSpeed = driftSpeedX[i], dPhase = driftPhaseX[i], dAmp = driftAmpX[i]

      // Upward drift with wrap
      const drift   = (t * s + p * (wrapY / (Math.PI * 2))) % wrapY
      const rawY    = originY[i] + drift
      const wrapped = ((rawY + halfY) % wrapY + wrapY) % wrapY - halfY

      // Per-particle horizontal drift (reduces uniformity)
      const horizDrift = Math.sin(t * dSpeed + dPhase) * dAmp

      // No per-particle pull toward hovered orb — one-orb-one-response; scene stays quiet (Part 2/4).
      att[i * 3]     = THREE.MathUtils.lerp(att[i * 3],     0, ATTR_LERP)
      att[i * 3 + 1] = THREE.MathUtils.lerp(att[i * 3 + 1], 0, ATTR_LERP)
      att[i * 3 + 2] = THREE.MathUtils.lerp(att[i * 3 + 2], 0, ATTR_LERP)

      posA.array[i * 3]     = originX[i] + bias.current.x + Math.sin(t * s * 0.55 + p) * sw
                             + Math.sin(t * 0.22 + p * 0.5) * sw * 0.5 + horizDrift + att[i * 3]
      posA.array[i * 3 + 1] = wrapped + bias.current.y + att[i * 3 + 1]
      posA.array[i * 3 + 2] = pos[i * 3 + 2] + bias.current.z + att[i * 3 + 2]

      // One-time outward burst for particles near selected orb (subtle, decays over 0.5s)
      if (burstCenterRef.current && burstStartRef.current !== null) {
        const el = t - burstStartRef.current
        if (el < 0.5) {
          const cx = burstCenterRef.current[0]
          const cy = burstCenterRef.current[1]
          const cz = burstCenterRef.current[2]
          let px = posA.array[i * 3]
          let py = posA.array[i * 3 + 1]
          let pz = posA.array[i * 3 + 2]
          const dx = px - cx
          const dy = py - cy
          const dz = pz - cz
          const distSq = dx * dx + dy * dy + dz * dz
          const BURST_R_SQ = 36  // 6 units
          if (distSq > 0.01 && distSq < BURST_R_SQ) {
            const dist = Math.sqrt(distSq)
            const fade = 1 - el / 0.5
            const strength = 0.22 * fade
            posA.array[i * 3]     = px + (dx / dist) * strength
            posA.array[i * 3 + 1] = py + (dy / dist) * strength
            posA.array[i * 3 + 2] = pz + (dz / dist) * strength
          }
        }
      }
      // Trunk burst: 5–8 particles near trunk (0, 0, -3.5) emit outward when memory opens
      if (burstCenterRef.current && burstStartRef.current !== null) {
        const el = t - burstStartRef.current
        if (el < 0.6) {
          const trunkX = 0, trunkY = 0, trunkZ = -3.5
          const px = posA.array[i * 3], py = posA.array[i * 3 + 1], pz = posA.array[i * 3 + 2]
          const dx = px - trunkX, dy = py - trunkY, dz = pz - trunkZ
          const distSq = dx * dx + dy * dy + dz * dz
          const TRUNK_R_SQ = 25  // ~5–8 particles in range
          if (distSq > 0.01 && distSq < TRUNK_R_SQ) {
            const dist = Math.sqrt(distSq)
            const fade = 1 - el / 0.6
            const strength = 0.35 * fade
            posA.array[i * 3]     = px + (dx / dist) * strength
            posA.array[i * 3 + 1] = py + (dy / dist) * strength
            posA.array[i * 3 + 2] = pz + (dz / dist) * strength
          }
        }
      }
    }
    posA.needsUpdate = true

    // Gentle flicker — hard cap at 0.15 so particles never compete with orbs
    matRef.current.uniforms.uOpacity.value =
      Math.min(0.15, baseOpacity * (0.55 + Math.sin(t * 0.16) * 0.28))
  })

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,  3]} />
        <bufferAttribute attach="attributes-aColor"   args={[col,  3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

// Circle-form ring: particles orbit on rings around the scene (purple/lavender)
function RingCloud({ count, palette, radiusMin, radiusMax, yMin, yMax, zOffset, uSize, baseOpacity }) {
  const ptsRef = useRef()
  const matRef = useRef()
  const orbitPhaseRef = useRef(0)

  const { pos, col, baseAngle, baseRadius, baseY, orbitSpeed } = useMemo(
    () => makeCircleCrowd(count, palette, radiusMin, radiusMax, yMin, yMax, zOffset),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const uniforms = useMemo(() => ({
    uSize: { value: uSize },
    uOpacity: { value: baseOpacity },
  }), [uSize, baseOpacity])

  useFrame((state, delta) => {
    if (!ptsRef.current || !matRef.current) return
    const t = state.clock.elapsedTime
    orbitPhaseRef.current = t
    const posA = ptsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const angle = baseAngle[i] + t * orbitSpeed[i]
      const r = baseRadius[i]
      const floatY = Math.sin(t * 0.2 + i * 0.7) * 0.08
      posA[i * 3] = Math.cos(angle) * r
      posA[i * 3 + 1] = baseY[i] + floatY
      posA[i * 3 + 2] = zOffset + Math.sin(angle) * r
    }
    ptsRef.current.geometry.attributes.position.needsUpdate = true
    matRef.current.uniforms.uOpacity.value =
      Math.min(0.14, baseOpacity * (0.6 + Math.sin(t * 0.12) * 0.25))
  })

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[col, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

// Ground mist: drift slowly horizontally near water level (y -2 to -0.5)
function MistCloud({ count, palette, xMin, xMax, yMin, yMax, zMin, zMax, uSize, baseOpacity }) {
  const ptsRef = useRef()
  const matRef = useRef()

  const { pos, col, driftSpeed, phase, originX, originY, originZ } = useMemo(
    () => makeMistCrowd(count, palette, xMin, xMax, yMin, yMax, zMin, zMax),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const uniforms = useMemo(() => ({
    uSize: { value: uSize },
    uOpacity: { value: baseOpacity },
  }), [uSize, baseOpacity])

  useFrame((state) => {
    if (!ptsRef.current || !matRef.current) return
    const t = state.clock.elapsedTime
    const posA = ptsRef.current.geometry.attributes.position.array
    const w = xMax - xMin
    for (let i = 0; i < count; i++) {
      let x = originX[i] + Math.sin(t * driftSpeed[i] * 60 + phase[i]) * 0.5
      x = ((x - xMin) % w + w) % w + xMin
      posA[i * 3] = x
      posA[i * 3 + 1] = originY[i] + Math.sin(t * 0.1 + i * 0.5) * 0.05
      posA[i * 3 + 2] = originZ[i]
    }
    ptsRef.current.geometry.attributes.position.needsUpdate = true
    matRef.current.uniforms.uOpacity.value =
      Math.min(0.14, baseOpacity * (0.6 + Math.sin(t * 0.08) * 0.25))
  })

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[col, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

export default function Particles() {
  const hoveredOrb = useStore((s) => s.hoveredOrb)
  const selectedOrbWorldPos = useStore((s) => s.selectedOrbWorldPos)
  const isMobile = useStore((s) => s.isMobile)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const hoveredPos = useMemo(() => {
    if (!hoveredOrb) return null
    return MEMORIES.find((m) => m.id === hoveredOrb)?.position ?? null
  }, [hoveredOrb])

  const mult = reducedMotion ? 0.35 : isMobile ? 0.5 : 1
  const blossomCount = Math.max(20, Math.floor(BLOSSOM_COUNT * mult))
  const sporeCount = Math.max(10, Math.floor(SPORE_COUNT * mult))
  const ringCount = Math.max(12, Math.floor(RING_COUNT * mult))
  const mistCount = Math.max(15, Math.floor(MIST_COUNT * mult))
  const waterTreeCount = Math.max(25, Math.floor(55 * mult))

  return (
    <>
      {/* Blossoms — full scene width, ground to branches */}
      <ParticleCloud
        count={blossomCount}
        palette={BLOSSOM_PALETTE}
        spread={{ x: 28, y: 20, z: 12, zOffset: -8 }}
        uSize={0.8}
        baseOpacity={0.14}
        hoveredPos={hoveredPos}
        selectedOrbWorldPos={selectedOrbWorldPos}
      />
      {/* Blossoms near orbs — spread into orb constellation area */}
      <ParticleCloud
        count={Math.max(8, Math.floor(24 * mult))}
        palette={BLOSSOM_PALETTE}
        spread={{ x: 14, y: 10, z: 2.5, zOffset: -3.5 }}
        uSize={0.7}
        baseOpacity={0.12}
        hoveredPos={hoveredPos}
        selectedOrbWorldPos={selectedOrbWorldPos}
      />
      {/* Circle-form ring — purple/lavender particles orbiting around tree and orbs */}
      <RingCloud
        count={ringCount}
        palette={RING_PALETTE}
        radiusMin={3}
        radiusMax={6.5}
        yMin={-1.5}
        yMax={2.5}
        zOffset={-3.5}
        uSize={0.75}
        baseOpacity={0.12}
      />
      {/* Spores — soft purple pinpricks */}
      <ParticleCloud
        count={sporeCount}
        palette={SPORE_PALETTE}
        spread={{ x: 24, y: 16, z: 8, zOffset: -9 }}
        uSize={0.6}
        baseOpacity={0.11}
        hoveredPos={hoveredPos}
        selectedOrbWorldPos={selectedOrbWorldPos}
      />
      {/* Ground mist — purple-blue, y -2 to -0.5, slow horizontal drift */}
      <MistCloud
        count={mistCount}
        palette={MIST_PALETTE}
        xMin={-8}
        xMax={8}
        yMin={-2}
        yMax={-0.5}
        zMin={-4}
        zMax={1}
        uSize={0.8}
        baseOpacity={0.12}
      />
      {/* Water–tree drift: purple/cyan particles floating around orbs on the left from water at tree */}
      <MistCloud
        count={waterTreeCount}
        palette={WATER_TREE_PALETTE}
        xMin={-5.5}
        xMax={0.5}
        yMin={-1.5}
        yMax={3}
        zMin={-4.2}
        zMax={-2}
        uSize={0.7}
        baseOpacity={0.13}
      />
    </>
  )
}
