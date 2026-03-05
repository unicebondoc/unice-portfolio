/**
 * IntroOverlay — 3-second awakening: dark screen fades to reveal the forest.
 * T+0–1s: opacity 1 → 0.7; T+1–2s: 0.7 → 0.3; T+2.5–3s: 0.3 → 0.
 * Removed (opacity 0, pointer-events: none) after 3s.
 */
import useStore from '../../hooks/useStore'
import styles from './IntroOverlay.module.css'

export default function IntroOverlay() {
  const entranceTime = useStore((s) => s.entranceTime)

  let opacity = 1
  if (entranceTime >= 3) {
    opacity = 0
  } else if (entranceTime >= 2.5) {
    opacity = 0.3 - ((entranceTime - 2.5) / 0.5) * 0.3
  } else if (entranceTime >= 2) {
    opacity = 0.3
  } else if (entranceTime >= 1) {
    opacity = 0.7 - ((entranceTime - 1) / 1) * 0.4
  } else {
    opacity = 1 - (entranceTime / 1) * 0.3
  }

  return (
    <div
      className={styles.overlay}
      style={{
        opacity,
        pointerEvents: entranceTime >= 3 ? 'none' : 'auto',
      }}
      aria-hidden
    />
  )
}
