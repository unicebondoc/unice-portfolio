/**
 * FocusPanel — holographic glass panel that floats BESIDE the clicked orb.
 *
 * Positioning is handled frame-by-frame by PanelPositioner (App.jsx) via
 * direct DOM style mutation on panelDomRef — zero React re-renders while
 * the camera is lerping. React only handles show/hide and content.
 */
import useStore from '../../hooks/useStore'
import { MEMORIES } from '../../data/memories'
import { panelDomRef } from '../../utils/panelRef'
import { getVideoUrl } from '../../utils/videoUrl'
import styles from './FocusPanel.module.css'

const IS_PHOTO = /\.(png|jpe?g|webp)$/i

export default function FocusPanel() {
  const selectedOrb            = useStore((s) => s.selectedOrb)
  const setSelectedOrb         = useStore((s) => s.setSelectedOrb)
  const setSelectedOrbWorldPos = useStore((s) => s.setSelectedOrbWorldPos)

  const memory  = MEMORIES.find((m) => m.id === selectedOrb)
  const isPhoto = IS_PHOTO.test(memory?.image ?? '')

  const handleClose = () => {
    setSelectedOrb(null)
    setSelectedOrbWorldPos(null)
  }

  // Always in DOM so panelDomRef.current is always populated.
  // Visibility controlled by .visible CSS class (opacity + scale transition).
  return (
    <div
      ref={panelDomRef}
      className={`${styles.panel} ${memory ? styles.visible : ''} ${memory?.isFuture ? styles.future : ''}`}
      style={{ '--orb-color': memory?.color ?? '#00FFFF' }}
      onClick={(e) => e.stopPropagation()}
    >
      {memory && (
        <>
          {/* ── Glowing X close ─────────────────────────────────── */}
          <button className={styles.close} onClick={handleClose} aria-label="Close">
            ✕
          </button>

          {/* ── Top shimmer edge ─────────────────────────────────── */}
          <div className={styles.shimmer} />

          {/* ── Video ────────────────────────────────────────────── */}
          {memory.videoSrc && (
            <video
              key={memory.videoSrc}
              className={styles.video}
              src={getVideoUrl(memory.videoSrc)}
              autoPlay
              loop
              muted
              playsInline
            />
          )}

          {/* ── Circular photo (PNG/JPG only, no video) ──────────── */}
          {isPhoto && !memory.videoSrc && (
            <div className={styles.photoWrap}>
              <img
                className={styles.photo}
                src={memory.image}
                alt={memory.title}
                draggable="false"
              />
            </div>
          )}

          {/* ── Scrollable content ───────────────────────────────── */}
          <div className={styles.scroll}>
            <div className={styles.content}>
              {/* Meta */}
              <div className={styles.meta}>
                <span className={styles.year}>{memory.year}</span>
                <span className={styles.badge}>{memory.emotion}</span>
                {memory.tier === 'core' && (
                  <span className={styles.coreBadge}>✦ Core Memory</span>
                )}
                {memory.isFuture && (
                  <span className={styles.dreamBadge}>✦ dream</span>
                )}
              </div>

              {/* Title */}
              <h2 className={styles.title}>
                {memory.icon && <span className={styles.icon}>{memory.icon}</span>}
                {memory.title}
              </h2>
              <p className={styles.subtitle}>{memory.subtitle}</p>

              {/* Description */}
              <p className={styles.description}>{memory.description}</p>

              {/* Tags */}
              <div className={styles.tags}>
                {memory.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              {/* CTA */}
              {memory.link && (
                <a
                  href={memory.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                >
                  View Project →
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
