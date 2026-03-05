/**
 * SkillsPanel — small glass panel listing tech stack (from skills orb).
 * Opens when the Crystal artifact is clicked.
 */
import { useMemo } from 'react'
import { MEMORIES } from '../../data/memories'
import styles from './SkillsPanel.module.css'

const SKILLS_ORB = MEMORIES.find((m) => m.category === 'skills')
const SKILLS = SKILLS_ORB?.skills ?? [
  'React', 'Three.js', 'Python', 'TypeScript', 'Node.js',
  'TensorFlow', 'AWS', 'Docker', 'Voiceflow', 'AI/ML',
  'WebGL', 'Next.js', 'MongoDB', 'REST APIs', 'Git',
]

export default function SkillsPanel({ onClose }) {
  const grouped = useMemo(() => {
    const all = [...SKILLS]
    const rows = []
    for (let i = 0; i < all.length; i += 4) rows.push(all.slice(i, i + 4))
    return rows
  }, [])

  return (
    <div className={styles.anchor} aria-label="Skills & tech stack">
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        />
        <h2 className={styles.title}>SKILLS</h2>
        <p className={styles.subtitle}>Tools & technologies</p>
        <div className={styles.grid}>
          {grouped.map((row, i) => (
            <div key={i} className={styles.row}>
              {row.map((skill) => (
                <span key={skill} className={styles.chip}>{skill}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
