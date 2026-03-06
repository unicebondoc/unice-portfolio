import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MEMORIES } from '../../data/memories'
import useStore from '../../hooks/useStore'

/**
 * Particles — round dots via GLSL circle clip (dist > 0.5 discard, smoothstep soft edge).
 * Clouds: Blossom (purple/pink), Ring, Spore (soft purple), Ground Mist.
 */

const BLOSSOM_COUNT = 200
const SPORE_COUNT   = 140
const RING_COUNT    = 80
const MIST_COUNT    = 100
const SIDE_SPRITE_COUNT = 120
const FAR_SIDE_COUNT = 85
const CANOPY_SPARSE_COUNT = 35
const CANOPY_EDGE_COUNT = 22

/* Forest bioluminescent palette: 60% purple/violet, 30% cyan, 10% amber — soft glow */
const PURPLE = new THREE.Color('#c084fc')  // rgba(192, 132, 252, 0.6)
const CYAN   = new THREE.Color('#22d3ee')  // rgba(34, 211, 238, 0.5)
const AMBER  = new THREE.Color('#f0b840')  // rgba(240, 184, 64, 0.3)
const BIOLUMINESCENT_PALETTE = [
  PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, // 60%
  CYAN, CYAN, CYAN,                               // 30%
  AMBER,                                          // 10%
]

/* Background-like: bioluminescent mix (was soft purple/cyan) */
const BLOSSOM_PALETTE = BIOLUMINESCENT_PALETTE

/* Soft purple + cyan + amber glow */
const SPORE_PALETTE = BIOLUMINESCENT_PALETTE

// Ring: bioluminescent ambient
const RING_PALETTE = BIOLUMINESCENT_PALETTE

/* Ground mist: bioluminescent purple/cyan/amber */
const MIST_PALETTE = BIOLUMINESCENT_PALETTE

/* Water–tree: bioluminescent glow */
const WATER_TREE_PALETTE = BIOLUMINESCENT_PALETTE

/* Sides: bioluminescent like rest of forest */
const SIDE_SPRITE_PALETTE = BIOLUMINESCENT_PALETTE

