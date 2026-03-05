/**
 * Core Memories — bioluminescent world data.
 *
 * Orb colors: 5 forest-native palettes (fill rgba, glow hex, innerLight hex).
 * - warmAmber: pride & achievement
 * - softCyan: skill & growth
 * - paleViolet: reflective & emotional
 * - roseQuartz: love & connection
 * - spiritMint: new beginnings & hope
 */
const ORB_PALETTES = {
  warmAmber:  { fill: 'rgba(212,168,83,0.6)',  glow: '#f0b840', innerLight: '#fff4d6', core: '#ffd700' },
  softCyan:   { fill: 'rgba(103,232,249,0.5)',  glow: '#22d3ee', innerLight: '#e0f7fa', core: '#67e8f9' },
  paleViolet: { fill: 'rgba(196,181,253,0.5)',  glow: '#a78bfa', innerLight: '#ede9fe', core: '#c4b5fd' },
  roseQuartz: { fill: 'rgba(232,160,192,0.45)', glow: '#f472b6', innerLight: '#fce7f3', core: '#fb7eaf' },
  spiritMint: { fill: 'rgba(126,207,160,0.45)', glow: '#34d399', innerLight: '#d1fae5', core: '#6ee7b7' },
}

const MOBILE_Y_STEP = 1.35
const MOBILE_X_AMP = 1.0

/** Precompute mobile positions: cascade down, alternating left/right (serpentine). */
function mobilePositionsForMemories(list) {
  const result = {}
  list.forEach((m, i) => {
    const y = 3.2 - i * MOBILE_Y_STEP
    const x = (i % 2 === 0 ? 1 : -1) * MOBILE_X_AMP
    result[m.id] = [x, y, 0]
  })
  return result
}

