import { useState, useCallback, useEffect } from 'react'
import styles from './GestureTarotScroll.module.css'

export default function GestureTarotScroll() {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = useCallback(() => {
    setShowTooltip(true)
  }, [])

  useEffect(() => {
    if (!showTooltip) return
    const t = setTimeout(() => setShowTooltip(false), 2000)
    return () => clearTimeout(t)
  }, [showTooltip])

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.scrollContainer}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        aria-label="Gesture Tarot — coming soon"
      >
        {/* Top scroll roll */}
        <div className={`${styles.scrollRoll} ${styles.scrollTop}`} />

        {/* Main scroll body */}
        <div className={styles.scrollBody}>
          {/* Status badge */}
          <div className={styles.scrollStatus}>
            <span className={styles.statusDot} />
            BUILDING
          </div>

          {/* Glow line */}
          <div className={styles.scrollLine} />

          {/* Project name */}
          <div className={styles.scrollTitle}>
            GESTURE
            <br />
            TAROT
          </div>

          {/* Description */}
          <div className={styles.scrollDesc}>
            A webcam AI tarot reader using hand gesture recognition. Currently in
            development.
          </div>

          {/* Glow line */}
          <div className={styles.scrollLine} />

          {/* Tech tags */}
          <div className={styles.scrollTags}>
            MediaPipe · Computer Vision · AI
          </div>
        </div>

        {/* Bottom scroll roll */}
        <div className={`${styles.scrollRoll} ${styles.scrollBottom}`} />
      </div>

      {showTooltip && (
        <div className={styles.comingSoon} aria-live="polite">
          ✦ coming soon ✦
        </div>
      )}
    </div>
  )
}
