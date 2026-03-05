/**
 * DustMotes — tiny scattered floating particles across the scene.
 * Barely visible pinpoints (1–2 px), slow drift, gentle opacity oscillation.
 * No glow, no bloom, no sprites.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 50
const BOX = { xMin: -6, xMax: 6, yMin: -2, yMax: 4, zMin: -2, zMax: 2 }

const VERT = /* glsl */`
attribute float aPhase;
varying float vPhase;
uniform float uSize;

void main() {
  vPhase = aPhase;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (4.0 / max(-mvPos.z, 1.0));
  gl_Position = projectionMatrix * mvPos;
}
`

const FRAG = /* glsl */`
uniform float uTime;
varying float vPhase;

void main() {
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float alpha = 0.15 + 0.25 * sin(uTime * 0.5 + vPhase);
  alpha = clamp(alpha, 0.0, 1.0);
  float soft = 1.0 - smoothstep(0.4, 0.5, r);
  vec3 purple = vec3(0.565, 0.376, 1.0);
  gl_FragColor = vec4(purple, alpha * soft);
}
`

export default function DustMotes() {
  const pointsRef = useRef()
  const velocities = useRef(
    Array.from({ length: COUNT }, () => [
      -0.001 + Math.random() * 0.002,
      -0.0005 + Math.random() * 0.0015,
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
      phases[i] = i * 2.0
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSize: { value: 1.5 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      opacity: 0.4,
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
      const [vx, vy] = velocities[i]
      pos[i * 3] += vx
      pos[i * 3 + 1] += vy
      if (pos[i * 3] < BOX.xMin) pos[i * 3] += BOX.xMax - BOX.xMin
      if (pos[i * 3] > BOX.xMax) pos[i * 3] -= BOX.xMax - BOX.xMin
      if (pos[i * 3 + 1] < BOX.yMin) pos[i * 3 + 1] += BOX.yMax - BOX.yMin
      if (pos[i * 3 + 1] > BOX.yMax) pos[i * 3 + 1] -= BOX.yMax - BOX.yMin
    }
    geo.attributes.position.needsUpdate = true
    const mat = pointsRef.current.material
    if (mat?.uniforms?.uTime) mat.uniforms.uTime.value = t
  })

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
}
