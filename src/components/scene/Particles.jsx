import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 300

/**
 * Particles — floating dust motes that fill the memory vault.
 * Rendered as a single Points object for performance.
 */
export default function Particles() {
  const ref = useRef()

  // Generate random positions, colors, and per-particle speed factors
  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors    = new Float32Array(PARTICLE_COUNT * 3)
    const speeds    = new Float32Array(PARTICLE_COUNT)

    const palette = [
      new THREE.Color('#00d4ff'),
      new THREE.Color('#ffd700'),
      new THREE.Color('#ff6eb4'),
      new THREE.Color('#9b59b6'),
      new THREE.Color('#4a90d9'),
    ]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread across the scene
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12

      // Pick a random color from the palette and dim it
      const c = palette[Math.floor(Math.random() * palette.length)].clone()
      c.multiplyScalar(0.6)
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      speeds[i] = 0.3 + Math.random() * 0.7
    }

    return { positions, colors, speeds }
  }, [])

  // Store original Y values to oscillate around
  const originY = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = positions[i * 3 + 1]
    }
    return arr
  }, [positions])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Gentle sine drift upward and sideways
      pos.array[i * 3 + 1] =
        originY[i] + Math.sin(t * speeds[i] * 0.4 + i) * 0.25
      pos.array[i * 3] +=
        Math.sin(t * speeds[i] * 0.15 + i * 0.7) * 0.002
    }

    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
