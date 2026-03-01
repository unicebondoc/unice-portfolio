import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES, TIER_RADIUS } from '../../data/memories'

/**
 * MemoryOrb — one glowing bioluminescent memory sphere.
 *
 * Tiers:
 *   core       → radius 1.2, emissive ~1.2 (reduced 40% from 2.0)
 *   supporting → radius 0.7, emissive ~0.48 (reduced 40% from 0.8)
 *
 * Photo texture:
 *   If memory.image is set, an inner sphere shows the texture through
 *   the semi-transparent outer distorted shell (crystal orb effect).
 *   Wrapped in OrbImageErrorBoundary + Suspense — missing images are silent.
 */

// ── Error boundary — silently drops texture if image 404s ────────
class OrbImageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

// ── Inner photo sphere — called only when image URL is truthy ─────
function TexturedInner({ radius, url }) {
  const texture = useTexture(url)
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
  return (
    <Sphere args={[radius, 40, 40]}>
      <meshStandardMaterial
        map={texture}
        roughness={0.12}
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

  // Tier-dependent constants (emissive reduced 40% vs Phase 5)
  const RADIUS      = TIER_RADIUS[tier] ?? 1.0
  const BASE_EMIT   = isCore ? 1.2  : 0.48
  const DISTORT     = isCore ? 0.42 : 0.28
  const DIST_SPEED  = isCore ? 2.4  : 1.5
  const BREATHE_AMP  = isCore ? 0.040 : 0.022
  const BREATHE_FREQ = isCore ? 1.5   : 0.9
  const FLOAT_AMP    = isCore ? 0.14  : 0.09
  const FLOAT_SPEED  = isCore ? 0.55  : 0.38

  const groupRef = useRef()
  const meshRef  = useRef()
  const glowRef  = useRef()
  const outerRef = useRef()

  const {
    hoveredOrb, setHoveredOrb,
    selectedOrb, setSelectedOrb,
    pulsingOrbs,
  } = useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  // When hovering a core orb → dim supporting orbs
  const hoveredMemory = MEMORIES.find((m) => m.id === hoveredOrb)
  const hoveredIsCore = hoveredMemory?.tier === 'core'
  const isDimmed      = hoveredIsCore && !isCore && !isActive

  // Entrance stagger
  const birthRef    = useRef(null)
  const INTRO_DELAY = index * 0.14
  const INTRO_RISE  = 0.80

  // Pulse (Gemini-triggered)
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
    const age      = t - birthRef.current
    const introRaw = Math.max(0, (age - INTRO_DELAY) / INTRO_RISE)
    const intro    = Math.min(1, introRaw)
    const introEase = 1 - Math.pow(1 - intro, 3)

    // ── Pulse (Gemini trigger) ────────────────────────────────
    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const pe = t - pulseStartRef.current
      if (pe < PULSE_DUR) pulseFactor = Math.sin((pe / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    // ── Float ─────────────────────────────────────────────────
    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_SPEED + seed) * FLOAT_AMP

    // ── Rotation ──────────────────────────────────────────────
    groupRef.current.rotation.y = t * (isCore ? 0.14 : 0.08)
    groupRef.current.rotation.z = Math.sin(t * 0.28 + seed) * 0.05

    // ── Scale ─────────────────────────────────────────────────
    const breathe  = 1 + Math.sin(t * BREATHE_FREQ + seed) * BREATHE_AMP
    const hoverMul = isActive ? 1.18 : isDimmed ? 0.90 : 1.0
    const pulseMul = 1 + pulseFactor * (isCore ? 0.45 : 0.30)
    const target   = introEase * breathe * hoverMul * pulseMul

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.10)
    )

    // ── Emissive ──────────────────────────────────────────────
    if (meshRef.current) {
      const dimFactor  = isDimmed ? 0.3 : 1.0
      const activeMul  = isActive ? 1.35 : 1.0
      const targetEmit = BASE_EMIT * dimFactor * activeMul + pulseFactor * 0.90
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetEmit,
        0.08
      )
    }

    // ── Inner glow opacity ────────────────────────────────────
    if (glowRef.current) {
      const baseOp  = isCore ? 0.40 : 0.22
      const activeO = isActive ? 0.65 : baseOp
      const dimO    = isDimmed ? baseOp * 0.3 : activeO
      glowRef.current.material.opacity =
        (dimO + pulseFactor * 0.28) * (0.85 + Math.sin(t * 1.8 + seed) * 0.15)
    }

    // ── Outer halo opacity ────────────────────────────────────
    if (outerRef.current) {
      const baseH   = isCore ? (isActive ? 0.14 : 0.055) : (isActive ? 0.07 : 0.022)
      const targetH = (isDimmed ? baseH * 0.2 : baseH) + pulseFactor * 0.16
      outerRef.current.material.opacity = THREE.MathUtils.lerp(
        outerRef.current.material.opacity,
        targetH,
        0.06
      )
    }
  })

  const handleClick = () => setSelectedOrb(isSelected ? null : id)
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHoveredOrb(id)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut = () => {
    setHoveredOrb(null)
    document.body.style.cursor = 'auto'
  }

  // Shell becomes more transparent when a photo is present,
  // so the image shows through the "crystal" surface
  const hasImage    = Boolean(image)
  const shellOpacity = isFuture
    ? 0.28
    : hasImage
      ? (isCore ? 0.52 : 0.46)
      : (isCore ? 0.88 : 0.78)

  const innerRadius = RADIUS * 0.55
  const photoRadius = RADIUS * 0.82   // inside the shell
  const outerRadius = RADIUS * 1.16

  return (
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>
      {/* ── Photo texture (inner sphere, shows through shell) ──── */}
      {hasImage && (
        <OrbImageErrorBoundary>
          <Suspense fallback={null}>
            <TexturedInner radius={photoRadius} url={image} />
          </Suspense>
        </OrbImageErrorBoundary>
      )}

      {/* ── Main distorted shell ──────────────────────────────── */}
      <Sphere
        ref={meshRef}
        args={[RADIUS, isCore ? 64 : 48, isCore ? 64 : 48]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <MeshDistortMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={BASE_EMIT}
          distort={DISTORT}
          speed={DIST_SPEED}
          roughness={0}
          metalness={isFuture ? 0 : 0.05}
          transparent
          opacity={shellOpacity}
        />
      </Sphere>

      {/* ── Inner glow core ───────────────────────────────────── */}
      <Sphere ref={glowRef} args={[innerRadius, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.16 : isCore ? 0.40 : 0.22}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* ── Outer soft halo ───────────────────────────────────── */}
      <Sphere ref={outerRef} args={[outerRadius, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.018 : isCore ? 0.055 : 0.022}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}
