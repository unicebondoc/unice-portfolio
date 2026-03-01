import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

/**
 * MemoryOrb — a single glowing, pulsing memory sphere.
 *
 * index        — stagger offset for the entrance animation
 * isFuture     — ghostly white shell styling
 * pulsingOrbs  — Gemini-triggered brightness burst
 */
export default function MemoryOrb({ memory, index = 0 }) {
  const { id, color, glowColor, position, isFuture } = memory

  const groupRef = useRef()
  const meshRef  = useRef()
  const glowRef  = useRef()
  const outerRef = useRef()

  const { hoveredOrb, setHoveredOrb, selectedOrb, setSelectedOrb, pulsingOrbs } =
    useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  // Entrance animation state
  const birthRef      = useRef(null)   // clock time of first frame
  const INTRO_DELAY   = index * 0.16   // stagger per orb
  const INTRO_RISE    = 0.75           // seconds to scale from 0 → 1

  // Pulse animation state
  const pulseStartRef = useRef(null)
  const wasPulsingRef = useRef(false)
  const PULSE_DUR     = 1.8

  const seed      = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbColor  = useMemo(() => new THREE.Color(color),     [color])
  const glowTHREE = useMemo(() => new THREE.Color(glowColor), [glowColor])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    // ── Birth timestamp (set once on first frame) ──────────────
    if (birthRef.current === null) birthRef.current = t

    // ── Entrance: cubic ease-out, 0 → 1 ───────────────────────
    const born    = t - birthRef.current
    const raw     = Math.max(0, (born - INTRO_DELAY) / INTRO_RISE)
    const intro   = Math.min(1, raw)
    const introEased = 1 - Math.pow(1 - intro, 3)

    // ── Pulse: rising-edge detection ──────────────────────────
    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const e = t - pulseStartRef.current
      if (e < PULSE_DUR) pulseFactor = Math.sin((e / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    // ── Float ─────────────────────────────────────────────────
    const floatAmp   = isFuture ? 0.20 : 0.12
    const floatSpeed = isFuture ? 0.40 : 0.60
    groupRef.current.position.y =
      position[1] + Math.sin(t * floatSpeed + seed) * floatAmp

    // ── Rotation ──────────────────────────────────────────────
    groupRef.current.rotation.y = t * (isFuture ? 0.08 : 0.15)
    groupRef.current.rotation.z = Math.sin(t * 0.3 + seed) * (isFuture ? 0.08 : 0.05)

    // ── Scale: entrance × breathe × hover × pulse ────────────
    const breathe     = 1 + Math.sin(t * 1.2 + seed) * 0.018
    const hoverMult   = isActive ? 1.18 : 1.0
    const pulseMult   = 1 + pulseFactor * 0.40
    const targetScale = introEased * breathe * hoverMult * pulseMult

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.10)
    )

    // ── Material emissive flash on pulse ──────────────────────
    if (meshRef.current) {
      const base   = isFuture ? 0.15 : 0.38
      const active = isActive ? 0.70 : base
      const target = active + pulseFactor * 1.2
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        target,
        0.10
      )
    }

    // ── Inner glow ────────────────────────────────────────────
    if (glowRef.current) {
      const base  = isActive ? 0.60 : isFuture ? 0.20 : 0.35
      glowRef.current.material.opacity =
        (base + pulseFactor * 0.35) * (0.85 + Math.sin(t * 1.8 + seed) * 0.15)
    }

    // ── Outer halo ────────────────────────────────────────────
    if (outerRef.current) {
      const base   = isActive ? 0.12 : isFuture ? 0.03 : 0.04
      const target = base + pulseFactor * 0.22
      outerRef.current.material.opacity = THREE.MathUtils.lerp(
        outerRef.current.material.opacity,
        target,
        0.06
      )
    }
  })

  const handleClick        = () => setSelectedOrb(isSelected ? null : id)
  const handlePointerOver  = (e) => {
    e.stopPropagation()
    setHoveredOrb(id)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut   = () => {
    setHoveredOrb(null)
    document.body.style.cursor = 'auto'
  }

  const shellOpacity = isFuture ? 0.30 : 0.88
  const distort      = isFuture ? 0.55 : 0.38
  const distortSpeed = isFuture ? 1.40 : 2.20

  return (
    // scale={[0,0,0]} ensures no flash on first frame before useFrame takes over
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <MeshDistortMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={isFuture ? 0.15 : 0.38}
          distort={distort}
          speed={distortSpeed}
          roughness={0}
          metalness={isFuture ? 0 : 0.1}
          transparent
          opacity={shellOpacity}
        />
      </Sphere>

      <Sphere ref={glowRef} args={[0.65, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.20 : 0.35}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere ref={outerRef} args={[1.38, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.03 : 0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}
