/**
 * SacredArtifacts — Game UI left sidebar: Skills, Résumé, Writings.
 */
import { useState } from 'react'
import useStore from '../../hooks/useStore'
import styles from './SacredArtifacts.module.css'

export default function SacredArtifacts() {
  const setActivePanel = useStore((s) => s.setActivePanel)
  const [rippleArtifact, setRippleArtifact] = useState(null)

  const handleSkillsClick = (e) => {
    e.preventDefault()
    setRippleArtifact('skills')
    setTimeout(() => {
      setRippleArtifact(null)
      setActivePanel({ type: 'skills' })
    }, 280)
  }

  const handleResumeClick = (e) => {
    e.preventDefault()
    setRippleArtifact('resume')
    setTimeout(() => {
      setRippleArtifact(null)
      setActivePanel({ type: 'resume' })
    }, 280)
  }

  const handleWritingsClick = (e) => {
    e.preventDefault()
    setRippleArtifact('writings')
    setTimeout(() => {
      setRippleArtifact(null)
      setActivePanel({ type: 'blog' })
    }, 280)
  }

  return (
    <div className={styles.sacredArtifacts} aria-label="Sacred artifacts">
      <button
        type="button"
        className={`${styles.artifact} ${styles.artifactSkills} ${rippleArtifact === 'skills' ? styles.artifactRipple : ''}`}
        onClick={handleSkillsClick}
        aria-label="Open Skills"
      >
        <div className={styles.artifactIcon}>
          <span>✦</span>
        </div>
        <div className={styles.artifactText}>
          <span className={styles.artifactLabel}>SKILLS</span>
          <span className={styles.artifactSubLabel}>what I know</span>
        </div>
      </button>

      <button
        type="button"
        className={`${styles.artifact} ${styles.artifactResume} ${rippleArtifact === 'resume' ? styles.artifactRipple : ''}`}
        onClick={handleResumeClick}
        aria-label="Open Résumé"
      >
        <div className={styles.artifactIcon}>
          <span>◈</span>
        </div>
        <div className={styles.artifactText}>
          <span className={styles.artifactLabel}>RÉSUMÉ</span>
          <span className={styles.artifactSubLabel}>my journey</span>
        </div>
      </button>

      <button
        type="button"
        className={`${styles.artifact} ${styles.artifactWritings} ${rippleArtifact === 'writings' ? styles.artifactRipple : ''}`}
        onClick={handleWritingsClick}
        aria-label="Open Writings"
      >
        <div className={styles.artifactIcon}>
          <span>❋</span>
        </div>
        <div className={styles.artifactText}>
          <span className={styles.artifactLabel}>WRITINGS</span>
          <span className={styles.artifactSubLabel}>my thoughts</span>
        </div>
      </button>
    </div>
  )
}
