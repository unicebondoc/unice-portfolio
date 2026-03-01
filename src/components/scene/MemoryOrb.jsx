import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

/**
 * MemoryOrb — a single glowing, pulsing memory sphere.
 *
 * isFuture orbs render as a ghostly white shell.
 * pulsingOrbs from the store triggers a bright scale+glow burst
 * when the Gemini chatbot mentions this memory.
 */
export default function MemoryOrb({ memory }) {
  const { id, color, glowColor, position, isFuture } = memory

  const groupRef  = useRef()   // handles position / float / scale
  const meshRef   = useRef()   // sphere mesh — material access for pulse
  const glowRef   = useRef()
  const outerRef  = useRef()

  const { hoveredOrb, setHoveredOrb, selectedOrb, setSelectedOrb, pulsingOrbs } =
    useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  // Rising-edge detection for pulse: record clock time when pulse starts
  const pulseStartRef  = useRef(null)
  const wasPulsingRef  = useRef(false)

  const seed      = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbColor  = useMemo(() => new THREE.Color(color),     [color])
  const glowTHREE = useMemo(() => new THREE.Color(glowColor), [glowColor])

  const PULSE_DURATION = 1.8  // seconds

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    // ── Rising-edge: capture clock time when pulse starts ──────
    if (isPulsing && !wasPulsingRef.current) {
      pulseStartRef.current = t
    }
    wasPulsingRef.current = isPulsing

    // ── Pulse factor: smooth bell curve 0 → 1 → 0 ─────────────
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const elapsed = t - pulseStartRef.current
      if (elapsed < PULSE_DURATION) {
        pulseFactor = Math.sin((elapsed / PULSE_DURATION) * Math.PI)
      } else if (!isPulsing) {
        pulseStartRef.current = null  // reset when store entry is gone
      }
    }

    // ── Float ──────────────────────────────────────────────────
    const floatAmp   = isFuture ? 0.20 : 0.12
    const floatSpeed = isFuture ? 0.40 : 0.60
    groupRef.current.position.y =
      position[1] + Math.sin(t * floatSpeed + seed) * floatAmp

    // ── Rotation drift ─────────────────────────────────────────
    groupRef.current.rotation.y = t * (isFuture ? 0.08 : 0.15)
    groupRef.current.rotation.z = Math.sin(t * 0.3 + seed) * (isFuture ? 0.08 : 0.05)

    // ── Scale — breathe + hover + pulse burst ─────────────────
    const breathe     = 1 + Math.sin(t * 1.2 + seed) * 0.018
    const hoverMult   = isActive ? 1.18 : 1.0
    const pulseMult   = 1 + pulseFactor * 0.40          // up to 1.40×
    const targetScale = breathe * hoverMult * pulseMult

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.07)
    )

    // ── Material emissive — boost on hover and on pulse ────────
    if (meshRef.current) {
      const baseEmissive    = isFuture ? 0.15 : 0.38
      const activeEmissive  = isActive ? 0.70 : baseEmissive
      const pulseEmissive   = activeEmissive + pulseFactor * 1.2  // flash!
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        pulseEmissive,
        0.10
      )
    }

    // ── Inner glow opacity ─────────────────────────────────────
    if (glowRef.current) {
      const base  = isActive ? 0.60 : isFuture ? 0.20 : 0.35
      const pulse = base + pulseFactor * 0.35
      glowRef.current.material.opacity =
        pulse * (0.85 + Math.sin(t * 1.8 + seed) * 0.15)
    }

    // ── Outer halo opacity ────────────────────────────────────
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

  const shellOpacity = isFuture ? 0.30 : 0.88
  const distort      = isFuture ? 0.55 : 0.38
  const distortSpeed = isFuture ? 1.40 : 2.20

  return (
    <group position={position} ref={groupRef}>
      {/* ── Outer distorted shell ─────────────────────────────── */}
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

      {/* ── Inner glow core ───────────────────────────────────── */}
      <Sphere ref={glowRef} args={[0.65, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isFuture ? 0.20 : 0.35}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* ── Outer soft halo ───────────────────────────────────── */}
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
