/**
 * CanopyParticles — Zone C: glowing pollen falling from tree canopy.
 * 70 particles, y(2.5 to 5.5), cyan-teal, gentle fall + sway, reset when y < 2.5.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 70
const PALETTE = [
  new THREE.Color('#00ddff'),
  new THREE.Color('#40ffcc'),
  new THREE.Color('#20eedd'),
  new THREE.Color('#30ffdd'),
]

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

const FALL_SPEED = 0.004
const Y_TOP = 5.5
const Y_BOTTOM = 2.5

export default function CanopyParticles() {
  const ptsRef = useRef()
  const matRef = useRef()
  const { pos, col, seed, baseX } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)
    const baseX = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = -5 + Math.random() * 10
      pos[i * 3 + 1] = 2.5 + Math.random() * 3
      pos[i * 3 + 2] = -2 + Math.random() * 2
      baseX[i] = pos[i * 3]
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)].clone()
      c.multiplyScalar(0.7 + Math.random() * 0.3)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      seed[i] = Math.random() * Math.PI * 2
    }
    return { pos, col, seed, baseX }
  }, [])

  const currentY = useRef(new Float32Array(COUNT))
  useMemo(() => {
    for (let i = 0; i < COUNT; i++) currentY.current[i] = pos[i * 3 + 1]
  }, [pos])

  const uniforms = useMemo(() => ({
    uSize: { value: 0.375 },
    uOpacity: { value: 0.45 },
  }), [])

  useFrame((state) => {
    if (!ptsRef.current?.geometry?.attributes?.position) return
    const t = state.clock.elapsedTime
    const posA = ptsRef.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      let y = currentY.current[i]
      y -= FALL_SPEED
      if (y < Y_BOTTOM) y = Y_TOP
      currentY.current[i] = y
      const sway = Math.sin(t * 0.4 + seed[i]) * 0.15
      posA[i * 3] = baseX[i] + sway
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
        blending={THREE.NormalBlending}
      />
    </points>
  )
}
