/**
 * HeartOfTree — diamond (octahedron) nexus at the convergence of all tendrils.
 * Two layers: inner crystal (MeshPhysicalMaterial) + outer glow (MeshBasicMaterial).
 * Rotation, breathing pulse, reactive to orb hover/open and chatbot messages.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const HEART_POSITION = [0, 0.5, 0]
const INNER_SIZE = 0.18
const OUTER_SIZE = 0.28
const DIAMOND_SCALE = { x: 1, y: 1.4, z: 1 }
const LIGHT_COLOR = '#fff8e0'
const BREATHE_CYCLE = 2
const HOVER_PULSE_DUR = 0.3
const SPIN_DUR = 0.8
const CHAT_PULSE_DUR = 0.4

export default function HeartOfTree() {
  const groupRef = useRef()
  const innerRef = useRef()
  const outerRef = useRef()
  const coreMatRef = useRef()
  const auraMatRef = useRef()
  const lightRef = useRef()
  const hoverPulseStartRef = useRef(null)
  const spinStartRef = useRef(null)
  const spinStartYRef = useRef(0)
  const prevMemoryPanelRef = useRef(false)
  const chatPulseStartRef = useRef(null)
  const lastChatPulseAtRef = useRef(0)

  const parallaxMouse = useStore((s) => s.parallaxMouse)
  const hoveredOrb = useStore((s) => s.hoveredOrb)
  const activePanel = useStore((s) => s.activePanel)
  const lastChatPulseAt = useStore((s) => s.lastChatPulseAt)

  const isMemoryOpen = activePanel?.type === 'memory'

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (!groupRef.current) return

    const px = parallaxMouse.x * 0.018
    const py = parallaxMouse.y * 0.018
    groupRef.current.position.set(-px, 0.5 - py, 0)

    // Base breathing: scale 0.95–1.05, light 0.6–1.0
    const breathe = Math.sin((t / BREATHE_CYCLE) * Math.PI * 2) * 0.5 + 0.5
    let scale = 0.95 + breathe * 0.1
    let lightIntensity = 0.6 + breathe * 0.4
    let auraOpacity = 0.08
    let emissiveIntensity = 0.5

    // Orb hover: diamond pulses brighter (emissive 0.8 for 0.3s)
    if (hoveredOrb) {
      if (hoverPulseStartRef.current === null) hoverPulseStartRef.current = t
      const el = t - hoverPulseStartRef.current
      if (el < HOVER_PULSE_DUR) {
        const p = el / HOVER_PULSE_DUR
        const add = 0.3 * (1 - p)
        emissiveIntensity = 0.5 + add
        lightIntensity += add * 0.5
        auraOpacity = Math.min(0.2, auraOpacity + add * 0.3)
      } else if (lightRef.current) {
        lightRef.current.intensity = lightIntensity
      }
    } else {
      hoverPulseStartRef.current = null
    }

    // Orb opened: one full spin over 0.8s ease-out
    if (isMemoryOpen && !prevMemoryPanelRef.current) {
      spinStartRef.current = t
      spinStartYRef.current = innerRef.current ? innerRef.current.rotation.y : 0
    }
    prevMemoryPanelRef.current = isMemoryOpen

    let spinY = 0
    if (spinStartRef.current !== null) {
      const el = t - spinStartRef.current
      if (el < SPIN_DUR) {
        const p = el / SPIN_DUR
        const easeOut = 1 - (1 - p) * (1 - p)
        spinY = easeOut * Math.PI * 2
      } else {
        spinStartRef.current = null
      }
    }

    // Chat message: scale pulse 1.0 → 1.15 → 1.0 over 0.4s
    if (lastChatPulseAt !== lastChatPulseAtRef.current) {
      lastChatPulseAtRef.current = lastChatPulseAt
      if (lastChatPulseAt > 0) chatPulseStartRef.current = t
    }
    if (chatPulseStartRef.current !== null) {
      const el = t - chatPulseStartRef.current
      if (el < CHAT_PULSE_DUR) {
        const p = el / CHAT_PULSE_DUR
        const pulse = p < 0.5 ? 1 + 0.15 * (p * 2) : 1 + 0.15 * (1 - (p - 0.5) * 2)
        scale *= pulse
      } else {
        chatPulseStartRef.current = null
      }
    }

    groupRef.current.scale.set(DIAMOND_SCALE.x * scale, DIAMOND_SCALE.y * scale, DIAMOND_SCALE.z * scale)

    // Rotation: Y 0.3 rad/s, subtle X wobble
    const baseY = t * 0.3 + spinY
    const wobbleX = Math.sin(t * 0.5) * 0.05
    if (innerRef.current) {
      innerRef.current.rotation.y = baseY
      innerRef.current.rotation.x = wobbleX
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = baseY
      outerRef.current.rotation.x = wobbleX
    }

    if (lightRef.current) lightRef.current.intensity = lightIntensity
    if (coreMatRef.current) coreMatRef.current.emissiveIntensity = emissiveIntensity
    if (auraMatRef.current) auraMatRef.current.opacity = auraOpacity
  })

  return (
    <group ref={groupRef} position={HEART_POSITION} raycast={() => null}>
      <pointLight
        ref={lightRef}
        color={LIGHT_COLOR}
        intensity={0.8}
        distance={4}
        decay={2}
      />
      {/* Layer 2: outer glow shell */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[OUTER_SIZE, 0]} />
        <meshBasicMaterial
          ref={auraMatRef}
          color={LIGHT_COLOR}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Layer 1: inner crystal */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[INNER_SIZE, 0]} />
        <meshPhysicalMaterial
          ref={coreMatRef}
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.5}
          transmission={0.4}
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
