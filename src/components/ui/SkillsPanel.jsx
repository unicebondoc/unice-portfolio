/**
 * SkillsPanel — immersive glass panel with rune-chip tags, grouped by category.
 * Opens when the Skills artifact is clicked.
 * Content matches CV; outside click on backdrop closes panel.
 */
import { useMemo } from 'react'
import styles from './SkillsPanel.module.css'

const CATEGORIES = [
  {
    key: 'languages',
    label: 'LANGUAGES',
    skills: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    key: 'ai',
    label: 'AI & LLMs',
    skills: [
      'OpenAI API (GPT-4)',
      'Gemini API',
      'LLaMA / Qwen (Ollama)',
      'LangChain',
      'RAG Pipelines',
      'Pinecone',
      'Prompt Engineering',
      'AI Agents',
      'Tool Calling',
    ],
  },
  {
    key: 'vision',
    label: 'COMPUTER VISION',
    skills: ['MediaPipe Hands', 'Real-time gesture recognition', 'Hand landmark detection'],
  },
  {
    key: 'frameworks',
    label: 'FRAMEWORKS & FRONTEND',
    skills: [
      'React 18',
      'Three.js',
      'React Three Fiber',
      'WebGL / GLSL',
      'Node.js',
      'FastAPI',
      'Vite',
      'Tailwind CSS',
    ],
  },
  {
    key: 'deploy',
    label: 'DEPLOYMENT & TOOLS',
    skills: [
      'Docker',
      'Vercel',
      'Railway',
      'Supabase',
      'Git / GitHub',
      'REST APIs',
      'Telegram Bot API',
      'Shopify Liquid',
      'Cursor AI IDE',
      'Claude Code (CLI agent)',
      'VS Code',
    ],
  },
  {
    key: 'cloud',
    label: 'CLOUD',
    skills: [
      'AWS Cloud Foundations (EC2, S3)',
      'Azure AI Fundamentals (AI-900)',
    ],
  },
  {
    key: 'delivery',
    label: 'PROJECT DELIVERY',
    skills: [
      'Agile',
      'Scrum',
      'IT Project Management',
      'Stakeholder Coordination',
      'Requirements Gathering',
      'Risk Management',
    ],
  },
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
      aria-label="Skills & tech stack"
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
