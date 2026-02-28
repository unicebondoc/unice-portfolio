import { AnimatePresence, motion } from 'framer-motion'
import useStore from '../../hooks/useStore'
import { MEMORIES } from '../../data/memories'
import styles from './ProjectModal.module.css'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
}

const panel = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 28 } },
  exit:    { opacity: 0, y: 20, scale: 0.97,
    transition: { duration: 0.2 } },
}

/**
 * ProjectModal — detail panel shown when a memory orb is selected.
 */
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
            className={styles.panel}
            variants={panel}
            style={{ '--orb-color': memory.color }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className={styles.close}
              onClick={() => setSelectedOrb(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Orb color accent bar */}
            <div
              className={styles.accent}
              style={{ background: memory.color }}
            />

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.year}>{memory.year}</span>
                <span className={styles.emotion}>{memory.emotion}</span>
              </div>

              <h2 className={styles.title}>{memory.title}</h2>
              <p className={styles.subtitle}>{memory.subtitle}</p>
              <p className={styles.description}>{memory.description}</p>

              <div className={styles.tags}>
                {memory.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              {memory.link && memory.link !== '#' && (
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