/* Canopy + high drift: bioluminescent (purple/cyan/amber) */
const CANOPY_PALETTE = BIOLUMINESCENT_PALETTE

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

    // Gentle flicker — soft background glow (purple/cyan)
    matRef.current.uniforms.uOpacity.value =
      Math.min(0.3, baseOpacity * (0.6 + Math.sin(t * 0.16) * 0.18))
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
        blending={THREE.AdditiveBlending}
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
      Math.min(0.28, baseOpacity * (0.62 + Math.sin(t * 0.12) * 0.18))
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
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Ground mist: drift slowly horizontally near water level (y -2 to -0.5)
function MistCloud({ count, palette, xMin, xMax, yMin, yMax, zMin, zMax, uSize, baseOpacity, additive = false }) {
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
      Math.min(additive ? 0.34 : 0.24, baseOpacity * (0.62 + Math.sin(t * 0.08) * 0.18))
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
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
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

  const mult = reducedMotion ? 0.35 : isMobile ? 0.6 : 1
  const blossomCount = Math.max(40, Math.floor(BLOSSOM_COUNT * mult))
  const sporeCount = Math.max(20, Math.floor(SPORE_COUNT * mult))
  const ringCount = Math.max(24, Math.floor(RING_COUNT * mult))
  const mistCount = Math.max(30, Math.floor(MIST_COUNT * mult))
  const waterTreeCount = Math.max(40, Math.floor(80 * mult))
  const sideSpriteCount = Math.max(50, Math.floor(SIDE_SPRITE_COUNT * mult))
  const farSideCount = Math.max(40, Math.floor(FAR_SIDE_COUNT * mult))
  const canopySparseCount = Math.max(12, Math.floor(CANOPY_SPARSE_COUNT * mult))
  const canopyEdgeCount = Math.max(8, Math.floor(CANOPY_EDGE_COUNT * mult))

  return (
    <>
      {/* Blossoms — full scene, purple/cyan background glow */}
      <ParticleCloud
        count={blossomCount}
        palette={BLOSSOM_PALETTE}
        spread={{ x: 28, y: 20, z: 12, zOffset: -8 }}
        uSize={1.2}
        baseOpacity={0.28}
        hoveredPos={hoveredPos}
        selectedOrbWorldPos={selectedOrbWorldPos}
      />
      {/* Blossoms near orbs */}
      <ParticleCloud
        count={Math.max(20, Math.floor(48 * mult))}
        palette={BLOSSOM_PALETTE}
        spread={{ x: 14, y: 10, z: 2.5, zOffset: -3.5 }}
        uSize={1.05}
        baseOpacity={0.26}
        hoveredPos={hoveredPos}
        selectedOrbWorldPos={selectedOrbWorldPos}
      />
      {/* Circle-form ring — more visible */}
      <RingCloud
        count={ringCount}
        palette={RING_PALETTE}
        radiusMin={3}
        radiusMax={6.5}
        yMin={-1.5}
        yMax={2.5}
        zOffset={-3.5}
        uSize={1.05}
        baseOpacity={0.26}
      />
      {/* Spores — soft purple/cyan glow */}
      <ParticleCloud
        count={sporeCount}
        palette={SPORE_PALETTE}
        spread={{ x: 24, y: 16, z: 8, zOffset: -9 }}
        uSize={1.0}
        baseOpacity={0.24}
        hoveredPos={hoveredPos}
        selectedOrbWorldPos={selectedOrbWorldPos}
      />
      {/* Ground mist — more visible */}
      <MistCloud
        count={mistCount}
        palette={MIST_PALETTE}
        xMin={-8}
        xMax={8}
        yMin={-2}
        yMax={-0.5}
        zMin={-4}
        zMax={1}
        uSize={1.15}
        baseOpacity={0.3}
      />
      {/* Water–tree drift — more visible */}
      <MistCloud
        count={waterTreeCount}
        palette={WATER_TREE_PALETTE}
        xMin={-5.5}
        xMax={0.5}
        yMin={-1.5}
        yMax={3}
        zMin={-4.2}
        zMax={-2}
        uSize={1.15}
        baseOpacity={0.34}
        additive
      />
      {/* Left sprites — more particles, more visible */}
      <MistCloud
        count={sideSpriteCount}
        palette={SIDE_SPRITE_PALETTE}
        xMin={-7}
        xMax={-1.2}
        yMin={-2}
        yMax={3.5}
        zMin={-4.5}
        zMax={-1.5}
        uSize={1.6}
        baseOpacity={0.4}
        additive
      />
      {/* Right sprites — more particles, more visible */}
      <MistCloud
        count={sideSpriteCount}
        palette={SIDE_SPRITE_PALETTE}
        xMin={1.2}
        xMax={7}
        yMin={-2}
        yMax={3.5}
        zMin={-4.5}
        zMax={-1.5}
        uSize={1.6}
        baseOpacity={0.4}
        additive
      />
      {/* Far left — extra mystical column */}
      <MistCloud
        count={farSideCount}
        palette={SIDE_SPRITE_PALETTE}
        xMin={-9}
        xMax={-6}
        yMin={-2.5}
        yMax={4}
        zMin={-5}
        zMax={-1}
        uSize={1.5}
        baseOpacity={0.38}
        additive
      />
      {/* Far right — extra mystical column */}
      <MistCloud
        count={farSideCount}
        palette={SIDE_SPRITE_PALETTE}
        xMin={6}
        xMax={9}
        yMin={-2.5}
        yMax={4}
        zMin={-5}
        zMax={-1}
        uSize={1.5}
        baseOpacity={0.38}
        additive
      />
      {/* Canopy: sparse particles higher up (20% density feel), smaller, more transparent, pink + cyan */}
      <MistCloud
        count={canopySparseCount}
        palette={CANOPY_PALETTE}
        xMin={-10}
        xMax={10}
        yMin={1.5}
        yMax={5.5}
        zMin={-5}
        zMax={0}
        uSize={0.72}
        baseOpacity={0.16}
      />
      {/* Canopy left edge — sparse drift */}
      <MistCloud
        count={canopyEdgeCount}
        palette={CANOPY_PALETTE}
        xMin={-9}
        xMax={-4}
        yMin={1.2}
        yMax={5}
        zMin={-5}
        zMax={-0.5}
        uSize={0.68}
        baseOpacity={0.14}
      />
      {/* Canopy right edge — sparse drift */}
      <MistCloud
        count={canopyEdgeCount}
        palette={CANOPY_PALETTE}
        xMin={4}
        xMax={9}
        yMin={1.2}
        yMax={5}
        zMin={-5}
        zMax={-0.5}
        uSize={0.68}
        baseOpacity={0.14}
      />
    </>
  )
}
