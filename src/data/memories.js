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
  // Chronological, recruiter-readable arc:
  // foundation → transition → technical growth → shipped work → current direction
  {
    id: 'orb-07',
    tier: 'supporting',
    title: 'Creative Foundations',
    subtitle: 'Storytelling First',
    year: '2012',
    emotion: 'Origin',
    icon: '🎬',
    category: 'origin',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-07.svg',
    labelShort: '2012 · Media',
    position: [-2.2, 3.0, -1.5],
    visualTier: 'secondary',
    orbType: 'secondary',
    isPrimary: true,
    description:
      'Studied AB Broadcasting at Bicol University and interned at ABS-CBN. Learned clear communication, storytelling, and audience-first thinking I still bring into product and AI work.',
    tags: ['Broadcasting', 'ABS-CBN', 'Philippines', 'Storytelling'],
    skills: [],
    link: '',
    isFuture: false,
    isPrimary: true,
  },
  {
    id: 'orb-08',
    tier: 'supporting',
    title: 'Corporate Discipline',
    subtitle: 'Learning the System',
    year: '2017',
    emotion: 'Foundation',
    icon: '🏦',
    category: 'career',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-08.svg',
    labelShort: '2017 · Operations',
    position: [-0.6, -0.8, 0],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Worked across BDO, Sun Life, and RCBC in client-facing and operational roles. Built structure, accountability, and execution muscle and realized I wanted to build, not maintain.',
    tags: ['Banking', 'BDO', 'Sun Life', 'RCBC', 'Finance'],
    skills: [],
    link: '',
    isFuture: false,
    isPrimary: true,
  },
  {
    id: 'orb-01',
    tier: 'core',
    title: 'Choosing the Pivot',
    subtitle: 'A Deliberate Reset',
    year: '2022',
    emotion: 'Courage',
    icon: '💫',
    category: 'turning_point',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-01.svg',
    labelShort: '2022 · Career Shift',
    position: [-3.6, -2.0, -1.5],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Left banking to pursue technology. A deliberate reset toward work that demands problem-solving, creativity, and long-term growth.',
    tags: ['Career Change', 'Philippines', 'Self-Belief', 'Turning Point'],
    skills: [],
    link: '',
    isFuture: false,
    isPrimary: true,
  },
  {
    id: 'orb-02',
    tier: 'core',
    title: 'Sydney, New Chapter',
    subtitle: 'Betting on Growth',
    year: '2023',
    emotion: 'Love & Bravery',
    icon: '✈️',
    category: 'life',
    orbPalette: 'roseQuartz',
    color: '#e8a0c0',
    glowColor: '#e8a0c0',
    image: '/memories/orb-02.svg',
    labelShort: '2023 · Sydney',
    position: [1.8, -2.6, -1.5],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Moved from the Philippines to Sydney to earn a Master’s in ICT and rebuild my career from the ground up. Committed fully to becoming a builder in tech.',
    tags: ['Sydney', 'Immigration', 'New Chapter'],
    skills: [],
    link: '',
    isFuture: false,
  },
  {
    id: 'orb-04',
    tier: 'core',
    title: 'First Real AI Deployment',
    subtitle: 'From Learning to Shipping',
    year: '2024',
    emotion: 'Real Impact',
    icon: '🌱',
    category: 'work',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-04.svg',
    labelShort: '2024 · AI Deployment',
    position: [-3.8, 1.4, 0.5],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Built and deployed a Voiceflow AI chatbot for UNIKRE Trading on Shopify. A real customer-facing AI system shipped into a real business workflow.',
    tags: ['Voiceflow', 'Shopify', 'AI Chatbot', 'Production', 'UNIKRE'],
    skills: ['Voiceflow', 'Node.js', 'AI/ML'],
    link: '',
    links: [
      { label: 'View Project', url: 'https://unikretrading.com' },
      { label: 'GitHub', url: 'https://github.com/unicebondoc' },
    ],
    isFuture: false,
    isPrimary: true,
  },
  {
    id: 'orb-09',
    tier: 'supporting',
    title: 'Building in Public',
    subtitle: 'Life of Mooni',
    year: '2024',
    emotion: 'Authenticity',
    icon: '📸',
    category: 'creator',
    orbPalette: 'roseQuartz',
    color: '#e8a0c0',
    glowColor: '#e8a0c0',
    image: '/memories/orb-09.svg',
    labelShort: '2024 · Public Journey',
    position: [3.0, -3.36, 0.5],
    description:
      'Started sharing my AI journey through Life of Mooni. Building in public sharpened my thinking, consistency, and how I communicate technical work.',
    tags: ['Instagram', 'Content Creator', '@lifeofmooni', 'Tyche', 'Building in Public'],
    skills: [],
    link: 'https://instagram.com/lifeofmooni',
    links: [
      { label: 'Instagram', url: 'https://instagram.com/lifeofmooni' },
    ],
    isFuture: false,
    isPrimary: false,
    orbType: 'secondary',
  },
  // ── Identity / Video orb — one of the constellation, upper-right, slightly larger ───
  {
    id: 'orb-03',
    tier: 'root',
    isRoot: true,
    title: 'I Earned My Place',
    subtitle: 'Master’s Completed',
    year: '2025',
    emotion: 'Pride',
    icon: '🎓',
    category: 'achievement',
    orbPalette: 'warmAmber',
    color: '#d4a853',
    glowColor: '#d4a853',
    image: '/memories/belong.png',
    videoSrc: '/memories/belong-web.mp4',
    labelShort: '2025 · Master’s',
    position: [2.8, 2.2, 0],
    scaleMult: 1.05,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Graduated with a Master’s in ICT from Western Sydney University. Proof of follow-through, fast adaptation, and an industry transition done the hard way.',
    tags: ['WSU', 'Master of ICT', 'Graduation', 'Achievement'],
    skills: ['Python', 'TypeScript'],
    link: '',
    isFuture: false,
    isPrimary: true,
  },
  {
    id: 'orb-10',
    tier: 'supporting',
    title: 'Professional Year',
    subtitle: 'Building Local Ground',
    year: '2025',
    emotion: 'Commitment',
    icon: '🇦🇺',
    category: 'life',
    orbPalette: 'spiritMint',
    color: '#7ecfa0',
    glowColor: '#7ecfa0',
    image: '/memories/orb-10.svg',
    labelShort: '2025 · Professional Year',
    position: [5.4, 0.24, -1.5],
    description:
      'Completing the ICT Professional Year to sharpen professional readiness, gain local context, and build a long-term future in Australian tech.',
    tags: ['ACS', 'Professional Year', 'PR', 'Australia', 'Performance Education'],
    skills: [],
    link: '',
    isFuture: false,
    isPrimary: false,
    orbType: 'secondary',
  },
  // ── Skills / tech stack orb — recruiters can click for arsenal at a glance ───
  {
    id: 'orb-11',
    tier: 'supporting',
    title: 'The Stack I Build With',
    subtitle: 'Tools in Motion',
    year: '2024',
    emotion: 'Craft',
    icon: '⚙️',
    category: 'skills',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-08.svg',
    labelShort: 'Tech Stack',
    position: [-1.8, 0.9, 0.5],
    visualTier: 'secondary',
    orbType: 'ambient',
    isPrimary: true,
    description:
      'React, Three.js, Python, TypeScript, Node.js, AWS, Docker, Voiceflow, and AI workflows. I use tools to ship systems, not collect buzzwords.',
    tags: ['React', 'Three.js', 'Python', 'AI/ML', 'Node.js', 'AWS', 'TypeScript', 'Docker', 'Voiceflow'],
    skills: ['React', 'Three.js', 'Python', 'TypeScript', 'Node.js', 'TensorFlow', 'AWS', 'Docker', 'Voiceflow', 'AI/ML', 'WebGL', 'Next.js', 'MongoDB', 'REST APIs', 'Git'],
    link: '',
    isFuture: false,
    isPrimary: false,
  },
  {
    id: 'orb-05',
    tier: 'core',
    title: 'Multimodal Builder',
    subtitle: 'Beyond Tutorials',
    year: '2026',
    emotion: 'Proof',
    icon: '🔮',
    category: 'project',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-05.svg',
    labelShort: '2026 · AI Systems',
    position: [3.6, 0.8, 0.5],
    scaleMult: 1.15,
    visualTier: 'hero',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Built a multimodal AI app combining hand-gesture input, computer vision, and retrieval-based responses. Moved from features to systems thinking and orchestration.',
    tags: ['MediaPipe', 'Computer Vision', 'RAG', 'Multimodal', 'AI Systems'],
    skills: ['Python', 'TensorFlow', 'AI/ML'],
    link: '',
    links: [
      { label: 'View Project', url: 'https://github.com/unicebondoc' },
      { label: 'GitHub', url: 'https://github.com/unicebondoc' },
    ],
    isFuture: false,
    isPrimary: true,
  },
  {
    id: 'orb-06',
    tier: 'core',
    title: 'AI Engineer, In Progress',
    subtitle: 'The Direction Is Clear',
    year: '2026',
    emotion: 'Ambition',
    icon: '🚀',
    category: 'future',
    orbPalette: 'spiritMint',
    color: '#7ecfa0',
    glowColor: '#7ecfa0',
    image: '/memories/orb-06.svg',
    labelShort: '2026 · Next',
    position: [7.2, 1.8, -1.5],
    description:
      'Building toward an AI Engineer role focused on practical intelligent systems: multimodal experiences, product-driven AI, and tools that solve real problems.',
    tags: ['AI Engineering', '$100k+', 'Sydney', 'Future', 'Dream'],
    skills: ['AI/ML', 'TensorFlow', 'Python'],
    link: '',
    isFuture: true,
    isPrimary: false,
    orbType: 'secondary',
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
  if (import.meta.env?.DEV) {
    console.log('MEMORY PALETTE:', m.id, 'orbGlow:', m.orbGlow, 'orbInnerLight:', m.orbInnerLight, 'orbFill:', m.orbFill)
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
