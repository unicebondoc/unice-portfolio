import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const FONT = '/fonts/Cinzel-Regular.woff2'
const CYAN = '#A8F3FF'

/**
 * SceneTitle — floating 3D text in the upper canopy.
 *
 * "UNICE" in large Cinzel serif, "AI ENGINEER" as a fine subtitle.
 * Placed upper-left of center, slightly behind the core arc (z = -0.8)
 * so it feels embedded in the light rays rather than pasted on top.
 *
 * Fade-in: fillOpacity 0 → 1 over 2 s, driven by elapsed time.
 * Emissive effect comes from Bloom post-processing picking up the
 * bright cyan colour once fully faded in.
 */
export default function SceneTitle() {
  const titleRef    = useRef()
  const subtitleRef = useRef()
  const timerRef    = useRef(new THREE.Timer())

  useFrame(() => {
    timerRef.current.update()
    const elapsed = timerRef.current.getElapsed()
    // Smooth ease-in: opacity 0 → 1 over 2 s
    const raw     = Math.min(1, elapsed / 2.0)
    const opacity = raw * raw * (3 - 2 * raw)   // smoothstep

    if (titleRef.current)    titleRef.current.fillOpacity    = opacity
    if (subtitleRef.current) subtitleRef.current.fillOpacity = opacity * 0.72
  })

  return (
    // Upper-left canopy — x offset keeps it clear of orb cluster center
    <group position={[-2.6, 3.6, -0.8]}>

      {/* ── Primary name ─────────────────────────────────────────── */}
      <Text
        ref={titleRef}
        font={FONT}
        fontSize={0.32}
        color={CYAN}
        fillOpacity={0}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.06}
        depthOffset={-1}
      >
        UNICE
      </Text>

      {/* ── Subtitle ─────────────────────────────────────────────── */}
      <Text
        ref={subtitleRef}
        font={FONT}
        fontSize={0.155}
        color={CYAN}
        fillOpacity={0}
        anchorX="left"
        anchorY="middle"
        position={[0.04, -0.44, 0]}
        letterSpacing={0.22}
        depthOffset={-1}
      >
        AI ENGINEER
      </Text>

    </group>
  )
}
