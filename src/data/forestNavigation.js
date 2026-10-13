import { PROJECTS } from './projects.js'
import { MEMORIES } from './memories.js'
import { FOREST_NODES } from './forestNodes.js'

const PROJECT_IDS = new Set(PROJECTS.map(project => project.id))
const PANELS = new Set(['work', 'journey', 'experience', 'about', 'writing', 'cv', 'contact'])

export function resolveForestLocation({ pathname = '/', hash = '' } = {}) {
  const target = hash.replace(/^#/, '')
  if (['world', 'intro', 'content', 'pw-world-details'].includes(target)) return null
  if (target.startsWith('project-') && PROJECT_IDS.has(target.slice(8))) return { kind: 'project', id: target.slice(8) }
  if (target.startsWith('orb-')) return { kind: 'journey', chapter: target }
  if (target === 'core-memories') return { kind: 'journey' }
  if (target === 'flagships') return { kind: 'work' }
  if (PANELS.has(target)) return { kind: target }
  if (pathname.startsWith('/about')) return { kind: 'about' }
  if (pathname.startsWith('/writing')) return { kind: 'writing' }
  if (pathname.startsWith('/work')) return { kind: 'work' }
  return null
}

export function forestTarget(panel) {
  if (!panel) return '/#world'
  if (panel.kind === 'project') return `/work/#project-${panel.id}`
  if (panel.kind === 'journey' && panel.chapter) return `/#${panel.chapter}`
  if (['work', 'about', 'writing'].includes(panel.kind)) return `/${panel.kind}/#${panel.kind}`
  return `/#${panel.kind}`
}

export function forestNodeForReference(reference) {
  if (MEMORIES.some(memory => memory.id === reference)) return 'journey'
  if (typeof reference !== 'string' || !reference.startsWith('orb-project-')) return null
  const projectId = reference.slice('orb-project-'.length)
  return FOREST_NODES.some(node => node.kind === 'project' && node.id === projectId) ? projectId : null
}
