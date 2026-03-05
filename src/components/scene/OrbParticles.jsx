/**
 * OrbParticles — 5–8 tiny particles orbiting each memory orb.
 * Soft sparkles in the orb's color (pastel), additive blending.
 * ShaderMaterial with circle clip so points render as soft circles.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 7

const VERT = /* glsl */`
uniform float uSize;
void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * (4.0 / max(-mvPos.z, 1.0));
  gl_Position = projectionMatrix * mvPos;
}
`

const FRAG = /* glsl */`
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.35, 0.5, dist)) * uOpacity;
  gl_FragColor = vec4(uColor, alpha);
}
`

function pastelColor(hex) {
  const c = new THREE.Color(hex || '#b080ff')
  c.lerp(new THREE.Color('#ffffff'), 0.45)
  return c
}

export default function OrbParticles({ position, color, isHovered = false, isSelected = false }) {
  const pointsRef = useRef()
  const colorObj = useMemo(() => pastelColor(color), [color])
  const opacityRef = useRef(0.5)

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2
      const radius = 0.4 + Math.random() * 0.2
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [])

  const uniforms = useMemo(() => ({
    uSize: { value: 0.12 },
    uColor: { value: new THREE.Vector3(colorObj.r, colorObj.g, colorObj.b) },
    uOpacity: { value: 0.5 },
  }), [colorObj])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current?.geometry?.attributes?.position) return
    const t = clock.elapsedTime
    const posArray = pointsRef.current.geometry.attributes.position.array
    const speedMult = (isHovered || isSelected) ? 2.2 : 1
    const baseRadius = (isHovered || isSelected) ? 0.45 : 0.35
    const opacityTgt = 0.5 * ((isHovered || isSelected) ? 1.5 : 1)
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, opacityTgt, Math.min(1, delta * 5))
    if (pointsRef.current.material?.uniforms?.uOpacity) {
      pointsRef.current.material.uniforms.uOpacity.value = opacityRef.current
    }
    for (let i = 0; i < COUNT; i++) {
      const baseAngle = (i / COUNT) * Math.PI * 2
      const angle = baseAngle + t * (0.2 * speedMult)
      const radius = baseRadius + Math.sin(t * 0.5 + i) * 0.08
      posArray[i * 3] = Math.cos(angle) * radius
      posArray[i * 3 + 1] = Math.sin(t * 0.3 + i * 1.5) * 0.15
      posArray[i * 3 + 2] = Math.sin(angle) * radius
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const posVec = useMemo(
    () => (Array.isArray(position) ? [position[0], position[1], position[2]] : [0, 0, 0]),
    [position]
  )

  return (
    <points ref={pointsRef} position={posVec}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
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
