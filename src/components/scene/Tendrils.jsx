/**
 * Tendrils — ethereal energy threads from tree trunk to each orb.
 *
 * - Single tube per tendril: TubeGeometry (radius 0.008), MeshBasicMaterial with orb color, additive blending.
 * - Opacity 0.35 base; energy dot (sphere 0.015) travels root→orb and back every 3s, white opacity 0.8.
 * - Endpoint uses same viewport scaling as orbs so tendrils match orb positions.
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MEMORIES, getMemoryPosition } from '../../data/memories'
import useStore from '../../hooks/useStore'

const Z_OFFSET = -3.5
const TRUNK_ROOT = new THREE.Vector3(0, 0.5, Z_OFFSET)

// Moonlight silk threads — more visible, mystical
const TUBE_RADIUS = 0.005
const TUBE_GLOW_RADIUS = 0.012
const TUBE_TUBULAR_SEGMENTS = 20
const TUBE_RADIAL_SEGMENTS = 6
const TUBE_OPACITY = 0.38
const TUBE_GLOW_OPACITY = 0.24
const MOONLIGHT_COLOR = new THREE.Color(220 / 255, 215 / 255, 200 / 255)
const ENERGY_DOT_RADIUS = 0.014
const ENERGY_DOT_LOOP_SEC = 2.5
const ENERGY_DOT_OPACITY = 0.88
const ENERGY_DOT_OFFSET_PER_ORB = 0.4

const sr = (seed, n) => {
  const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
  return (x - Math.floor(x)) - 0.5
}

function Tendril({ memory, index, position }) {
  const s = index + 1
  const hoveredOrb = useStore((st) => st.hoveredOrb)
  const selectedOrb = useStore((st) => st.selectedOrb)

  const { tubeMesh, tubeGlowMesh, curve } = useMemo(() => {
    const [x, y, z] = position
    const orbBasePos = new THREE.Vector3(x, y, z + Z_OFFSET)

    const start = TRUNK_ROOT.clone()
    start.x += sr(s, 1) * 0.1
    start.y += sr(s, 2) * 0.1
    start.z += sr(s, 3) * 0.1

    const chord = new THREE.Vector3().subVectors(orbBasePos, start)
    const len = chord.length()
    const tangent = chord.clone().normalize()
    const perp = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize()
    const mid = new THREE.Vector3()
      .addVectors(start, orbBasePos)
      .multiplyScalar(0.5)
      .add(perp.clone().multiplyScalar(len * 0.18))
    mid.y -= len * 0.07

    const curve = new THREE.CatmullRomCurve3([start, mid, orbBasePos], false)
    const tubeGeom = new THREE.TubeGeometry(curve, TUBE_TUBULAR_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL_SEGMENTS, false)
    const tubeGlowGeom = new THREE.TubeGeometry(curve, TUBE_TUBULAR_SEGMENTS, TUBE_GLOW_RADIUS, TUBE_RADIAL_SEGMENTS, false)
    const mat = new THREE.MeshBasicMaterial({
      color: MOONLIGHT_COLOR,
      transparent: true,
      opacity: TUBE_OPACITY,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    })
    const glowMat = new THREE.MeshBasicMaterial({
      color: MOONLIGHT_COLOR,
      transparent: true,
      opacity: TUBE_GLOW_OPACITY,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const tube = new THREE.Mesh(tubeGeom, mat)
    const tubeGlow = new THREE.Mesh(tubeGlowGeom, glowMat)
    return { tubeMesh: tube, tubeGlowMesh: tubeGlow, curve }
  }, [position[0], position[1], position[2], s])

  const energyDotRef = useRef()
  const curveRef = useRef(curve)

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    curveRef.current = curve

    const isHov = hoveredOrb === memory.id
    const isSel = selectedOrb === memory.id
    const visualTier = memory.visualTier || 'primary'
    const isAmbient = memory.orbType === 'ambient'
    const tierMult = visualTier === 'hero' ? 1.1 : visualTier === 'secondary' ? 0.6 : 1
    const opacity = (isSel ? 0.52 : (isHov && !isAmbient) ? 0.45 : TUBE_OPACITY) * tierMult
    if (tubeMesh.material.opacity !== opacity) {
      tubeMesh.material.opacity = THREE.MathUtils.lerp(tubeMesh.material.opacity, opacity, 0.12)
    }

    // Energy dot: same speed whether hovered or not — no extra line activity.
    const loopSec = ENERGY_DOT_LOOP_SEC
    const energyPhase = (elapsed + index * ENERGY_DOT_OFFSET_PER_ORB) % loopSec
    const along = energyPhase / loopSec
    if (energyDotRef.current && curve) {
      const pos = curve.getPointAt(along)
      energyDotRef.current.position.copy(pos)
      energyDotRef.current.visible = true
      energyDotRef.current.material.opacity = ((isHov && !isAmbient) ? 0.75 : ENERGY_DOT_OPACITY) * tierMult
    }
  })

  return (
    <group raycast={() => null}>
      <primitive object={tubeGlowMesh} />
      <primitive object={tubeMesh} />
      <mesh ref={energyDotRef} visible={false}>
        <sphereGeometry args={[ENERGY_DOT_RADIUS, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={ENERGY_DOT_OPACITY}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Tendrils({ memories = MEMORIES }) {
  const isMobile = useStore((s) => s.isMobile)
  return (
    <>
      {memories.map((memory, i) => (
        <Tendril
          key={memory.id}
          memory={memory}
          index={i}
          position={getMemoryPosition(memory, isMobile)}
        />
      ))}
    </>
  )
}
