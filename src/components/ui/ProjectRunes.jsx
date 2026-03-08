/**
 * ProjectRunes — floating rune stones on the right: Gesture Tarot only.
 * Parallax with cursor; faint vine connecting to tree/heart.
 */

import { useState } from 'react'
import useStore from '../../hooks/useStore'
import styles from './ProjectRunes.module.css'

const PROJECTS = [
  {
    id: 'gesture-tarot',
    name: 'Gesture Tarot',
    desc: 'Hand-tracking AI that draws and reads tarot cards via webcam',
    tech: 'MediaPipe · TensorFlow.js · React',
    status: 'in progress',
  },
]

const PARALLAX_PX = 5

export default function ProjectRunes() {
  const [hoveredId, setHoveredId] = useState(null)
  const parallaxMouse = useStore((s) => s.parallaxMouse)

  const handleClick = (e, id) => {
    e.preventDefault()
    if (import.meta.env?.DEV) console.log('[ProjectRunes] click', id)
  }

  const parallaxStyle = {
    transform: `translateY(-50%) translate(${parallaxMouse.x * PARALLAX_PX}px, ${parallaxMouse.y * PARALLAX_PX}px)`,
  }

  return (
    <div
      className={styles.wrapper}
      style={parallaxStyle}
      aria-label="Projects"
    >
      <div className={styles.vine} aria-hidden />
      <div className={styles.stack}>
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className={`${styles.rune} ${hoveredId === project.id ? styles.runeHover : ''}`}
            style={{ '--stagger': `${i * 0.8}s` }}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={(e) => handleClick(e, project.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick(e, project.id)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Project: ${project.name}`}
          >
            <span className={styles.cornerDot} aria-hidden />
            <span className={styles.cornerDot} aria-hidden />
            <div className={styles.statusBadge} data-status={project.status || 'in progress'} aria-hidden>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>building</span>
            </div>
            <div className={styles.runeContent}>
              <span className={styles.runeName}>{project.name}</span>
              {hoveredId === project.id && (
                <>
                  <span className={styles.runeDesc}>{project.desc}</span>
                  <span className={styles.runeTech}>{project.tech}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
