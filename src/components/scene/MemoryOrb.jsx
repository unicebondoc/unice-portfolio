import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

/**
 * MemoryOrb — a single glowing, pulsing memory sphere.
 *
 * isFuture orbs (the AI Engineer Goal) render as a ghostly white
 * shell — semi-transparent, more distorted, softer glow.
 */
export default function MemoryOrb({ memory }) {
  const { id, color, glowColor, position, isFuture } = memory

  const orbRef  = useRef()
  const glowRef = useRef()
  const outerRef = useRef()

  const { hoveredOrb, setHoveredOrb, selectedOrb, setSelectedOrb } = useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected

  // Unique per-orb phase so they all float out of sync
  const seed = useMemo(() => Math.random() * Math.PI * 2, [])

  const orbColor  = useMemo(() => new THREE.Color(color),     [color])
  const glowTHREE = useMemo(() => new THREE.Color(glowColor), [glowColor])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!orbRef.current) return

    // Idle float (future orbs drift more slowly and further)
    const floatAmp   = isFuture ? 0.20 : 0.12
    const floatSpeed = isFuture ? 0.4  : 0.6
    orbRef.current.position.y =
      position[1] + Math.sin(t * floatSpeed + seed) * floatAmp

    // Subtle rotation drift
    orbRef.current.rotation.y = t * (isFuture ? 0.08 : 0.15)
    orbRef.current.rotation.z = Math.sin(t * 0.3 + seed) * (isFuture ? 0.08 : 0.05)

    // Breathe scale — more pronounced on hover/select
    const breathe     = 1 + Math.sin(t * 1.2 + seed) * 0.018
    const hoverScale  = isActive ? 1.18 : 1.0
    const targetScale = breathe * hoverScale

    orbRef.current.scale.setScalar(
      THREE.MathUtils.lerp(orbRef.current.scale.x, targetScale, 0.07)
    )

    // Inner glow pulse
    if (glowRef.current) {
      const glowPulse = 0.85 + Math.sin(t * 1.8 + seed) * 0.15
      glowRef.current.material.opacity =
        glowPulse * (isActive ? 0.60 : isFuture ? 0.20 : 0.35)
    }

    // Outer halo brightens on hover
    if (outerRef.current) {
      const targetOpacity = isActive ? 0.12 : isFuture ? 0.03 : 0.04
      outerRef.current.material.opacity = THREE.MathUtils.lerp(
        outerRef.current.material.opacity,
        targetOpacity,
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

  // Future orb is a ghostly, semi-transparent shell
  const shellOpacity = isFuture ? 0.30 : 0.88
  const emissiveInt  = isActive ? 0.7 : isFuture ? 0.15 : 0.38
  const distort      = isFuture ? 0.55 : 0.38
  const distortSpeed = isFuture ? 1.4  : 2.2

  return (
    <group position={position} ref={orbRef}>
      {/* ── Outer distorted shell ─────────────────────────────── */}
      <Sphere
        args={[1, 64, 64]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <MeshDistortMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={emissiveInt}
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
