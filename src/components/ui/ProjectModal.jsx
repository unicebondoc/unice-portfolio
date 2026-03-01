import { AnimatePresence, motion } from 'framer-motion'
import useStore from '../../hooks/useStore'
import { MEMORIES } from '../../data/memories'
import styles from './ProjectModal.module.css'

const backdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
}

const panel = {
  hidden:  { opacity: 0, y: 48, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: 24, scale: 0.96, transition: { duration: 0.18 } },
}

export default function ProjectModal() {
  const { selectedOrb, setSelectedOrb } = useStore()
  const memory = MEMORIES.find((m) => m.id === selectedOrb)

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className={styles.backdrop}
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setSelectedOrb(null)}
        >
          <motion.div
            className={`${styles.panel} ${memory.isFuture ? styles.futurePanelMod : ''}`}
            variants={panel}
            style={{ '--orb-color': memory.color }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className={styles.close}
              onClick={() => setSelectedOrb(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Colored top accent bar */}
            <div
              className={styles.accent}
              style={{
                background: memory.isFuture
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'
                  : memory.color,
              }}
            />

            <div className={styles.content}>
              {/* Meta row */}
              <div className={styles.metaRow}>
                <span className={styles.year}>{memory.year}</span>
                <span className={styles.emotionBadge}>{memory.emotion}</span>
                {memory.tier === 'core' && (
                  <span className={styles.coreBadge}>✦ Core Memory</span>
                )}
                {memory.isFuture && (
                  <span className={styles.dreamBadge}>✦ dream</span>
                )}
              </div>

              {/* Title & subtitle */}
              <h2 className={styles.title}>
                {memory.icon && (
                  <span className={styles.titleIcon}>{memory.icon}</span>
                )}
                {memory.title}
              </h2>
              <p  className={styles.subtitle}>{memory.subtitle}</p>

              {/* Description */}
              <p className={styles.description}>{memory.description}</p>

              {/* Tags */}
              <div className={styles.tags}>
                {memory.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              {/* CTA — only shown when a real link exists */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
