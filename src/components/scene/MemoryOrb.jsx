import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES, TIER_RADIUS } from '../../data/memories'

/**
 * MemoryOrb — 2 meshes per orb:
 *
 *   [outer halo]  RADIUS * 1.1 — orb color, opacity 0.15, no depth write
 *   [main body]   RADIUS * 1.0 — emissive orb color + optional photo texture
 *
 * Texture loading is isolated in OrbTextureLoader so a 404 (e.g. belong.png
 * not yet uploaded) is caught by OrbErrorBoundary and falls back to a plain
 * colored orb — the rest of the scene stays intact.
 */

// ── Catches texture 404s per-orb; scene never crashes ─────────────
class OrbErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    // On texture failure render the same orb without a photo
    return this.state.failed
      ? <OrbInner memory={this.props.memory} index={this.props.index} texture={null} />
      : this.props.children
  }
}

// ── Suspends while texture loads; parent Suspense / ErrorBoundary ──
// catches loading state and errors respectively.
function OrbTextureLoader({ memory, index }) {
  const texture = useTexture(memory.image)
  return <OrbInner memory={memory} index={index} texture={texture} />
}

// ── All animation + rendering; texture is injected as a prop ───────
function OrbInner({ memory, index = 0, texture = null }) {
  const { id, color, position, isFuture, tier } = memory

  const isCore  = tier === 'core'
  const RADIUS  = TIER_RADIUS[tier] ?? 1.0

  const BREATHE_SPEED   = isCore ? 1.80 : 1.55
  const FLOAT_AMP       = isCore ? 0.13 : 0.08
  const FLOAT_SPEED     = isCore ? 0.50 : 0.36
  const POINT_INTENSITY = isCore ? 0.85 : 0.24
  const POINT_DISTANCE  = isCore ? 6.0  : 3.5

  const groupRef = useRef()
  const haloMat  = useRef()
  const bodyMat  = useRef()
  const pointRef = useRef()

  const { hoveredOrb, setHoveredOrb, selectedOrb, setSelectedOrb, pulsingOrbs } = useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  const hoveredMemory = MEMORIES.find((m) => m.id === hoveredOrb)
  const isDimmed      = hoveredMemory?.tier === 'core' && !isCore && !isActive

  const birthRef    = useRef(null)
  const INTRO_DELAY = index * 0.14
  const INTRO_RISE  = 0.80

  const pulseStartRef = useRef(null)
  const wasPulsingRef = useRef(false)
  const PULSE_DUR     = 1.8

  const seed     = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbColor = useMemo(() => new THREE.Color(color), [color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    // Entrance stagger
    if (birthRef.current === null) birthRef.current = t
    const age       = t - birthRef.current
    const introRaw  = Math.max(0, (age - INTRO_DELAY) / INTRO_RISE)
    const introEase = 1 - Math.pow(1 - Math.min(1, introRaw), 3)

    // Pulse
    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const pe = t - pulseStartRef.current
      if (pe < PULSE_DUR) pulseFactor = Math.sin((pe / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    // Float & rotation
    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_SPEED + seed) * FLOAT_AMP
    groupRef.current.rotation.y  = t * (isCore ? 0.07 : 0.04)
    groupRef.current.rotation.z  = Math.sin(t * 0.20 + seed) * 0.03

    // Breathing scale
    const breathe  = 0.97 + (Math.sin(t * BREATHE_SPEED + seed) * 0.5 + 0.5) * 0.06
    const hoverMul = isActive ? 1.12 : isDimmed ? 0.88 : 1.0
    const pulseMul = 1 + pulseFactor * (isCore ? 0.28 : 0.18)
    const target   = introEase * breathe * hoverMul * pulseMul
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.06)
    )

    // Halo opacity
    if (haloMat.current) {
      const tgt = isDimmed ? 0.04 : isActive ? 0.35 : 0.15
      haloMat.current.opacity = THREE.MathUtils.lerp(haloMat.current.opacity, tgt, 0.05)
    }

    // Body opacity + emissive glow
    if (bodyMat.current) {
      const opTgt = isDimmed ? 0.30 : isActive ? 0.95 : (isFuture ? 0.55 : 0.85)
      bodyMat.current.opacity = THREE.MathUtils.lerp(bodyMat.current.opacity, opTgt, 0.05)

      const emTgt = 0.4 * (isDimmed ? 0.10 : isActive ? 2.5 : 1.0) + pulseFactor * 0.80
      bodyMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        bodyMat.current.emissiveIntensity, emTgt, 0.06
      )
    }

    // PointLight
    if (pointRef.current) {
      const tgt = POINT_INTENSITY * (isActive ? 2.4 : isDimmed ? 0.15 : 1.0)
               + pulseFactor * 0.55
      pointRef.current.intensity = THREE.MathUtils.lerp(
        pointRef.current.intensity, tgt, 0.08
      )
    }
  })

  const handleClick       = () => setSelectedOrb(isSelected ? null : id)
  const handlePointerOver = (e) => { e.stopPropagation(); setHoveredOrb(id); document.body.style.cursor = 'pointer' }
  const handlePointerOut  = () => { setHoveredOrb(null); document.body.style.cursor = 'auto' }

  return (
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>

      {/* ── Per-orb point light ─────────────────────────────────── */}
      <pointLight
        ref={pointRef}
        position={[0, 0, 0]}
        color={color}
        intensity={POINT_INTENSITY}
        distance={POINT_DISTANCE}
        decay={2}
      />

      {/* ── Outer halo ──────────────────────────────────────────── */}
      <Sphere args={[RADIUS * 1.1, 32, 32]}>
        <meshStandardMaterial
          ref={haloMat}
          color={orbColor}
          transparent
          opacity={0.15}
          roughness={1}
          metalness={0}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </Sphere>

      {/* ── Main body — photo texture or plain emissive color ───── */}
      <Sphere
        args={[RADIUS, isCore ? 64 : 48, isCore ? 64 : 48]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          ref={bodyMat}
          map={texture || undefined}
          color={texture ? 'white' : orbColor}
          emissive={orbColor}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </Sphere>

    </group>
  )
}

// ── Per-orb Suspense + error boundary ─────────────────────────────
// Each orb loads its texture independently.
// 404s (e.g. belong.png not yet uploaded) fall back to plain orb.
export default function MemoryOrb({ memory, index }) {
  return (
    <OrbErrorBoundary memory={memory} index={index}>
      <Suspense fallback={null}>
        <OrbTextureLoader memory={memory} index={index} />
      </Suspense>
    </OrbErrorBoundary>
  )
}
