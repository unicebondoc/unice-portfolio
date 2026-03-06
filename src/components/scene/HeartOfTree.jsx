/**
 * HeartOfTree — glowing nexus at the convergence of all tendrils.
 * Warm white/golden sphere + aura + point light; breathing animation; brightens on orb hover.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const HEART_POSITION = [0, 0.5, 0] // local; parent group at [0,0,-3.5] → world (0, 0.5, -3.5)
const CORE_RADIUS = 0.15
const AURA_RADIUS = 0.35
const CORE_COLOR = '#ffd700'
const OUTER_COLOR = '#fffbe6'
const LIGHT_COLOR = '#fff8e7'
const BREATHE_CYCLE = 2
const HOVER_PULSE_DUR = 0.3

export default function HeartOfTree() {
  const groupRef = useRef()
  const coreMatRef = useRef()
  const auraMatRef = useRef()
  const lightRef = useRef()
  const hoverPulseStartRef = useRef(null)
  const parallaxMouse = useStore((s) => s.parallaxMouse)
  const hoveredOrb = useStore((s) => s.hoveredOrb)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (!groupRef.current) return

    // Heart stays fixed on screen (no parallax) — counter-move vs camera
    const px = parallaxMouse.x * 0.04
    const py = parallaxMouse.y * 0.04
    groupRef.current.position.set(-px, 0.5 - py, 0)

    // Breathing: scale 0.95–1.05, light 0.4–0.8, aura opacity 0.1–0.2
    const breathe = Math.sin((t / BREATHE_CYCLE) * Math.PI * 2) * 0.5 + 0.5
    const scale = 0.95 + breathe * 0.1
    const lightIntensity = 0.4 + breathe * 0.4
    let auraOpacity = 0.1 + breathe * 0.1

    // Orb hover: heart pulses brighter for 0.3s
    if (hoveredOrb) {
      if (hoverPulseStartRef.current === null) hoverPulseStartRef.current = t
      const el = t - hoverPulseStartRef.current
      if (el < HOVER_PULSE_DUR) {
        const p = el / HOVER_PULSE_DUR
        const add = 0.2 * (1 - p)
        if (lightRef.current) lightRef.current.intensity = lightIntensity + add
        auraOpacity = Math.min(0.35, auraOpacity + add)
      } else if (lightRef.current) {
        lightRef.current.intensity = lightIntensity
      }
    } else {
      hoverPulseStartRef.current = null
      if (lightRef.current) lightRef.current.intensity = lightIntensity
    }

    groupRef.current.scale.setScalar(scale)
    if (auraMatRef.current) auraMatRef.current.opacity = auraOpacity
  })

  return (
    <group ref={groupRef} position={HEART_POSITION} raycast={() => null}>
      <pointLight
        ref={lightRef}
        color={LIGHT_COLOR}
        intensity={0.6}
        distance={4}
        decay={2}
      />
      <mesh>
        <sphereGeometry args={[AURA_RADIUS, 32, 32]} />
        <meshBasicMaterial
          ref={auraMatRef}
          color={OUTER_COLOR}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[CORE_RADIUS, 32, 32]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color={CORE_COLOR}
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
