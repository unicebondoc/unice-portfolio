import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES, TIER_RADIUS } from '../../data/memories'

/**
 * MemoryOrb — Glass Soul Crystal Orb.
 *
 * Structure (outer → inner):
 *   1. Outer halo      MeshBasicMaterial  — soft colored bloom ring
 *   2. Glass shell     MeshPhysicalMaterial — transmission 0.95, IOR 1.5
 *   3. Photo sphere    (optional) — texture inside the crystal
 *   4. Inner core      MeshStandardMaterial  — emissive soul glow
 *   5. PointLight      — lights surrounding scene/particles in orb color
 *
 * Animations:
 *   - Breathing: slow scale 0.97 ↔ 1.03
 *   - Float: gentle Y sine drift
 *   - Rotation: very slow Y + subtle Z wobble
 *   - Hover: core 3× brighter, glass more transparent, scale boost
 *   - Pulse: Gemini-triggered bell-curve scale + emissive burst
 */

// ── Error boundary — silently drops texture if image 404s ────────
class OrbImageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

// ── Inner photo sphere ────────────────────────────────────────────
function TexturedInner({ radius, url }) {
  const texture = useTexture(url)
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
  return (
    <Sphere args={[radius, 40, 40]}>
      <meshStandardMaterial
        map={texture}
        roughness={0.15}
        metalness={0}
        toneMapped={false}
      />
    </Sphere>
  )
}

