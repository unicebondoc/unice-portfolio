import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES, TIER_RADIUS } from '../../data/memories'

/**
 * MemoryOrb — Bioluminescent Jellyfish Spirit.
 *
 * Structure (outer → inner):
 *   1. Fresnel rim     ShaderMaterial  — soft additive rim glow
 *   2. Glass bell      MeshPhysicalMaterial — transmission 0.60, IOR 1.5
 *   3. Photo sphere    (optional) — texture inside the crystal
 *   4. Inner core      MeshStandardMaterial  — emissive soul glow
 *   5. Tentacles       4–5 thin cylinders hanging below, sine-wave sway
 *   6. PointLight      — lights surrounding scene/particles in orb color
 *
 * Animations:
 *   - Breathing: slow scale 0.97 ↔ 1.03
 *   - Float: gentle Y sine drift
 *   - Rotation: very slow Y + subtle Z wobble
 *   - Opacity pulse: glass 0.60 ↔ 0.90 slowly
 *   - Hover: core 3× brighter, glass more transparent, scale boost
 *   - Pulse: Gemini-triggered bell-curve scale + emissive burst
 */

// ── Error boundary — silently drops texture if image 404s ────────
class OrbImageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? null : this.props.children }
}

// ── Inner photo sphere ────────────────────────────────────────────
function TexturedInner({ radius, url }) {
  const texture = useTexture(url)
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
  return (
    <Sphere args={[radius, 40, 40]}>
      <meshStandardMaterial
        map={texture}
        roughness={0.15}
        metalness={0}
        toneMapped={false}
      />
    </Sphere>
  )
}

// ── Fresnel rim glow ──────────────────────────────────────────────
const VERT = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`
const FRAG = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`

function FresnelRim({ radius, color }) {
  const colorVec = useMemo(() => new THREE.Color(color), [color])
  const uniforms  = useMemo(() => ({
    uColor:     { value: colorVec },
    uIntensity: { value: 0.65 },
  }), [colorVec])
  return (
    <Sphere args={[radius * 1.04, 32, 32]}>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </Sphere>
  )
}

// ── Jellyfish tentacles ───────────────────────────────────────────
function Tentacles({ radius, color }) {
  const COUNT      = 5
  const groupRefs  = useRef([])
  const orbColor   = useMemo(() => new THREE.Color(color), [color])

  const defs = useMemo(() => (
    Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2
      const r = radius * 0.45
      return {
        x:      Math.cos(angle) * r,
        z:      Math.sin(angle) * r,
        phase:  (i / COUNT) * Math.PI * 2,
        speed:  0.28 + (i % 3) * 0.06,
        length: radius * (0.90 + (i % 2) * 0.40),
      }
    })
  ), [radius])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRefs.current.forEach((ref, i) => {
      if (!ref) return
      const { phase, speed } = defs[i]
      ref.rotation.x = Math.sin(t * speed + phase) * 0.22
      ref.rotation.z = Math.cos(t * speed * 0.65 + phase + 1.0) * 0.14
    })
  })

  return (
    <>
      {defs.map((d, i) => (
        // Group positioned at the base of the sphere; rotation pivots here
        <group key={i} position={[d.x, -radius, d.z]}>
          <group ref={(el) => (groupRefs.current[i] = el)}>
            {/* Shift cylinder down so its top sits at the group origin */}
            <mesh position={[0, -d.length / 2, 0]}>
              <cylinderGeometry args={[0.022, 0.004, d.length, 6, 1]} />
              <meshStandardMaterial
                color={orbColor}
                emissive={orbColor}
                emissiveIntensity={0.30}
                transparent
                opacity={0.35}
                roughness={0}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>
      ))}
    </>
  )
}

