/**
 * WaterParticles — Zone A: mist on water below y -2.5.
 * Bioluminescent palette (purple/cyan/amber) for consistent forest atmosphere.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 80
const PURPLE = new THREE.Color('#c084fc')
const CYAN = new THREE.Color('#22d3ee')
const AMBER = new THREE.Color('#f0b840')
const PALETTE = [PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, PURPLE, CYAN, CYAN, CYAN, AMBER]

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

export default function WaterParticles() {
  const ptsRef = useRef()
  const matRef = useRef()
  const { pos, col, seed } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = -6 + Math.random() * 12
      pos[i * 3 + 1] = -4 + Math.random() * 2
      pos[i * 3 + 2] = -1 + Math.random() * 3
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)].clone()
      c.multiplyScalar(0.6 + Math.random() * 0.4)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      seed[i] = Math.random() * Math.PI * 2
    }
    return { pos, col, seed }
  }, [])

  const originX = useMemo(() => {
    const a = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) a[i] = pos[i * 3]
    return a
  }, [pos])

  const uniforms = useMemo(() => ({
    uSize: { value: 0.9 },
    uOpacity: { value: 0.4 },
  }), [])

  useFrame((state) => {
    if (!ptsRef.current?.geometry?.attributes?.position) return
    const t = state.clock.elapsedTime
    const posA = ptsRef.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      const s = seed[i]
      posA[i * 3] = originX[i] + Math.sin(t * 0.2 + s) * 0.3
      posA[i * 3 + 1] = pos[i * 3 + 1] + Math.sin(t * 0.1) * 0.1
      posA[i * 3 + 2] = pos[i * 3 + 2]
    }
    ptsRef.current.geometry.attributes.position.needsUpdate = true
    if (matRef.current?.uniforms?.uOpacity)
      matRef.current.uniforms.uOpacity.value = 0.3 + Math.sin(t * 0.2) * 0.1
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
