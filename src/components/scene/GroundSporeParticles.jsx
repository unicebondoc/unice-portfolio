/**
 * GroundSporeParticles — Zone B: spores rising from forest floor.
 * Mostly purple (70%) with some amber (30%). AdditiveBlending for glow.
 */
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const COUNT = 60
const PURPLE = new THREE.Color('#c084fc')
const AMBER = new THREE.Color('#f0b840')
const PALETTE = [PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, AMBER, AMBER, AMBER]

const VERT = /* glsl */`
attribute vec3 aColor;
varying   vec3 vColor;
uniform   float uSize;

void main() {
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (80.0 / max(-mvPos.z, 1.0));
  gl_Position  = projectionMatrix * mvPos;
}
`

const FRAG = /* glsl */`
varying vec3  vColor;
uniform float uOpacity;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * uOpacity;
  gl_FragColor = vec4(vColor, alpha);
}
`

export default function GroundSporeParticles() {
  const isMobile = useStore((s) => s.isMobile)
  const count = isMobile ? Math.max(15, Math.floor(COUNT * 0.5)) : COUNT
  const ptsRef = useRef()
  const matRef = useRef()
  const { pos, col, seed, baseY } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const baseY = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -7 + Math.random() * 14
      pos[i * 3 + 1] = -2.5 + Math.random() * 1
      pos[i * 3 + 2] = -1 + Math.random() * 2
      baseY[i] = pos[i * 3 + 1]
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)].clone()
      c.multiplyScalar(0.7 + Math.random() * 0.3)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      seed[i] = Math.random() * Math.PI * 2
    }
    return { pos, col, seed, baseY }
  }, [count])

  const currentY = useRef(new Float32Array(count))
  useEffect(() => {
    if (baseY.length !== currentY.current.length) {
      currentY.current = new Float32Array(baseY.length)
    }
    for (let i = 0; i < baseY.length; i++) currentY.current[i] = baseY[i]
  }, [baseY])

  const uniforms = useMemo(() => ({
    uSize: { value: 0.4 },
    uOpacity: { value: 0.5 },
  }), [])

  useFrame((state) => {
    if (!ptsRef.current?.geometry?.attributes?.position) return
    const t = state.clock.elapsedTime
    const delta = state.clock.getDelta()
    const posA = ptsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      let y = currentY.current[i]
      y += Math.sin(t * 0.3 + seed[i]) * 0.008 * (delta * 60)
      if (y > -1.5) y = -2.5 + Math.random() * 0.5
      currentY.current[i] = y
      posA[i * 3] = pos[i * 3]
      posA[i * 3 + 1] = y
      posA[i * 3 + 2] = pos[i * 3 + 2]
    }
    ptsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[col, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