// ── Main orb component ────────────────────────────────────────────
export default function MemoryOrb({ memory, index = 0 }) {
  const { id, color, glowColor, position, isFuture, tier, image } = memory

  const isCore = tier === 'core'

  const RADIUS      = TIER_RADIUS[tier] ?? 1.0
  const CORE_RADIUS = RADIUS * (isCore ? 0.38 : 0.35)  // inner soul
  const PHOTO_RADIUS = RADIUS * 0.82                    // photo inside shell
  const OUTER_RADIUS = RADIUS * 1.14                    // halo ring

  // Per-tier constants
  const BASE_CORE_EMIT  = isCore ? 1.2  : 0.48
  const BREATHE_SPEED   = isCore ? 0.75 : 0.52
  const FLOAT_AMP       = isCore ? 0.13 : 0.08
  const FLOAT_SPEED     = isCore ? 0.50 : 0.36
  const POINT_INTENSITY = isCore ? 0.85 : 0.24
  const POINT_DISTANCE  = isCore ? 6.0  : 3.5

  // Refs for the group and each material/light
  const groupRef  = useRef()
  const glassMat  = useRef()   // MeshPhysicalMaterial
  const coreMat   = useRef()   // inner core MeshStandardMaterial
  const outerMat  = useRef()   // halo MeshBasicMaterial
  const pointRef  = useRef()   // PointLight

  const {
    hoveredOrb, setHoveredOrb,
    selectedOrb, setSelectedOrb,
    pulsingOrbs,
  } = useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  // Supporting orbs dim when any core orb is hovered
  const hoveredMemory = MEMORIES.find((m) => m.id === hoveredOrb)
  const hoveredIsCore = hoveredMemory?.tier === 'core'
  const isDimmed      = hoveredIsCore && !isCore && !isActive

  // Entrance stagger
  const birthRef    = useRef(null)
  const INTRO_DELAY = index * 0.14
  const INTRO_RISE  = 0.80

  // Pulse
  const pulseStartRef = useRef(null)
  const wasPulsingRef = useRef(false)
  const PULSE_DUR     = 1.8

  const seed      = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbColor  = useMemo(() => new THREE.Color(color),     [color])
  const glowTHREE = useMemo(() => new THREE.Color(glowColor), [glowColor])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    // ── Birth / entrance ──────────────────────────────────────
    if (birthRef.current === null) birthRef.current = t
    const age       = t - birthRef.current
    const introRaw  = Math.max(0, (age - INTRO_DELAY) / INTRO_RISE)
    const introEase = 1 - Math.pow(1 - Math.min(1, introRaw), 3)

    // ── Pulse (Gemini trigger) ────────────────────────────────
    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const pe = t - pulseStartRef.current
      if (pe < PULSE_DUR) pulseFactor = Math.sin((pe / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    // ── Float & rotate ────────────────────────────────────────
    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_SPEED + seed) * FLOAT_AMP
    groupRef.current.rotation.y = t * (isCore ? 0.07 : 0.04)
    groupRef.current.rotation.z = Math.sin(t * 0.20 + seed) * 0.03

    // ── Breathing scale (0.97 ↔ 1.03) ────────────────────────
    const breathe  = 0.97 + (Math.sin(t * BREATHE_SPEED + seed) * 0.5 + 0.5) * 0.06
    const hoverMul = isActive ? 1.12 : isDimmed ? 0.88 : 1.0
    const pulseMul = 1 + pulseFactor * (isCore ? 0.28 : 0.18)
    const target   = introEase * breathe * hoverMul * pulseMul

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.08)
    )

    // ── Glass material ────────────────────────────────────────
    if (glassMat.current) {
      // Hover → glass becomes more transparent (higher transmission)
      const tgt_tx = isDimmed ? 0.82 : isActive ? 0.98 : 0.95
      const tgt_op = isDimmed ? 0.60 : isActive ? 0.94 : 0.88
      glassMat.current.transmission = THREE.MathUtils.lerp(
        glassMat.current.transmission, tgt_tx, 0.06
      )
      glassMat.current.opacity = THREE.MathUtils.lerp(
        glassMat.current.opacity, tgt_op, 0.06
      )
    }

    // ── Inner core emissive (×3 on hover) ────────────────────
    if (coreMat.current) {
      const dimF      = isDimmed ? 0.20 : 1.0
      const hoverBright = isActive ? 3.0 : 1.0
      const tgt = BASE_CORE_EMIT * dimF * hoverBright + pulseFactor * 0.80
      coreMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMat.current.emissiveIntensity, tgt, 0.10
      )
    }

    // ── PointLight ────────────────────────────────────────────
    if (pointRef.current) {
      const hoverBoost = isActive ? 2.4 : isDimmed ? 0.15 : 1.0
      const tgt = POINT_INTENSITY * hoverBoost + pulseFactor * 0.55
      pointRef.current.intensity = THREE.MathUtils.lerp(
        pointRef.current.intensity, tgt, 0.10
      )
    }

    // ── Outer halo ────────────────────────────────────────────
    if (outerMat.current) {
      const base = isCore ? 0.052 : 0.020
      const tgt  = (isDimmed ? base * 0.15 : isActive ? base * 2.6 : base)
        + pulseFactor * 0.10
      outerMat.current.opacity = THREE.MathUtils.lerp(
        outerMat.current.opacity, tgt, 0.06
      )
    }
  })

  const handleClick       = () => setSelectedOrb(isSelected ? null : id)
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHoveredOrb(id)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut  = () => {
    setHoveredOrb(null)
    document.body.style.cursor = 'auto'
  }

  const hasImage = Boolean(image)

  return (
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>

      {/* ── Point light at orb center ─────────────────────────── */}
      <pointLight
        ref={pointRef}
        position={[0, 0, 0]}
        color={color}
        intensity={POINT_INTENSITY}
        distance={POINT_DISTANCE}
        decay={2}
      />

      {/* ── Outer halo ring ───────────────────────────────────── */}
      <Sphere args={[OUTER_RADIUS, 32, 32]}>
        <meshBasicMaterial
          ref={outerMat}
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.018 : isCore ? 0.052 : 0.020}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* ── Glass crystal shell ───────────────────────────────── */}
      <Sphere
        args={[RADIUS, isCore ? 64 : 48, isCore ? 64 : 48]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshPhysicalMaterial
          ref={glassMat}
          color={orbColor}
          transmission={isFuture ? 0.98 : 0.95}
          roughness={0}
          metalness={0.05}
          thickness={RADIUS * 2}
          ior={1.5}
          transparent
          opacity={isFuture ? 0.92 : 0.88}
          envMapIntensity={2.0}
          side={THREE.FrontSide}
        />
      </Sphere>

      {/* ── Photo texture (inside glass) ──────────────────────── */}
      {hasImage && (
        <OrbImageErrorBoundary>
          <Suspense fallback={null}>
            <TexturedInner radius={PHOTO_RADIUS} url={image} />
          </Suspense>
        </OrbImageErrorBoundary>
      )}

      {/* ── Inner soul glow ───────────────────────────────────── */}
      <Sphere args={[CORE_RADIUS, 24, 24]}>
        <meshStandardMaterial
          ref={coreMat}
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={BASE_CORE_EMIT}
          roughness={0}
          metalness={0}
          toneMapped={false}
        />
      </Sphere>

    </group>
  )
}
