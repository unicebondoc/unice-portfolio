import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Particles — bioluminescent underwater spores / fireflies.
 *
 * Three separate point clouds:
 *   WARM    — amber/ember tones  (firefly, forest spore)
 *   COOL    — deep ocean blue/teal (no green galaxy)
 *   CAUSTIC — large, very slow, faint bright shimmer (light through water)
 *
 * All particles drift slowly with organic sine oscillation.
 * Global opacity pulses gently for a "breathing" feel.
 */

const WARM_COUNT    = 140
const COOL_COUNT    = 100
const CAUSTIC_COUNT = 28

// Deep ocean palette — blue/teal only, no bright green
const COOL_PALETTE = [
  new THREE.Color('#00AACC'),
  new THREE.Color('#0077AA'),
  new THREE.Color('#44CCCC'),
  new THREE.Color('#005577'),
  new THREE.Color('#22AABB'),
]

// Warm ember/firefly — amber & gold, no harsh yellow
const WARM_PALETTE = [
  new THREE.Color('#FFB800'),
  new THREE.Color('#FF8C00'),
  new THREE.Color('#FF6A00'),
  new THREE.Color('#FFD060'),
  new THREE.Color('#E87800'),
]

// Caustic: faint white-cyan suggests light filtering through water
const CAUSTIC_PALETTE = [
  new THREE.Color('#88EEFF'),
  new THREE.Color('#AAFFEE'),
  new THREE.Color('#CCFFFF'),
]

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
    c.multiplyScalar(0.35 + Math.random() * 0.55)
    colors[i * 3]     = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b

    // Very slow organic movement
    speeds[i] = 0.08 + Math.random() * 0.18
    phases[i] = Math.random() * Math.PI * 2
  }

  return { positions, colors, speeds, phases }
}

function ParticleCloud({ count, palette, spread, size, opacity, isCaustic = false }) {
  const ref    = useRef()
  const matRef = useRef()

  const { positions, colors, speeds, phases } = useMemo(
    () => makeCrowd(count, palette, spread),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const originX = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = positions[i * 3]
    return arr
  }, [count, positions])

  const originY = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = positions[i * 3 + 1]
    return arr
  }, [count, positions])

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return
    const t   = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position

    for (let i = 0; i < count; i++) {
      const s = speeds[i]
      const p = phases[i]

      if (isCaustic) {
        // Very slow Lissajous-like drift — caustic light shimmer
        pos.array[i * 3]     = originX[i] + Math.sin(t * s * 0.5 + p) * 1.8
        pos.array[i * 3 + 1] = originY[i] + Math.cos(t * s * 0.35 + p * 1.4) * 1.2
      } else {
        // Slow vertical oscillation + gentle lateral sway
        pos.array[i * 3 + 1] =
          originY[i] + Math.sin(t * s * 0.30 + p) * 0.28
        pos.array[i * 3] =
          originX[i] + Math.sin(t * s * 0.08 + p * 1.5) * 0.14
      }
    }
    pos.needsUpdate = true

    // Slow global breathing
    matRef.current.opacity = isCaustic
      ? opacity * (0.40 + Math.sin(t * 0.22 + 1.0) * 0.35)
      : opacity * (0.68 + Math.sin(t * 0.28) * 0.28)
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

export default function Particles() {
  return (
    <>
      {/* Warm embers — slow organic firefly spores */}
      <ParticleCloud
        count={WARM_COUNT}
        palette={WARM_PALETTE}
        spread={{ x: 26, y: 14, z: 14 }}
        size={0.082}
        opacity={0.60}
      />

      {/* Cool ocean bio-particles — deep teal/blue, no green */}
      <ParticleCloud
        count={COOL_COUNT}
        palette={COOL_PALETTE}
        spread={{ x: 22, y: 12, z: 16 }}
        size={0.068}
        opacity={0.45}
      />

      {/* Caustic shimmer — large, very slow, like light through water */}
      <ParticleCloud
        count={CAUSTIC_COUNT}
        palette={CAUSTIC_PALETTE}
        spread={{ x: 18, y: 10, z: 10 }}
        size={0.18}
        opacity={0.12}
        isCaustic
      />
    </>
  )
}
