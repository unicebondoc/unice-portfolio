import styles from './HUD.module.css'

/**
 * HUD — persistent heads-up display overlaid on the 3D scene.
 * Shows the site identity and a minimal instruction hint.
 */
export default function HUD() {
  return (
    <>
      {/* ── Top-left: identity ────────────────────────────── */}
      <header className={styles.header}>
        <span className={styles.name}>Unice Bondoc</span>
        <span className={styles.role}>AI Engineer</span>
      </header>

      {/* ── Bottom-center: hint ───────────────────────────── */}
      <div className={styles.hint}>
        <span>hover an orb · click to explore</span>
      </div>

      {/* ── Bottom-right: version tag ─────────────────────── */}
      <div className={styles.badge}>
        <span>Core Memories</span>
      </div>
    </>
  )
}
