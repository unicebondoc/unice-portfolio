import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

/**
 * MemoryOrb — a single glowing, pulsing memory sphere.
 *
 * Each orb:
 *  - Uses MeshDistortMaterial for the organic "swirling" look
 *  - Has a bloom-friendly inner emissive glow
 *  - Scales on hover
 *  - Triggers store actions on click / hover
 */
export default function MemoryOrb({ memory }) {
  const { id, color, glowColor, position, title } = memory

  const orbRef  = useRef()
  const glowRef = useRef()

  const { hoveredOrb, setHoveredOrb, selectedOrb, setSelectedOrb } = useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id

  // Unique random seed per orb so they don't pulse in sync
  const seed = useMemo(() => Math.random() * Math.PI * 2, [])

  // Convert hex color string to THREE.Color
  const orbColor  = useMemo(() => new THREE.Color(color),     [color])
  const glowTHREE = useMemo(() => new THREE.Color(glowColor), [glowColor])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (!orbRef.current) return

    // Gentle idle float
    orbRef.current.position.y =
      position[1] + Math.sin(t * 0.6 + seed) * 0.12

    // Subtle rotation drift
    orbRef.current.rotation.y = t * 0.15
    orbRef.current.rotation.z = Math.sin(t * 0.3 + seed) * 0.05

    // Breathe: scale pulsing
    const breathe = 1 + Math.sin(t * 1.2 + seed) * 0.015
    const hover   = isHovered || isSelected ? 1.12 : 1.0
    const target  = breathe * hover

    orbRef.current.scale.setScalar(
      THREE.MathUtils.lerp(orbRef.current.scale.x, target, 0.08)
    )

    // Inner glow pulse
    if (glowRef.current) {
      const glowPulse = 0.85 + Math.sin(t * 1.8 + seed) * 0.15
      glowRef.current.material.opacity = glowPulse * (isHovered ? 0.55 : 0.35)
    }
  })

  const handleClick = () => {
    setSelectedOrb(isSelected ? null : id)
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHoveredOrb(id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHoveredOrb(null)
    document.body.style.cursor = 'auto'
  }

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
          emissiveIntensity={isHovered ? 0.6 : 0.35}
          distort={0.38}
          speed={2.2}
          roughness={0}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </Sphere>

      {/* ── Inner glow core ───────────────────────────────────── */}
      <Sphere ref={glowRef} args={[0.65, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* ── Outer soft glow shell (additive) ─────────────────── */}
      <Sphere args={[1.35, 32, 32]}>
        <meshBasicMaterial
          color={glowTHREE}
          transparent
          opacity={isHovered ? 0.08 : 0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}
