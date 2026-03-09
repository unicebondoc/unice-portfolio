/**
 * ProjectScrollArtifact — mystical 3D floating scroll relic.
 * Compact when idle; unfurls on hover. Feels like an enchanted object in the Core Memories world.
 */
import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const BASE_POSITION = [5.2, 0.7, -1.1]
const MOBILE_POSITION = [3.4, 1.0, -1.4]
const PARCHMENT_WIDTH = 0.72
const PARCHMENT_HEIGHT = 0.58
const ROLL_RADIUS = 0.055
const ROLL_HEIGHT = PARCHMENT_HEIGHT
const FLOAT_AMP = 0.028
const FLOAT_PERIOD = 5
const SWAY_AMP = 0.028
const SWAY_PERIOD = 7
const BREATHE_GLOW_PERIOD = 3.5
const HOVER_DURATION = 0.42
const WIDTH_SCALE_HOVER = 1.22
const OVERALL_SCALE_HOVER = 1.06
const LIFT_HOVER = 0.06

const COLORS = {
  violet: '#a78bfa',
  cyan: '#67e8f9',
  gold: '#f0b840',
  moonlit: '#c4b5fd',
  glow: '#a5f3fc',
  parchment: '#1e1a28',
  parchmentEmissive: '#2a2540',
}

