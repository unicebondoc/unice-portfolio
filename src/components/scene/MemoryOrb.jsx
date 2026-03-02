import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES, TIER_RADIUS } from '../../data/memories'

/**
 * MemoryOrb — 3-sphere stack, MeshStandardMaterial only.
 *
 *   [outer halo]  scale 1.1 — same color, opacity 0.15, soft glow
 *   [main body]   scale 1.0 — texture map (or orb color fallback), opacity 0.75
 *   [inner core]  scale 0.45 — pure emissive, creates glowing center
 *
 * Texture is applied directly on the main body sphere so it's visible.
 * The inner core is kept smaller (0.45) so it doesn't cover the photo.
 */

// ── Error boundary — silently drops texture if image 404s ─────────
class OrbImageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}

// ── Textured main-body sphere ─────────────────────────────────────
// Separate component so useTexture (which suspends) is isolated here.
// The bodyMat ref is forwarded so the parent's useFrame can animate opacity.
function OrbBody({ radius, isCore, url, bodyMat, onClick, onPointerOver, onPointerOut }) {
  const texture = useTexture(url)
  return (
    <Sphere
      args={[radius, isCore ? 64 : 48, isCore ? 64 : 48]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <meshStandardMaterial
        ref={bodyMat}
        map={texture}
        color="white"
        transparent
        opacity={0.75}
        roughness={0.1}
        metalness={0.2}
      />
    </Sphere>
  )
}

// ── Colored fallback — shown while texture is loading ─────────────
function OrbBodyFallback({ radius, isCore, orbColor, bodyMat, onClick, onPointerOver, onPointerOut }) {
  return (
    <Sphere
      args={[radius, isCore ? 64 : 48, isCore ? 64 : 48]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <meshStandardMaterial
        ref={bodyMat}
        color={orbColor}
        transparent
        opacity={0.75}
        roughness={0.1}
        metalness={0.3}
      />
    </Sphere>
  )
}

// ── Main orb component ────────────────────────────────────────────
export default function MemoryOrb({ memory, index = 0 }) {
  const { id, color, position, isFuture, tier, image } = memory

  const isCore  = tier === 'core'
  const RADIUS  = TIER_RADIUS[tier] ?? 1.0

  const BREATHE_SPEED   = isCore ? 1.80 : 1.55
  const BASE_CORE_EMIT  = isCore ? 1.6  : 0.90
  const FLOAT_AMP       = isCore ? 0.13 : 0.08
  const FLOAT_SPEED     = isCore ? 0.50 : 0.36
  const POINT_INTENSITY = isCore ? 0.85 : 0.24
  const POINT_DISTANCE  = isCore ? 6.0  : 3.5

  const groupRef = useRef()
  const haloMat  = useRef()
  const bodyMat  = useRef()
  const coreMat  = useRef()
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

    if (birthRef.current === null) birthRef.current = t
    const age       = t - birthRef.current
    const introRaw  = Math.max(0, (age - INTRO_DELAY) / INTRO_RISE)
    const introEase = 1 - Math.pow(1 - Math.min(1, introRaw), 3)

    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const pe = t - pulseStartRef.current
      if (pe < PULSE_DUR) pulseFactor = Math.sin((pe / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_SPEED + seed) * FLOAT_AMP
    groupRef.current.rotation.y  = t * (isCore ? 0.07 : 0.04)
    groupRef.current.rotation.z  = Math.sin(t * 0.20 + seed) * 0.03

    const breathe  = 0.97 + (Math.sin(t * BREATHE_SPEED + seed) * 0.5 + 0.5) * 0.06
    const hoverMul = isActive ? 1.12 : isDimmed ? 0.88 : 1.0
    const pulseMul = 1 + pulseFactor * (isCore ? 0.28 : 0.18)
    const target   = introEase * breathe * hoverMul * pulseMul
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.06)
    )

    if (haloMat.current) {
      const tgt = isDimmed ? 0.05 : isActive ? 0.28 : 0.15
      haloMat.current.opacity = THREE.MathUtils.lerp(haloMat.current.opacity, tgt, 0.05)
    }

    if (bodyMat.current) {
      const tgt = isDimmed ? 0.35 : isActive ? 0.92 : (isFuture ? 0.55 : 0.75)
      bodyMat.current.opacity = THREE.MathUtils.lerp(bodyMat.current.opacity, tgt, 0.05)
    }

    if (coreMat.current) {
      const tgt = BASE_CORE_EMIT * (isDimmed ? 0.20 : 1.0) * (isActive ? 2.0 : 1.0)
               + pulseFactor * 0.80
      coreMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMat.current.emissiveIntensity, tgt, 0.06
      )
    }

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

  const bodyFallback = (
    <OrbBodyFallback
      radius={RADIUS}
      isCore={isCore}
      orbColor={orbColor}
      bodyMat={bodyMat}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )

  return (
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>

      {/* ── PointLight at orb center ───────────────────────────── */}
      <pointLight
        ref={pointRef}
        position={[0, 0, 0]}
        color={color}
        intensity={POINT_INTENSITY}
        distance={POINT_DISTANCE}
        decay={2}
      />

      {/* ── Outer halo — soft color glow aura ──────────────────── */}
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

      {/* ── Main body — texture map on the sphere surface ──────── */}
      {image ? (
        <OrbImageErrorBoundary fallback={bodyFallback}>
          <Suspense fallback={bodyFallback}>
            <OrbBody
              radius={RADIUS}
              isCore={isCore}
              url={image}
              bodyMat={bodyMat}
              onClick={handleClick}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            />
          </Suspense>
        </OrbImageErrorBoundary>
      ) : (
        bodyFallback
      )}

      {/* ── Inner core — pure emissive glow (smaller so photo shows) */}
      <Sphere args={[RADIUS * 0.45, 24, 24]}>
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
