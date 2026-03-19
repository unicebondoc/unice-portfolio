/**
 * ProjectsScroll3D — 3D scroll artifact in the scene (game-like).
 * Click to open the Projects panel. Floats and glows on hover.
 */
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const SCROLL_RADIUS = 0.1
const SCROLL_HEIGHT = 0.52
const CAP_RADIUS = 0.065
const CAP_HEIGHT = 0.028
const PARCHMENT = '#c9a86c'
const PARCHMENT_DARK = '#8b7355'
const GLOW_COLOR = '#a0d8e8'

export default function ProjectsScroll3D() {
  const groupRef = useRef()
  const bodyMatRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)
  const hoverRef = useRef(0)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const activePanel = useStore((s) => s.activePanel)
  const isMobile = useStore((s) => s.isMobile)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.04
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.06
    hoverRef.current += (hovered ? 1 : -1) * delta * 4
    hoverRef.current = Math.max(0, Math.min(1, hoverRef.current))
    const h = hoverRef.current
    groupRef.current.scale.setScalar(1 + h * 0.12)
    if (bodyMatRef.current) {
      bodyMatRef.current.emissiveIntensity = 0.02 + h * 0.08
      bodyMatRef.current.emissive.setStyle(h > 0 ? GLOW_COLOR : PARCHMENT_DARK)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.08 + h * 0.12
    }
  })

  const openProjects = () => {
    if (activePanel?.type === 'projects') return
    setActivePanel({ type: 'projects' })
  }

  if (isMobile) return null

  return (
    <group
      ref={groupRef}
      position={[3.85, 0, 0]}
      rotation={[0, 0, Math.PI * 0.02]}
      onClick={(e) => {
        e.stopPropagation()
        openProjects()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Glow aura */}
      <mesh ref={glowRef} renderOrder={0}>
        <cylinderGeometry args={[SCROLL_RADIUS * 1.8, SCROLL_RADIUS * 1.8, SCROLL_HEIGHT * 1.2, 16]} />
        <meshBasicMaterial
          color={GLOW_COLOR}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Main scroll body */}
      <mesh renderOrder={1}>
        <cylinderGeometry args={[SCROLL_RADIUS, SCROLL_RADIUS, SCROLL_HEIGHT, 20]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color={PARCHMENT}
          emissive={PARCHMENT_DARK}
          emissiveIntensity={0.02}
          roughness={0.75}
          metalness={0.05}
          envMapIntensity={0.4}
        />
      </mesh>
      {/* Top cap (roll) */}
      <mesh position={[0, SCROLL_HEIGHT / 2 + CAP_HEIGHT / 2, 0]} renderOrder={2}>
        <cylinderGeometry args={[CAP_RADIUS, CAP_RADIUS, CAP_HEIGHT, 20]} />
        <meshStandardMaterial
          color={PARCHMENT_DARK}
          emissive={PARCHMENT_DARK}
          emissiveIntensity={0.03}
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>
      {/* Bottom cap (roll) */}
      <mesh position={[0, -SCROLL_HEIGHT / 2 - CAP_HEIGHT / 2, 0]} renderOrder={2}>
        <cylinderGeometry args={[CAP_RADIUS, CAP_RADIUS, CAP_HEIGHT, 20]} />
        <meshStandardMaterial
          color={PARCHMENT_DARK}
          emissive={PARCHMENT_DARK}
          emissiveIntensity={0.03}
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>
      {/* Decorative band */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, SCROLL_RADIUS + 0.002]} renderOrder={2.1}>
        <ringGeometry args={[SCROLL_RADIUS * 0.7, SCROLL_RADIUS + 0.01, 32]} />
        <meshBasicMaterial
          color={PARCHMENT_DARK}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
