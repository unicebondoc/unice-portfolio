/**
 * Fireflies — 150 soft purple/pink light particles across the full scene.
 * Additive blending, per-particle opacity cycle, wrap when off-screen.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 150
const BOX = { xMin: -7, xMax: 7, yMin: -2, yMax: 4, zMin: -3, zMax: 3 }

const FIREFLY_VERT = /* glsl */`
attribute float aPhase;
varying float vPhase;
uniform float uSize;
void main() {
  vPhase = aPhase;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (80.0 / max(-mvPos.z, 1.0));
  gl_Position = projectionMatrix * mvPos;
}
`

const FIREFLY_FRAG = /* glsl */`
uniform float uTime;
varying float vPhase;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
  float t = uTime + vPhase;
  float pulse = 0.15 + 0.15 * (0.5 + 0.5 * sin(t));
  float random = fract(sin(vPhase) * 43758.5453);
  vec3 color = mix(vec3(0.565, 0.376, 1.0), vec3(0.9, 0.5, 1.0), random);
  gl_FragColor = vec4(color, pulse * alpha);
}
`

export default function Fireflies() {
  const pointsRef = useRef()
  const velocities = useRef(
    Array.from({ length: COUNT }, () => [
      -0.002 + Math.random() * 0.004,
      -0.002 + Math.random() * 0.004,
    ])
  ).current

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const phases = new Float32Array(COUNT)
    const w = BOX.xMax - BOX.xMin
    const h = BOX.yMax - BOX.yMin
    const d = BOX.zMax - BOX.zMin
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = BOX.xMin + Math.random() * w
      positions[i * 3 + 1] = BOX.yMin + Math.random() * h
      positions[i * 3 + 2] = BOX.zMin + Math.random() * d
      phases[i] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSize: { value: 0.5 } },
      vertexShader: FIREFLY_VERT,
      fragmentShader: FIREFLY_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const vx = velocities[i][0]
      const vy = velocities[i][1]
      pos[i * 3] += vx
      pos[i * 3 + 1] += vy
      if (pos[i * 3] < BOX.xMin) pos[i * 3] += BOX.xMax - BOX.xMin
      if (pos[i * 3] > BOX.xMax) pos[i * 3] -= BOX.xMax - BOX.xMin
      if (pos[i * 3 + 1] < BOX.yMin) pos[i * 3 + 1] += BOX.yMax - BOX.yMin
      if (pos[i * 3 + 1] > BOX.yMax) pos[i * 3 + 1] -= BOX.yMax - BOX.yMin
    }
    geo.attributes.position.needsUpdate = true
    const mat = pointsRef.current.material
    if (mat && mat.uniforms && mat.uniforms.uTime) mat.uniforms.uTime.value = t
  })

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
}
