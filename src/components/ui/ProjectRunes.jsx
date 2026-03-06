/**
 * ProjectRunes — floating rune stones on the right: Unice's projects as ancient glowing tablets.
 * Fixed right edge, vertically centered; hidden when memory panel is open or on mobile.
 */

import { useState } from 'react'
import styles from './ProjectRunes.module.css'

const PROJECTS = [
  { id: 'core-memories', name: 'Core Memories', desc: 'Interactive 3D portfolio', tech: 'React · Three.js · AI' },
  { id: 'project-2', name: 'Project Two', desc: 'Coming soon', tech: '—' },
  { id: 'project-3', name: 'Project Three', desc: 'Coming soon', tech: '—' },
]

export default function ProjectRunes() {
  const [hoveredId, setHoveredId] = useState(null)

  const handleClick = (e, id) => {
    e.preventDefault()
    if (import.meta.env?.DEV) console.log('[ProjectRunes] click', id)
  }

  return (
    <div
      className={styles.wrapper}
      aria-label="Projects"
    >
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
