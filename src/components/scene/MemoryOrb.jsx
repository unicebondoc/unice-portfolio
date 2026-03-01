import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES, TIER_RADIUS } from '../../data/memories'

/**
 * MemoryOrb — one glowing bioluminescent memory sphere.
 *
 * Tiers:
 *   core       → radius 1.2, emissive ~2.0, fast breathe, front z
 *   supporting → radius 0.7, emissive ~0.8, slow breathe, back z
 *
 * Dimming: when a core orb is hovered, all supporting orbs drop
 *   emissiveIntensity to 0.3 of normal.
 *
 * Pulse: Gemini chat pulses the orb via pulsingOrbs store key.
 */
export default function MemoryOrb({ memory, index = 0 }) {
  const { id, color, glowColor, position, isFuture, tier } = memory

  const isCore = tier === 'core'

  // Sizing by tier
  const RADIUS     = TIER_RADIUS[tier] ?? 1.0
  const BASE_EMIT  = isCore ? 2.0  : 0.8
  const DISTORT    = isCore ? 0.42 : 0.28
  const DIST_SPEED = isCore ? 2.4  : 1.5
  const BREATHE_AMP   = isCore ? 0.040 : 0.022
  const BREATHE_FREQ  = isCore ? 1.5   : 0.9
  const FLOAT_AMP     = isCore ? 0.14  : 0.09
  const FLOAT_SPEED   = isCore ? 0.55  : 0.38

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
  const hoveredMemory  = MEMORIES.find((m) => m.id === hoveredOrb)
  const hoveredIsCore  = hoveredMemory?.tier === 'core'
  const isDimmed       = hoveredIsCore && !isCore && !isActive

  // Entrance stagger
  const birthRef     = useRef(null)
  const INTRO_DELAY  = index * 0.14
  const INTRO_RISE   = 0.80

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
    const intro     = Math.min(1, introRaw)
    const introEase = 1 - Math.pow(1 - intro, 3)  // cubic ease-out

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
      const dimFactor   = isDimmed ? 0.3 : 1.0
      const activeMul   = isActive ? 1.35 : 1.0
      const targetEmit  = BASE_EMIT * dimFactor * activeMul + pulseFactor * 1.5
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetEmit,
        0.08
      )
    }

    // ── Inner glow opacity ────────────────────────────────────
    if (glowRef.current) {
      const baseOp  = isCore ? 0.45 : 0.25
      const activeO = isActive ? 0.70 : baseOp
      const dimO    = isDimmed ? baseOp * 0.3 : activeO
      glowRef.current.material.opacity =
        (dimO + pulseFactor * 0.30) * (0.85 + Math.sin(t * 1.8 + seed) * 0.15)
    }

    // ── Outer halo opacity ────────────────────────────────────
    if (outerRef.current) {
      const baseH   = isCore ? (isActive ? 0.15 : 0.06) : (isActive ? 0.08 : 0.025)
      const targetH = (isDimmed ? baseH * 0.2 : baseH) + pulseFactor * 0.18
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

  const shellOpacity = isFuture ? 0.28 : isCore ? 0.92 : 0.80
  const innerRadius  = RADIUS * 0.55
  const outerRadius  = RADIUS * 1.16

  return (
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>
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
          opacity={isFuture ? 0.18 : isCore ? 0.45 : 0.25}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* ── Outer soft halo ───────────────────────────────────── */}
      <Sphere ref={outerRef} args={[outerRadius, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.02 : isCore ? 0.06 : 0.025}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}
