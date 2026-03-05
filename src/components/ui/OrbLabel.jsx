import { Html } from '@react-three/drei'
import { MEMORIES } from '../../data/memories'
import { TIER_RADIUS } from '../../data/memories'
import useStore from '../../hooks/useStore'
import styles from './OrbLabel.module.css'

/**
 * OrbLabel — tooltip that appears below an orb on hover.
 * Shows: title · year pill · subtitle
 * Positioned in 3D world-space via drei <Html>.
 */
function SingleLabel({ memory, focusId }) {
  const { id, title, subtitle, year, color, position, isFuture, icon, tier } = memory

  const hoveredOrb  = useStore((s) => s.hoveredOrb)
  const selectedOrb = useStore((s) => s.selectedOrb)
  const active      = hoveredOrb === id || selectedOrb === id
  const dimmed      = !!focusId && focusId !== id
  const r = TIER_RADIUS[tier] ?? 1.0
  // Label sits just below the orb's bottom edge
  const yOffset = r * 1.55

  return (
    <Html
      position={[position[0], position[1] - yOffset, position[2]]}
      center
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={styles.tooltip}
        style={{
          opacity:    dimmed ? 0 : active ? 1 : 0.18,
          filter:     dimmed ? 'blur(6px)' : 'blur(0px)',
          transform:  active ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.92)',
          '--orb-color': color,
        }}
      >
        {/* Icon */}
        {active && icon && <span className={styles.icon}>{icon}</span>}

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
        {active && <span className={styles.subtitle}>{subtitle}</span>}

        {/* Click hint */}
        {active && <span className={styles.hint}>click to explore</span>}
      </div>
    </Html>
  )
}

export default function OrbLabels() {
  const hoveredOrb  = useStore((s) => s.hoveredOrb)
  const selectedOrb = useStore((s) => s.selectedOrb)
  const focusId     = selectedOrb || hoveredOrb || null

  return (
    <>
      {MEMORIES.map((m) => (
        <SingleLabel key={m.id} memory={m} focusId={focusId} />
      ))}
    </>
  )
}