// ── Main orb component ────────────────────────────────────────────
export default function MemoryOrb({ memory, index = 0 }) {
  const { id, color, glowColor, position, isFuture, tier, image } = memory

  const isCore = tier === 'core'

  const RADIUS       = TIER_RADIUS[tier] ?? 1.0
  const CORE_RADIUS  = RADIUS * (isCore ? 0.38 : 0.35)
  const PHOTO_RADIUS = RADIUS * 0.82

  // Per-tier constants
  const BASE_CORE_EMIT  = isCore ? 1.2  : 0.48
  const BREATHE_SPEED   = isCore ? 0.75 : 0.52
  const FLOAT_AMP       = isCore ? 0.13 : 0.08
  const FLOAT_SPEED     = isCore ? 0.50 : 0.36
  const POINT_INTENSITY = isCore ? 0.85 : 0.24
  const POINT_DISTANCE  = isCore ? 6.0  : 3.5

  const groupRef = useRef()
  const glassMat = useRef()
  const coreMat  = useRef()
  const pointRef = useRef()

  const {
    hoveredOrb, setHoveredOrb,
    selectedOrb, setSelectedOrb,
    pulsingOrbs,
  } = useStore()

  const isHovered  = hoveredOrb  === id
  const isSelected = selectedOrb === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  // Supporting orbs dim when any core orb is hovered
  const hoveredMemory = MEMORIES.find((m) => m.id === hoveredOrb)
  const hoveredIsCore = hoveredMemory?.tier === 'core'
  const isDimmed      = hoveredIsCore && !isCore && !isActive

  // Entrance stagger
  const birthRef    = useRef(null)
  const INTRO_DELAY = index * 0.14
  const INTRO_RISE  = 0.80

  // Pulse
  const pulseStartRef = useRef(null)
  const wasPulsingRef = useRef(false)
  const PULSE_DUR     = 1.8

  const seed     = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbColor = useMemo(() => new THREE.Color(color), [color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    // ── Birth / entrance ──────────────────────────────────────
    if (birthRef.current === null) birthRef.current = t
    const age       = t - birthRef.current
    const introRaw  = Math.max(0, (age - INTRO_DELAY) / INTRO_RISE)
    const introEase = 1 - Math.pow(1 - Math.min(1, introRaw), 3)

    // ── Pulse (Gemini trigger) ────────────────────────────────
    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const pe = t - pulseStartRef.current
      if (pe < PULSE_DUR) pulseFactor = Math.sin((pe / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    // ── Float & rotate ────────────────────────────────────────
    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_SPEED + seed) * FLOAT_AMP
    groupRef.current.rotation.y = t * (isCore ? 0.07 : 0.04)
    groupRef.current.rotation.z = Math.sin(t * 0.20 + seed) * 0.03

    // ── Breathing scale (0.97 ↔ 1.03) ────────────────────────
    const breathe  = 0.97 + (Math.sin(t * BREATHE_SPEED + seed) * 0.5 + 0.5) * 0.06
    const hoverMul = isActive ? 1.12 : isDimmed ? 0.88 : 1.0
    const pulseMul = 1 + pulseFactor * (isCore ? 0.28 : 0.18)
    const target   = introEase * breathe * hoverMul * pulseMul

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.08)
    )

    // ── Glass opacity pulse (jellyfish breathing 0.60 ↔ 0.90) ─
    if (glassMat.current) {
      const tgt_tx = isDimmed ? 0.70 : isActive ? 0.85 : (isFuture ? 0.98 : 0.60)
      const tgt_op = isDimmed ? 0.40 : isActive ? 0.90
        : (isFuture ? 0.92 : 0.60 + Math.sin(t * 0.28 + seed) * 0.15)
      glassMat.current.transmission = THREE.MathUtils.lerp(
        glassMat.current.transmission, tgt_tx, 0.06
      )
      glassMat.current.opacity = THREE.MathUtils.lerp(
        glassMat.current.opacity, tgt_op, 0.06
      )
    }

    // ── Inner core emissive (×3 on hover) ────────────────────
    if (coreMat.current) {
      const dimF      = isDimmed ? 0.20 : 1.0
      const hoverBright = isActive ? 3.0 : 1.0
      const tgt = BASE_CORE_EMIT * dimF * hoverBright + pulseFactor * 0.80
      coreMat.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMat.current.emissiveIntensity, tgt, 0.10
      )
    }

    // ── PointLight ────────────────────────────────────────────
    if (pointRef.current) {
      const hoverBoost = isActive ? 2.4 : isDimmed ? 0.15 : 1.0
      const tgt = POINT_INTENSITY * hoverBoost + pulseFactor * 0.55
      pointRef.current.intensity = THREE.MathUtils.lerp(
        pointRef.current.intensity, tgt, 0.10
      )
    }
  })

  const handleClick       = () => setSelectedOrb(isSelected ? null : id)
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHoveredOrb(id)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut  = () => {
    setHoveredOrb(null)
    document.body.style.cursor = 'auto'
  }

  const hasImage = Boolean(image)

  return (
    <group position={position} ref={groupRef} scale={[0, 0, 0]}>

      {/* ── Point light at orb center ─────────────────────────── */}
      <pointLight
        ref={pointRef}
        position={[0, 0, 0]}
        color={color}
        intensity={POINT_INTENSITY}
        distance={POINT_DISTANCE}
        decay={2}
      />

      {/* ── Fresnel rim glow ───────────────────────────────────── */}
      <FresnelRim radius={RADIUS} color={glowColor} />

      {/* ── Glass bell ────────────────────────────────────────── */}
      <Sphere
        args={[RADIUS, isCore ? 64 : 48, isCore ? 64 : 48]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshPhysicalMaterial
          ref={glassMat}
          color={orbColor}
          transmission={isFuture ? 0.98 : 0.60}
          roughness={0}
          metalness={0.05}
          thickness={1.5}
          ior={1.5}
          transparent
          opacity={isFuture ? 0.92 : 0.75}
          envMapIntensity={2.0}
          side={THREE.FrontSide}
        />
      </Sphere>

      {/* ── Photo texture (inside glass) ──────────────────────── */}
      {hasImage && (
        <OrbImageErrorBoundary>
          <Suspense fallback={null}>
            <TexturedInner radius={PHOTO_RADIUS} url={image} />
          </Suspense>
        </OrbImageErrorBoundary>
      )}

      {/* ── Inner soul glow ───────────────────────────────────── */}
      <Sphere args={[CORE_RADIUS, 24, 24]}>
        <meshStandardMaterial
          ref={coreMat}
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={BASE_CORE_EMIT}
          roughness={0}
          metalness={0}
          toneMapped={false}
        />
      </Sphere>

      {/* ── Jellyfish tentacles ───────────────────────────────── */}
      <Tentacles radius={RADIUS} color={color} />

    </group>
  )
}
