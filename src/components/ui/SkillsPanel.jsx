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
    skills: ['Python', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    key: 'frameworks',
    label: 'FRAMEWORKS & LIBRARIES',
    skills: ['React 18', 'Node.js', 'REST APIs', 'Git', 'GitHub'],
  },
  {
    key: 'ai',
    label: 'AI & GENERATIVE AI',
    skills: [
      'OpenAI API (GPT-4)',
      'Prompt Engineering',
      'LangChain',
      'RAG',
      'Pinecone',
      'AI Output Evaluation',
      'Voiceflow',
      'Anthropic Claude API',
      'Google Gemini API',
      'LLaMA',
    ],
  },
  {
    key: 'platforms',
    label: 'PLATFORMS & TOOLS',
    skills: [
      'Shopify Liquid',
      'Figma',
      'VS Code',
      'Adobe Premiere Pro',
      'Photoshop',
      'Lightroom',
      'MongoDB',
      'Flutter',
      'Microsoft 365',
    ],
  },
  {
    key: 'delivery',
    label: 'PROJECT DELIVERY',
    skills: [
      'Agile',
      'Scrum',
      'Jira',
      'Trello',
      'Confluence',
      'Notion',
      'ClickUp',
      'Stakeholder Coordination',
      'Risk Management',
      'IT Project Management',
    ],
  },
  {
    key: 'developing',
    label: 'DEVELOPING & FAMILIAR',
    skills: [
      'FastAPI',
      'Three.js',
      'React Three Fiber',
      'GLSL Shaders',
      'Azure OpenAI',
      'Azure AI Services',
      'Hugging Face',
      'AWS Cloud',
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
