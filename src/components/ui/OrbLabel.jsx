import { Html } from '@react-three/drei'
import { MEMORIES } from '../../data/memories'
import useStore from '../../hooks/useStore'
import styles from './OrbLabel.module.css'

/**
 * OrbLabel — tooltip that appears below an orb on hover.
 * Shows: title · year pill · subtitle
 * Positioned in 3D world-space via drei <Html>.
 */
function SingleLabel({ memory }) {
  const { id, title, subtitle, year, color, position, isFuture, icon } = memory

  const hoveredOrb  = useStore((s) => s.hoveredOrb)
  const selectedOrb = useStore((s) => s.selectedOrb)
  const visible     = hoveredOrb === id || selectedOrb === id

  return (
    <Html
      position={[position[0], position[1] - 1.72, position[2]]}
      center
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={styles.tooltip}
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
          '--orb-color': color,
        }}
      >
        {/* Icon */}
        {icon && <span className={styles.icon}>{icon}</span>}

        {/* Year pill */}
        <span
          className={styles.year}
          style={{ borderColor: color, color: isFuture ? 'rgba(255,255,255,0.5)' : color }}
        >
          {year}
        </span>

        {/* Title */}
        <span className={styles.title}>{title}</span>

        {/* Subtitle */}
        <span className={styles.subtitle}>{subtitle}</span>

        {/* Click hint */}
        <span className={styles.hint}>click to explore</span>
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
