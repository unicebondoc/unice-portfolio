/**
 * SkillsPanel — immersive glass panel with rune-chip tags, grouped by category.
 * Opens when the Skills artifact is clicked.
 */
import { useMemo } from 'react'
import { MEMORIES } from '../../data/memories'
import styles from './SkillsPanel.module.css'

const SKILLS_ORB = MEMORIES.find((m) => m.category === 'skills')
const RAW_SKILLS = SKILLS_ORB?.skills ?? [
  'React', 'Three.js', 'Python', 'TypeScript', 'Node.js',
  'TensorFlow', 'AWS', 'Docker', 'Voiceflow', 'AI/ML',
  'WebGL', 'Next.js', 'MongoDB', 'REST APIs', 'Git',
]

const CATEGORIES = [
  { key: 'languages', label: 'LANGUAGES', skills: ['Python', 'TypeScript', 'JavaScript'] },
  { key: 'frameworks', label: 'FRAMEWORKS', skills: ['React', 'Next.js', 'Three.js', 'Node.js'] },
  { key: 'ai', label: 'AI / ML', skills: ['TensorFlow', 'AI/ML', 'Voiceflow'] },
  { key: 'tools', label: 'TOOLS', skills: ['Docker', 'AWS', 'MongoDB', 'Git', 'REST APIs', 'WebGL'] },
]

function groupSkillsByCategory() {
  const set = new Set(RAW_SKILLS)
  return CATEGORIES.map((cat) => ({
    ...cat,
    skills: cat.skills.filter((s) => set.has(s)),
  })).filter((cat) => cat.skills.length > 0)
}

export default function SkillsPanel({ onClose }) {
  const grouped = useMemo(groupSkillsByCategory, [])
  let tagIndex = 0

  return (
    <div className={styles.anchor} aria-label="Skills & tech stack" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        />
        <div className={styles.headerGlow} aria-hidden />
        <header className={styles.header}>
          <span className={styles.sparkle} aria-hidden>✦</span>
          <h2 className={styles.title}>SKILLS</h2>
          <p className={styles.subtitle}>what i know</p>
        </header>
        <div className={styles.grid}>
          {grouped.map((cat) => (
            <div key={cat.key} className={styles.section}>
              <span className={styles.sectionLabel}>{cat.label}</span>
              <div className={styles.row}>
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className={styles.chip}
                    style={{ animationDelay: `${tagIndex++ * 0.03}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
