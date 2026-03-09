/**
 * Fireflies — bioluminescent particles (60% purple, 30% cyan, 10% amber) across the full scene.
 * Additive blending, per-particle color, slightly brighter opacity.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'

const COUNT = 150
const BOX = { xMin: -7, xMax: 7, yMin: -2, yMax: 4, zMin: -3, zMax: 3 }

// 60% purple #c084fc, 30% cyan #22d3ee, 10% amber #f0b840
const PURPLE = new THREE.Color(0.753, 0.518, 0.988)
const CYAN = new THREE.Color(0.133, 0.827, 0.933)
const AMBER = new THREE.Color(0.941, 0.722, 0.251)
function pickColor() {
  const r = Math.random()
  if (r < 0.6) return PURPLE.clone()
  if (r < 0.9) return CYAN.clone()
  return AMBER.clone()
}

const FIREFLY_VERT = /* glsl */`
attribute float aPhase;
attribute vec3 aColor;
varying float vPhase;
varying vec3 vColor;
uniform float uSize;
void main() {
  vPhase = aPhase;
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (80.0 / max(-mvPos.z, 1.0));
  gl_Position = projectionMatrix * mvPos;
}
`

const FIREFLY_FRAG = /* glsl */`
uniform float uTime;
varying float vPhase;
varying vec3 vColor;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
  float t = uTime + vPhase;
  float pulse = 0.25 + 0.3 * (0.5 + 0.5 * sin(t));
  gl_FragColor = vec4(vColor, pulse * alpha);
}
`

export default function Fireflies() {
  const isMobile = useStore((s) => s.isMobile)
  const count = isMobile ? Math.max(40, Math.floor(COUNT * 0.5)) : COUNT
  const pointsRef = useRef()
  const velocities = useRef(
    Array.from({ length: COUNT }, () => [
      -0.002 + Math.random() * 0.004,
      -0.002 + Math.random() * 0.004,
    ])
  ).current

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const w = BOX.xMax - BOX.xMin
    const h = BOX.yMax - BOX.yMin
    const d = BOX.zMax - BOX.zMin
    for (let i = 0; i < count; i++) {
      positions[i * 3] = BOX.xMin + Math.random() * w
      positions[i * 3 + 1] = BOX.yMin + Math.random() * h
      positions[i * 3 + 2] = BOX.zMin + Math.random() * d
      phases[i] = Math.random() * Math.PI * 2
      const c = pickColor()
      c.multiplyScalar(0.7 + Math.random() * 0.3)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSize: { value: 0.5 } },
      vertexShader: FIREFLY_VERT,
      fragmentShader: FIREFLY_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry: geo, material: mat }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
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