export const MEMORIES = [
  // ── Identity / Video orb — one of the constellation, upper-right, slightly larger ───
  {
    id: 'orb-03',
    tier: 'root',
    isRoot: true,
    title: 'I Belong Here',
    subtitle: 'The Proof',
    year: '2025',
    emotion: 'Pride',
    icon: '🎓',
    category: 'achievement',
    orbPalette: 'warmAmber',
    color: '#d4a853',
    glowColor: '#d4a853',
    image: '/memories/belong.png',
    videoSrc: '/memories/belong-web.mp4',
    labelShort: 'UNICE',
    position: [2.64, 2.4, 0],
    scaleMult: 1.0,
    description:
      "Graduated with a Master's in ICT from Western Sydney University. The leap was worth it. I proved it to myself.",
    tags: ['WSU', 'Master of ICT', 'Graduation', 'Achievement'],
    skills: ['Python', 'TypeScript'],
    link: '',
    isFuture: false,
  },
  // ── Core / supporting (scattered constellation) ───────────────────
  {
    id: 'orb-04',
    tier: 'core',
    title: 'AI Came Alive',
    subtitle: 'Real Impact',
    year: '2024',
    emotion: 'Real Impact',
    icon: '🌱',
    category: 'work',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-04.svg',
    labelShort: '2017 · Origins',
    position: [-6.96, 1.2, 0.5],
    description:
      'Built and deployed a real Voiceflow AI chatbot for UNIKRE Trading on Shopify. Real users. Real impact.',
    tags: ['Voiceflow', 'Shopify', 'AI Chatbot', 'Production', 'UNIKRE'],
    skills: ['Voiceflow', 'Node.js', 'AI/ML'],
    link: '',
    links: [
      { label: 'View Project', url: 'https://unikretrading.com' },
      { label: 'GitHub', url: 'https://github.com/unicebondoc' },
    ],
    isFuture: false,
  },
  {
    id: 'orb-07',
    tier: 'supporting',
    title: 'Creative Roots',
    subtitle: 'Where It Started',
    year: '2012',
    emotion: 'Origin',
    icon: '🎬',
    category: 'origin',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-07.svg',
    labelShort: '2019 · Banking',
    position: [-4.8, 3.0, -1.5],
    description:
      "AB Broadcasting at Bicol University. ABS-CBN internship at the Philippines' #1 network. Where storytelling began.",
    tags: ['Broadcasting', 'ABS-CBN', 'Philippines', 'Storytelling'],
    skills: [],
    link: '',
    isFuture: false,
  },
  {
    id: 'orb-01',
    tier: 'core',
    title: 'I Choose Me',
    subtitle: 'The Turning Point',
    year: '2022',
    emotion: 'Courage',
    icon: '💫',
    category: 'turning_point',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-01.svg',
    labelShort: '2021 · The Leap',
    position: [-6.24, -1.2, -1.5],
    description:
      'After years in banking, I chose to bet on myself. Left a stable career in the Philippines to pursue something that actually lit me up.',
    tags: ['Career Change', 'Philippines', 'Self-Belief', 'Turning Point'],
    skills: [],
    link: '',
    isFuture: false,
  },
  {
    id: 'orb-05',
    tier: 'core',
    title: "She's an Engineer",
    subtitle: 'Built Anyway',
    year: '2026',
    emotion: 'Proof',
    icon: '🔮',
    category: 'project',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-05.svg',
    labelShort: '2022 · Sydney Bound',
    position: [-2.64, 0.6, 0.5],
    description:
      'Built a multimodal AI app combining hand gestures, computer vision, and RAG. Nobody told me I could. I just built it anyway.',
    tags: ['MediaPipe', 'Gemini', 'LangChain', 'Pinecone', 'RAG', 'Computer Vision'],
    skills: ['Python', 'TensorFlow', 'AI/ML'],
    link: '',
    links: [
      { label: 'View Project', url: 'https://github.com/unicebondoc' },
      { label: 'GitHub', url: 'https://github.com/unicebondoc' },
    ],
    isFuture: false,
  },
  {
    id: 'orb-02',
    tier: 'core',
    title: 'Crossing the Ocean',
    subtitle: 'The Move',
    year: '2023',
    emotion: 'Love & Bravery',
    icon: '✈️',
    category: 'life',
    orbPalette: 'roseQuartz',
    color: '#e8a0c0',
    glowColor: '#e8a0c0',
    image: '/memories/orb-02.svg',
    labelShort: '2023 · Masters',
    position: [-2.4, -2.64, -1.5],
    description:
      'Packed up my life in the Philippines and moved to Sydney to pursue something bigger. Left comfort for uncertainty.',
    tags: ['Sydney', 'Immigration', 'New Chapter'],
    skills: [],
    link: '',
    isFuture: false,
  },
  {
    id: 'orb-08',
    tier: 'supporting',
    title: 'The Corporate Years',
    subtitle: 'The Foundation',
    year: '2017',
    emotion: 'Foundation',
    icon: '🏦',
    category: 'career',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-08.svg',
    labelShort: '2023 · Building',
    position: [0.96, -1.44, 0],
    description:
      'BDO, Sun Life, RCBC. Years of discipline, client relations, operations. Built character. Knew it was not forever.',
    tags: ['Banking', 'BDO', 'Sun Life', 'RCBC', 'Finance'],
    skills: [],
    link: '',
    isFuture: false,
  },
  {
    id: 'orb-09',
    tier: 'supporting',
    title: 'Life of Mooni',
    subtitle: 'Building in Public',
    year: '2024',
    emotion: 'Authenticity',
    icon: '📸',
    category: 'creator',
    orbPalette: 'roseQuartz',
    color: '#e8a0c0',
    glowColor: '#e8a0c0',
    image: '/memories/orb-09.svg',
    labelShort: '2024 · AI Path',
    position: [3.0, -3.36, 0.5],
    description:
      'Started documenting the AI journey on Instagram. Building in public. Sharing the real story, not just the highlights.',
    tags: ['Instagram', 'Content Creator', '@lifeofmooni', 'Tyche', 'Building in Public'],
    skills: [],
    link: 'https://instagram.com/lifeofmooni',
    links: [
      { label: 'Instagram', url: 'https://instagram.com/lifeofmooni' },
    ],
    isFuture: false,
  },
  {
    id: 'orb-10',
    tier: 'supporting',
    title: 'Professional Year',
    subtitle: 'Planting Roots',
    year: '2025',
    emotion: 'Commitment',
    icon: '🇦🇺',
    category: 'life',
    orbPalette: 'spiritMint',
    color: '#7ecfa0',
    glowColor: '#7ecfa0',
    image: '/memories/orb-10.svg',
    labelShort: '2024 · Projects',
    position: [5.4, 0.24, -1.5],
    description:
      'ICT Professional Year at Performance Education. Working toward permanent residency. Building roots in Australia.',
    tags: ['ACS', 'Professional Year', 'PR', 'Australia', 'Performance Education'],
    skills: [],
    link: '',
    isFuture: false,
  },
  // ── Skills / tech stack orb — recruiters can click for arsenal at a glance ───
  {
    id: 'orb-11',
    tier: 'supporting',
    title: 'The Arsenal',
    subtitle: 'Tools & Technologies',
    year: '2024',
    emotion: 'Craft',
    icon: '⚙️',
    category: 'skills',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-08.svg',
    labelShort: 'Skills',
    position: [-4.2, 0.96, 0.5],
    description:
      'React, Three.js, Python, TensorFlow, Node.js, TypeScript, AWS, Docker, Voiceflow, and a relentless drive to build.',
    tags: ['React', 'Three.js', 'Python', 'AI/ML', 'Node.js', 'AWS', 'TypeScript', 'Docker', 'Voiceflow'],
    skills: ['React', 'Three.js', 'Python', 'TypeScript', 'Node.js', 'TensorFlow', 'AWS', 'Docker', 'Voiceflow', 'AI/ML', 'WebGL', 'Next.js', 'MongoDB', 'REST APIs', 'Git'],
    link: '',
    isFuture: false,
  },
  {
    id: 'orb-06',
    tier: 'core',
    title: "She's Coming",
    subtitle: 'The Dream',
    year: '2026',
    emotion: 'Ambition',
    icon: '🚀',
    category: 'future',
    orbPalette: 'spiritMint',
    color: '#7ecfa0',
    glowColor: '#7ecfa0',
    image: '/memories/orb-06.svg',
    labelShort: '2025 · Now',
    position: [7.2, 1.8, -1.5],
    description:
      "The dream AI Engineer role is close. Building multimodal systems that matter. Sydney's AI scene won't know what hit it.",
    tags: ['AI Engineering', '$100k+', 'Sydney', 'Future', 'Dream'],
    skills: ['AI/ML', 'TensorFlow', 'Python'],
    link: '',
    isFuture: true,
  },
]

// Resolve orb palette to fill/glow/innerLight/core for rendering
MEMORIES.forEach((m) => {
  if (m.orbPalette && ORB_PALETTES[m.orbPalette]) {
    const p = ORB_PALETTES[m.orbPalette]
    m.orbFill = p.fill
    m.orbGlow = p.glow
    m.orbInnerLight = p.innerLight
    m.orbCore = p.core
  } else {
    m.orbFill = ORB_PALETTES.softCyan.fill
    m.orbGlow = m.glowColor || ORB_PALETTES.softCyan.glow
    m.orbInnerLight = ORB_PALETTES.softCyan.innerLight
    m.orbCore = ORB_PALETTES.softCyan.core
  }
})

export const MOBILE_POSITIONS = mobilePositionsForMemories(MEMORIES)
export function getMemoryPosition(memory, isMobile) {
  if (isMobile && MOBILE_POSITIONS[memory.id]) return MOBILE_POSITIONS[memory.id]
  return memory.position
}

export const TIER_RADIUS = {
  root:        0.7,    // Identity/video orb — larger so video is clearly visible
  core:        0.55,
  supporting:  0.55,
}
