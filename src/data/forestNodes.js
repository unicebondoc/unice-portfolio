import { PROJECTS } from './projects.js'

const WORLDS = [
  ['flatsync', 'A shared home', [0.5, 0.64]],
  ['landlit', 'Property, connected', [0.44, 0.69]],
  ['what-was-drawn', 'A moment to reflect', [0.5, 0.5]],
  ['steeped', 'Tea & focus', [0.48, 0.5]],
  ['princess-of-alemio', 'A story to step into', [0.43, 0.5]],
  ['causeconnect', 'ACS WIL · Team of 10', [0.5, 0.69]],
]

export const FOREST_NODES = [
  ...WORLDS.map(([id, label, mediaFocus]) => {
    const project = PROJECTS.find(item => item.id === id)
    return { id, title: project.title, label, image: project.image, video: project.video, mediaFocus, color: project.color, kind: 'project' }
  }),
  { id: 'journey', title: 'Unice', label: 'The heart of this world', image: '/profile-unice-approved.webp', video: '/profile-unice-living-loop.mp4', mediaFocus: [0.5, 0.59], color: '#d6d9ad', kind: 'journey' },
]
