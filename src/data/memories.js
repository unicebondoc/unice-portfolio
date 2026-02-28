/**
 * Core Memories — portfolio data
 * Each memory is a glowing orb in the 3D scene.
 *
 * emotion drives the orb's base color/glow.
 * position is the resting [x, y, z] in world space.
 */

export const MEMORIES = [
  {
    id: 'orb-01',
    title: 'Project Alpha',
    subtitle: 'Full-Stack Web Application',
    emotion: 'curiosity',       // maps to --orb-curiosity (#00d4ff)
    color: '#00d4ff',
    glowColor: '#00d4ff',
    position: [-3.5, 0, 0],
    description:
      'A placeholder for your first featured project. This orb pulses with curiosity — the drive to learn and build something entirely new.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    link: '#',
    year: '2024',
  },
  {
    id: 'orb-02',
    title: 'Project Beta',
    subtitle: 'Interactive Experience',
    emotion: 'joy',
    color: '#ffd700',
    glowColor: '#ffaa00',
    position: [0, 0.5, 0],
    description:
      'A placeholder for your second featured project. Gold with joy — the pure delight of shipping something people love.',
    tags: ['Three.js', 'WebGL', 'GSAP'],
    link: '#',
    year: '2024',
  },
  {
    id: 'orb-03',
    title: 'Project Gamma',
    subtitle: 'Design System',
    emotion: 'wonder',
    color: '#ff6eb4',
    glowColor: '#ff6eb4',
    position: [3.5, 0, 0],
    description:
      'A placeholder for your third featured project. Pink with wonder — the awe of crafting something beautiful from scratch.',
    tags: ['Figma', 'Storybook', 'CSS'],
    link: '#',
    year: '2023',
  },
]

export const EMOTION_COLORS = {
  joy:       '#ffd700',
  sadness:   '#4a90d9',
  anger:     '#e84545',
  fear:      '#9b59b6',
  disgust:   '#2ecc71',
  curiosity: '#00d4ff',
  wonder:    '#ff6eb4',
}
