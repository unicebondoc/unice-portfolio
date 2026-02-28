import { Html } from '@react-three/drei'
import { MEMORIES } from '../../data/memories'
import useStore from '../../hooks/useStore'
import styles from './OrbLabel.module.css'

/**
 * OrbLabel — HTML label that floats beneath each orb in 3D space.
 * Uses @react-three/drei's <Html> component to place DOM in world coords.
 */
function SingleLabel({ memory }) {
  const { id, title, subtitle, color, position } = memory
  const hoveredOrb  = useStore((s) => s.hoveredOrb)
  const selectedOrb = useStore((s) => s.selectedOrb)

  const visible = hoveredOrb === id || selectedOrb === id

  return (
    <Html
      position={[position[0], position[1] - 1.65, position[2]]}
      center
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={styles.label}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          '--orb-color': color,
        }}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </Html>
  )
}

export default function OrbLabels() {
  return (
    <>
      {MEMORIES.map((m) => (
        <SingleLabel key={m.id} memory={m} />
      ))}
    </>
  )
}
