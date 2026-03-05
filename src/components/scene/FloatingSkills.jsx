/**
 * FloatingSkills — skill/tech labels drifting through the scene like runes or dream words.
 * Always visible; when a memory is open, related skills brighten and drift toward the orb.
 */
import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { MEMORIES } from '../../data/memories'

const SKILLS = [
  'React', 'Three.js', 'Python', 'TypeScript', 'Node.js',
  'TensorFlow', 'AWS', 'Docker', 'Voiceflow', 'AI/ML',
  'WebGL', 'Next.js', 'MongoDB', 'REST APIs', 'Git',
]

const Z_OFFSET = -3.5 // same as SpiralGroup

// Scatter in volume: x -4..4, y -3..2.5, z -4..0 (constellation depth)
function createInitialPositions() {
  return SKILLS.map(() => [
    -4 + Math.random() * 8,
    -3 + Math.random() * 5.5,
    -4 + Math.random() * 4,
  ])
}

export default function FloatingSkills() {
  const activePanel = useStore((s) => s.activePanel)
  const selectedOrbWorldPos = useStore((s) => s.selectedOrbWorldPos)

  const initial = useMemo(() => createInitialPositions(), [])
  const [positions, setPositions] = useState(initial)
  const [opacities, setOpacities] = useState(() => SKILLS.map(() => 0.15))
  const [colors, setColors] = useState(() => SKILLS.map(() => 'rgba(120, 180, 255, 0.18)'))
  const positionsRef = useRef(initial)
  const timeRef = useRef(0)

  const memory = useMemo(() => {
    if (activePanel?.type !== 'memory' || !activePanel?.id) return null
    return MEMORIES.find((m) => m.id === activePanel.id) || null
  }, [activePanel])

  const relatedSet = useMemo(() => {
    if (!memory?.skills?.length) return new Set()
    return new Set(memory.skills)
  }, [memory])

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    // Orb world pos; our group is at (0, 0, Z_OFFSET), so local orb = (wx, wy, wz - Z_OFFSET)
    const orbPosLocal =
      selectedOrbWorldPos && selectedOrbWorldPos.length >= 3
        ? new THREE.Vector3(
            selectedOrbWorldPos[0],
            selectedOrbWorldPos[1],
            selectedOrbWorldPos[2] - Z_OFFSET
          )
        : null

    const nextPositions = positionsRef.current.map((pos, i) => {
      const skillText = SKILLS[i]
      const related = relatedSet.has(skillText)
      let x = pos[0]
      let y = pos[1]
      let z = pos[2]

      x += Math.sin(t * 0.15 + i * 2.0) * 0.002
      y += Math.cos(t * 0.1 + i * 1.5) * 0.001

      if (orbPosLocal && related) {
        const dx = orbPosLocal.x - x
        const dy = orbPosLocal.y - y
        const dz = orbPosLocal.z - z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
        const pull = 0.008 * Math.min(1, 2 / dist)
        x += dx * pull
        y += dy * pull
        z += dz * pull
      }

      return [x, y, z]
    })

    const nextOpacities = SKILLS.map((skillText, i) => {
      if (memory && relatedSet.size > 0) {
        if (relatedSet.has(skillText)) return 0.5
        return 0.04
      }
      return 0.12 + Math.sin(t * 0.3 + i * 1.8) * 0.06
    })

    const orbColor = memory?.color
      ? (() => {
          const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(memory.color)
          if (!m) return null
          return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
        })()
      : null

    const nextColors = SKILLS.map((skillText, i) => {
      if (memory && relatedSet.has(skillText) && orbColor) {
        return `rgba(${orbColor.r}, ${orbColor.g}, ${orbColor.b}, ${nextOpacities[i]})`
      }
      const o = Math.max(0.06, Math.min(0.18, nextOpacities[i]))
      return `rgba(120, 180, 255, ${o})`
    })

    positionsRef.current = nextPositions
    setPositions([...nextPositions])
    setOpacities([...nextOpacities])
    setColors([...nextColors])
  })

  return (
    <group position={[0, 0, Z_OFFSET]}>
      {SKILLS.map((skillText, i) => (
        <Html
          key={skillText}
          position={[positions[i][0], positions[i][1], positions[i][2]]}
          center
          distanceFactor={10}
          occlude={false}
          style={{
            color: colors[i],
            fontSize: '10px',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: '300',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            textShadow: '0 0 8px rgba(100, 160, 255, 0.15)',
            transition: 'color 0.4s ease, opacity 0.4s ease',
          }}
        >
          {skillText}
        </Html>
      ))}
    </group>
  )
}