function MagicalDust({ count = 10 }) {
  const groupRef = useRef()
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        offset: Math.random() * Math.PI * 2,
        radius: 0.38 + Math.random() * 0.2,
        speed: 0.15 + Math.random() * 0.2,
        y: (Math.random() - 0.5) * 0.5,
      })),
    [count]
  )
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((mesh, i) => {
      const s = seeds[i]
      const angle = s.offset + t * s.speed
      mesh.position.x = Math.cos(angle) * s.radius
      mesh.position.z = Math.sin(angle) * s.radius
      mesh.position.y = s.y + Math.sin(t * 0.8 + i) * 0.02
      mesh.material.opacity = 0.15 + Math.sin(t * 2 + i) * 0.08
    })
  })
  return (
    <group ref={groupRef} position={[0, 0, 0.04]}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial
            color={COLORS.cyan}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ProjectScrollArtifact() {
  const groupRef = useRef()
  const scrollGroupRef = useRef()
  const parchmentMatRef = useRef()
  const leftRollMatRef = useRef()
  const rightRollMatRef = useRef()
  const haloMatRef = useRef()
  const trimMatRef = useRef()
  const trimBottomMatRef = useRef()
  const [hovered, setHovered] = useState(false)
  const hoverTRef = useRef(0)
  const isMobile = useStore((s) => s.isMobile)
  const parallaxMouse = useStore((s) => s.parallaxMouse)

  const position = isMobile ? MOBILE_POSITION : BASE_POSITION

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (!groupRef.current || !scrollGroupRef.current) return

    const targetHover = hovered ? 1 : 0
    const hoverSpeed = 1 / HOVER_DURATION
    hoverTRef.current += (targetHover - hoverTRef.current) * Math.min(1, delta * hoverSpeed * 2.5)

    const h = hoverTRef.current
    const widthScale = 1 + h * (WIDTH_SCALE_HOVER - 1)
    const overallScale = 1 + h * (OVERALL_SCALE_HOVER - 1)
    const lift = h * LIFT_HOVER
    const floatY = Math.sin(t * (Math.PI * 2 / FLOAT_PERIOD)) * FLOAT_AMP
    const swayY = Math.sin(t * (Math.PI * 2 / SWAY_PERIOD)) * SWAY_AMP
    const swayZ = Math.cos(t * (Math.PI * 2 / (SWAY_PERIOD * 1.1))) * SWAY_AMP * 0.7
    const breatheGlow = 0.5 + 0.5 * Math.sin(t * (Math.PI * 2 / BREATHE_GLOW_PERIOD))
    const parallaxX = parallaxMouse.x * 0.02
    const parallaxY = parallaxMouse.y * 0.015

    groupRef.current.position.set(
      position[0] + parallaxX,
      position[1] + floatY + lift + parallaxY,
      position[2]
    )
    groupRef.current.scale.setScalar(overallScale)
    groupRef.current.rotation.y = swayY
    groupRef.current.rotation.z = swayZ

    scrollGroupRef.current.scale.x = widthScale

    const emissiveIntensity = 0.25 + breatheGlow * 0.12 + h * 0.45
    const haloOpacity = 0.08 + breatheGlow * 0.04 + h * 0.2
    const trimOpacity = 0.2 + h * 0.35
    if (parchmentMatRef.current) {
      parchmentMatRef.current.emissiveIntensity = emissiveIntensity
    }
    if (leftRollMatRef.current) {
      leftRollMatRef.current.emissiveIntensity = emissiveIntensity * 0.9
    }
    if (rightRollMatRef.current) {
      rightRollMatRef.current.emissiveIntensity = emissiveIntensity * 0.9
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = haloOpacity
    }
    if (trimMatRef.current) {
      trimMatRef.current.opacity = trimOpacity
    }
    if (trimBottomMatRef.current) {
      trimBottomMatRef.current.opacity = 0.18 + 0.22 * h
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <group rotation={[0.08, -0.2, 0]}>
        {/* Back glow halo */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[PARCHMENT_WIDTH * 2.2, PARCHMENT_HEIGHT * 2]} />
          <meshBasicMaterial
            ref={haloMatRef}
            color={COLORS.glow}
            transparent
            opacity={0.08}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group ref={scrollGroupRef}>
          {/* Left rolled end — half cylinder, flat face toward center (+X) */}
          <mesh
            position={[-PARCHMENT_WIDTH / 2 - ROLL_RADIUS * 0.5, 0, 0.01]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[ROLL_RADIUS, ROLL_RADIUS, ROLL_HEIGHT, 20, 1, false, Math.PI, Math.PI]} />
            <meshStandardMaterial
              ref={leftRollMatRef}
              color={COLORS.parchment}
              emissive={COLORS.moonlit}
              emissiveIntensity={0.28}
              roughness={0.65}
              metalness={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Right rolled end — half cylinder, flat face toward center (-X) */}
          <mesh
            position={[PARCHMENT_WIDTH / 2 + ROLL_RADIUS * 0.5, 0, 0.01]}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <cylinderGeometry args={[ROLL_RADIUS, ROLL_RADIUS, ROLL_HEIGHT, 20, 1, false, 0, Math.PI]} />
            <meshStandardMaterial
              ref={rightRollMatRef}
              color={COLORS.parchment}
              emissive={COLORS.moonlit}
              emissiveIntensity={0.28}
              roughness={0.65}
              metalness={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Center parchment */}
          <mesh
            position={[0, 0, 0]}
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
            <planeGeometry args={[PARCHMENT_WIDTH, PARCHMENT_HEIGHT]} />
            <meshStandardMaterial
              ref={parchmentMatRef}
              color={COLORS.parchment}
              emissive={COLORS.parchmentEmissive}
              emissiveIntensity={0.25}
              roughness={0.7}
              metalness={0.05}
              transparent
              opacity={0.94}
              side={THREE.DoubleSide}
              depthWrite={true}
            />
          </mesh>

          {/* Glowing trim — top and bottom edges */}
          <mesh position={[0, PARCHMENT_HEIGHT / 2 + 0.008, 0.015]}>
            <planeGeometry args={[PARCHMENT_WIDTH * 1.02, 0.022]} />
            <meshBasicMaterial
              ref={trimMatRef}
              color={COLORS.gold}
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -PARCHMENT_HEIGHT / 2 - 0.008, 0.015]}>
            <planeGeometry args={[PARCHMENT_WIDTH * 1.02, 0.022]} />
            <meshBasicMaterial
              ref={trimBottomMatRef}
              color={COLORS.cyan}
              transparent
              opacity={0.18}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <MagicalDust count={10} />

        {/* Text — embedded in scroll */}
        <Html
          position={[0, 0.02, 0.04]}
          center
          distanceFactor={2}
          style={{
            pointerEvents: 'none',
            width: 220,
            textAlign: 'center',
            fontFamily: "'Cinzel', Georgia, serif",
          }}
        >
          <div
            style={{
              color: 'rgba(224, 231, 255, 0.98)',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 2,
              marginBottom: 2,
              textShadow: '0 0 24px rgba(167, 139, 250, 0.35)',
            }}
          >
            Tarot Gesture
          </div>
          <div
            style={{
              color: 'rgba(165, 243, 252, 0.88)',
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Building in Progress
          </div>
          <div
            style={{
              color: 'rgba(196, 181, 253, 0.55)',
              fontSize: 9,
              lineHeight: 1.35,
              maxWidth: 200,
              margin: '0 auto',
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            An interactive tarot experience shaped by gesture, symbolism, and AI.
          </div>
        </Html>
      </group>
    </group>
  )
}
