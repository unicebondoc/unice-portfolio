/**
 * ProjectArtifact — mystical scroll/relic on the right side of the hero scene.
 * A project teaser (Tarot Gesture) that feels like a collectible in the Core Memories world.
 * Floating, soft glow, hover lift + brighten.
 */
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const BASE_POSITION = [4.2, 1.5, -1.2]
const MOBILE_POSITION = [2.8, 1.8, -1.5]
const WIDTH = 0.85
const HEIGHT = 1.0
const FLOAT_AMP = 0.04
const FLOAT_PERIOD = 4
const TILT_X = 0.12
const TILT_Y = -0.25
const HOVER_LIFT = 0.08
const HOVER_SCALE = 1.06

const COLORS = {
  violet: '#a78bfa',
  cyan: '#67e8f9',
  gold: '#f0b840',
  moonlit: '#c4b5fd',
  glow: '#a5f3fc',
}

function ShimmerRing() {
  const ringRef = useRef()
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })
  return (
    <mesh ref={ringRef} position={[0, 0, 0.015]}>
      <ringGeometry args={[WIDTH * 0.5, WIDTH * 0.52, 32]} />
      <meshBasicMaterial
        color={COLORS.cyan}
        transparent
        opacity={0.08}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function ShimmerDots() {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })
  const dots = 6
  const radius = WIDTH * 0.52
  return (
    <group ref={groupRef} position={[0, 0, 0.02]}>
      {Array.from({ length: dots }, (_, i) => {
        const angle = (i / dots) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          >
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial
              color={COLORS.cyan}
              transparent
              opacity={0.35}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function ProjectArtifact() {
  const groupRef = useRef()
  const planeMatRef = useRef()
  const glowMatRef = useRef()
  const [hovered, setHovered] = useState(false)
  const hoverRef = useRef(0)
  const isMobile = useStore((s) => s.isMobile)
  const parallaxMouse = useStore((s) => s.parallaxMouse)

  const position = isMobile ? MOBILE_POSITION : BASE_POSITION

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (!groupRef.current) return

    hoverRef.current += (hovered ? 1 : 0 - hoverRef.current) * Math.min(1, delta * 8)

    const floatY = Math.sin(t * (Math.PI * 2 / FLOAT_PERIOD)) * FLOAT_AMP
    const lift = hoverRef.current * HOVER_LIFT
    const scale = 1 + hoverRef.current * (HOVER_SCALE - 1)
    const parallaxX = parallaxMouse.x * 0.03
    const parallaxY = parallaxMouse.y * 0.02

    groupRef.current.position.x = position[0] + parallaxX
    groupRef.current.position.y = position[1] + floatY + lift + parallaxY
    groupRef.current.position.z = position[2]
    groupRef.current.scale.setScalar(scale)

    const emissiveIntensity = 0.35 + hoverRef.current * 0.4
    const glowOpacity = 0.12 + hoverRef.current * 0.18
    if (planeMatRef.current) {
      planeMatRef.current.emissiveIntensity = emissiveIntensity
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = glowOpacity
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Slight tilt toward viewer */}
      <group rotation={[TILT_X, TILT_Y, 0]}>
        {/* Outer glow aura */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[WIDTH * 1.35, HEIGHT * 1.35]} />
          <meshBasicMaterial
            ref={glowMatRef}
            color={COLORS.glow}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Main scroll / relic plane */}
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(false)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <planeGeometry args={[WIDTH, HEIGHT]} />
          <meshStandardMaterial
            ref={planeMatRef}
            color="#1a1625"
            emissive={COLORS.violet}
            emissiveIntensity={0.35}
            roughness={0.6}
            metalness={0.15}
            transparent
            opacity={0.92}
            depthWrite={true}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner highlight strip (top edge) */}
        <mesh position={[0, HEIGHT * 0.42, 0.01]}>
          <planeGeometry args={[WIDTH * 0.9, 0.04]} />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Subtle particle shimmer — small dots orbiting */}
        <ShimmerDots />

        <ShimmerRing />

        {/* Html label — crisp text */}
        <Html
          position={[0, 0.22, 0.06]}
          center
          distanceFactor={2.2}
          style={{
            pointerEvents: 'none',
            width: 280,
            textAlign: 'center',
            fontFamily: "'Cinzel', 'Raleway', serif",
          }}
        >
          <div
            style={{
              color: 'rgba(196, 181, 253, 0.9)',
              fontSize: 10,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Our Project
          </div>
          <div
            style={{
              color: '#e0e7ff',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(167, 139, 250, 0.4)',
            }}
          >
            Tarot Gesture
          </div>
          <div
            style={{
              color: 'rgba(165, 243, 252, 0.85)',
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            Building in Progress
          </div>
          <div
            style={{
              color: 'rgba(196, 181, 253, 0.6)',
              fontSize: 10,
              lineHeight: 1.4,
              maxWidth: 240,
              margin: '0 auto',
            }}
          >
            An interactive tarot experience shaped by motion, symbolism, and AI.
          </div>
        </Html>
      </group>
    </group>
  )
}
