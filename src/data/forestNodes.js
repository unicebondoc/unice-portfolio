import { PROJECTS } from './projects.js'

const WORLDS = [
  ['flatsync', 'A shared home', '/world/orb-flatsync.webp'],
  ['landlit', 'Property, connected', '/world/orb-landlit.webp'],
  ['what-was-drawn', 'A moment to reflect', '/world/orb-what-was-drawn.webp'],
  ['steeped', 'Tea & focus', '/world/orb-steeped.webp'],
  ['princess-of-alemio', 'A story to step into', '/world/orb-alemio.webp'],
  ['causeconnect', 'ACS WIL · Team of 10', '/world/orb-core-memories.webp'],
]

export const FOREST_NODES = [
  ...WORLDS.map(([id, label, image]) => {
    const project = PROJECTS.find(item => item.id === id)
    return { id, title: project.title, label, image, color: project.color, kind: 'project' }
  }),
  { id: 'journey', title: 'Unice', label: 'The story at the roots', image: '/profile-unice-approved.webp', color: '#d6d9ad', kind: 'journey' },
]
