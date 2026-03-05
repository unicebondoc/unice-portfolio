/**
 * AwakeningBurst — core memory "treasure opening" particle eruption.
 * When an orb is clicked, 30–80 particles burst outward in a sphere from orb position,
 * fade over 400–700ms, additive blending, orb color + cyan accent.
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES } from '../../data/memories'

const PARTICLE_COUNT = 55
const BURST_SPEED_MIN = 0.8
const BURST_SPEED_MAX = 2.2
const FADE_DURATION = 0.55

function AwakeningBurst() {
  const selectedOrbWorldPos = useStore((s) => s.selectedOrbWorldPos)
  const selectedOrb = useStore((s) => s.selectedOrb)
  const pointsRef = useRef()
  const matRef = useRef()
  const startTimeRef = useRef(null)
  const velocitiesRef = useRef(new Float32Array(PARTICLE_COUNT * 3))
  const timerRef = useRef(new THREE.Timer())

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
  const colors = useMemo(() => {
    const col = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mix = Math.random()
      const r = mix < 0.5 ? 0 : 0.3 + Math.random() * 0.5
      const g = 0.75 + Math.random() * 0.25
      const b = 0.9 + Math.random() * 0.1
      col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b
    }
    return col
  }, [])

  useEffect(() => {
    if (selectedOrbWorldPos && selectedOrb) {
      startTimeRef.current = null
      const vel = velocitiesRef.current
      const mem = MEMORIES.find((m) => m.id === selectedOrb)
      const orbColor = mem ? new THREE.Color(mem.color) : new THREE.Color(0, 1, 1)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const s = BURST_SPEED_MIN + Math.random() * (BURST_SPEED_MAX - BURST_SPEED_MIN)
        vel[i * 3]     = s * Math.sin(phi) * Math.cos(theta)
        vel[i * 3 + 1] = s * Math.cos(phi)
        vel[i * 3 + 2] = s * Math.sin(phi) * Math.sin(theta)
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0
        const t = Math.random()
        const c = orbColor.clone().lerp(new THREE.Color(0, 1, 1), t * 0.5)
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
      if (pointsRef.current?.geometry?.attributes?.position) {
        pointsRef.current.geometry.attributes.position.needsUpdate = true
        pointsRef.current.geometry.attributes.color.needsUpdate = true
      }
    }
  }, [selectedOrbWorldPos, selectedOrb, positions, colors])

  useFrame((_, delta) => {
    if (!pointsRef.current || !matRef.current || !selectedOrbWorldPos) return
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    if (startTimeRef.current === null) startTimeRef.current = t
    const elapsed = t - startTimeRef.current
    if (elapsed > FADE_DURATION + 0.2) return

    const posAttr = pointsRef.current.geometry.attributes.position
    const vel = velocitiesRef.current
    if (!vel) return

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posAttr.array[i * 3]     += vel[i * 3]     * delta
      posAttr.array[i * 3 + 1] += vel[i * 3 + 1] * delta
      posAttr.array[i * 3 + 2] += vel[i * 3 + 2] * delta
    }
    posAttr.needsUpdate = true

    const fade = Math.max(0, 1 - elapsed / FADE_DURATION)
    matRef.current.opacity = fade * 0.9
  })

  if (!selectedOrbWorldPos || !selectedOrb) return null

  const [wx, wy, wz] = selectedOrbWorldPos

  return (
    <group position={[wx, wy, wz]}>
      <points ref={pointsRef} renderOrder={10}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          size={0.12}
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.NormalBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default AwakeningBurst
