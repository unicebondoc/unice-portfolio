/**
 * SkillsPanel — immersive glass panel with rune-chip tags, grouped by category.
 * Opens when the Skills artifact is clicked.
 * Content matches CV; outside click on backdrop closes panel.
 */
import { useMemo } from 'react'
import styles from './SkillsPanel.module.css'

const CATEGORIES = [
  {
    "key": "delivery",
    "label": "WORKFLOW & DELIVERY",
    "skills": [
      "Stakeholder Coordination",
      "Workflow Documentation",
      "Requirements",
      "Regression Checks",
      "Release Preparation"
    ]
  },
  {
    "key": "web",
    "label": "WEB PROJECT TECHNOLOGIES",
    "skills": [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Python",
      "SQL",
      "Supabase",
      "PostgreSQL",
      "Drizzle"
    ]
  },
  {
    "key": "ai",
    "label": "AI-ASSISTED WORKFLOWS",
    "skills": [
      "ChatGPT / Codex",
      "Claude",
      "Hermes",
      "API Integration",
      "Human Approval Steps"
    ]
  },
  {
    "key": "cloud",
    "label": "DEPLOYMENT & TOOLS",
    "skills": [
      "Git / GitHub",
      "AWS Lambda",
      "API Gateway",
      "S3 / CloudFront",
      "Vercel"
    ]
  },
  {
    "key": "interactive",
    "label": "INTERACTIVE PROJECTS",
    "skills": [
      "Three.js",
      "React Three Fiber",
      "WebGL",
      "Capacitor",
      "MediaPipe",
      "Unity",
      "C# in Unity"
    ]
  },
  {
    "key": "research",
    "label": "CAPSTONE RESEARCH",
    "skills": [
      "Python Analysis",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Content Evaluation"
    ]
  }
]

function buildGrouped() {
  return CATEGORIES.map((cat) => ({ ...cat }))
}

export default function SkillsPanel({ onClose }) {
  const grouped = useMemo(buildGrouped, [])
  let tagIndex = 0

  return (
    <div
      className={styles.anchor}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skills-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
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
          <h2 id="skills-title" className={styles.title}>TOOLS & PRACTICE</h2>
          <p className={styles.subtitle}>used in my AI-assisted project work</p>
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
