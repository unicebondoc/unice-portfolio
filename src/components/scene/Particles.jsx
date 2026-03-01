import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Particles — bioluminescent spores / fireflies.
 *
 * Two separate point clouds:
 *   WARM — amber/gold tones  (firefly, spore)
 *   COOL — cyan/teal tones   (underwater bio)
 *
 * Both drift slowly with per-particle sine oscillation.
 * Material opacity pulses globally to give the scene a "breathing" feel.
 */

const WARM_COUNT = 220
const COOL_COUNT = 180

function makeCrowd(count, palette, spread) {
  const positions = new Float32Array(count * 3)
  const colors    = new Float32Array(count * 3)
  const speeds    = new Float32Array(count)
  const phases    = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * spread.x
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z

    const c = palette[Math.floor(Math.random() * palette.length)].clone()
    // Vary brightness per particle
    c.multiplyScalar(0.4 + Math.random() * 0.6)
    colors[i * 3]     = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b

    speeds[i] = 0.2 + Math.random() * 0.5
    phases[i] = Math.random() * Math.PI * 2
  }

  return { positions, colors, speeds, phases }
}

function ParticleCloud({ count, palette, spread, size, opacity }) {
  const ref = useRef()

  const { positions, colors, speeds, phases } = useMemo(
    () => makeCrowd(count, palette, spread),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Capture original Y per particle
  const originY = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = positions[i * 3 + 1]
    return arr
  }, [count, positions])

  const matRef = useRef()

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position

    for (let i = 0; i < count; i++) {
      // Slow upward drift + lateral sway
      pos.array[i * 3 + 1] =
        originY[i] + Math.sin(t * speeds[i] * 0.35 + phases[i]) * 0.30
      pos.array[i * 3] +=
        Math.sin(t * speeds[i] * 0.12 + phases[i] * 1.3) * 0.0015
    }
    pos.needsUpdate = true

    // Global breathing: opacity pulses gently
    matRef.current.opacity = opacity * (0.7 + Math.sin(t * 0.4) * 0.3)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

const WARM_PALETTE = [
  new THREE.Color('#FFD700'),  // gold
  new THREE.Color('#FFB347'),  // amber
  new THREE.Color('#FF8C42'),  // orange
  new THREE.Color('#FFEB8A'),  // warm yellow
  new THREE.Color('#FFC86B'),  // soft amber
]

const COOL_PALETTE = [
  new THREE.Color('#00D9FF'),  // cyan
  new THREE.Color('#00FF88'),  // bio-green
  new THREE.Color('#7FFFEA'),  // seafoam
  new THREE.Color('#00B4D8'),  // deep cyan
  new THREE.Color('#48CAE4'),  // teal
]

export default function Particles() {
  return (
    <>
      {/* Warm spores — like fireflies or forest spores */}
      <ParticleCloud
        count={WARM_COUNT}
        palette={WARM_PALETTE}
        spread={{ x: 24, y: 14, z: 14 }}
        size={0.055}
        opacity={0.75}
      />
      {/* Cool bio particles — like deep ocean bioluminescence */}
      <ParticleCloud
        count={COOL_COUNT}
        palette={COOL_PALETTE}
        spread={{ x: 20, y: 12, z: 16 }}
        size={0.042}
        opacity={0.55}
      />
    </>
  )
}
