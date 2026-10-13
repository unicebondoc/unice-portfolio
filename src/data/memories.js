/**
 * Core Memories — career and personal journey orbs.
 * 5 story chapters + 1 current identity chapter = 6 total.
 * Colors: red, yellow/gold, purple, blue — user-specified palette.
 * Each orb is a chapter in the story a hiring manager needs to hear.
 */
const ORB_PALETTES = {
  // User-specified: yellow, blue, purple, red
  vividRed:    { fill: 'rgba(220,60,60,0.52)',   glow: '#ef4444', innerLight: '#fde8e8', core: '#f87171' },
  heroGold:    { fill: 'rgba(255,215,0,0.58)',   glow: '#ffd700', innerLight: '#fffde7', core: '#fde047' },
  warmAmber:   { fill: 'rgba(212,168,83,0.55)',  glow: '#f0b840', innerLight: '#fff4d6', core: '#fcd34d' },
  electricBlue:{ fill: 'rgba(59,130,246,0.50)',  glow: '#3b82f6', innerLight: '#eff6ff', core: '#60a5fa' },
  deepPurple:  { fill: 'rgba(139,92,246,0.52)',  glow: '#8b5cf6', innerLight: '#f5f3ff', core: '#a78bfa' },
  softPurple:  { fill: 'rgba(196,181,253,0.48)', glow: '#a78bfa', innerLight: '#ede9fe', core: '#c4b5fd' },
}

// Legacy mobile scattered positions — 5 story chapters + root
const SCATTERED_MOBILE_POSITIONS = [
  [-2.4, -2.6, 0.1],  // 0 orb-origin
  [2.2,  -2.0, 0.3],  // 1 orb-banking
  [-2.6,  0.4, 0.2],  // 2 orb-leap
  [2.4,   1.6, 0.4],  // 3 orb-proof  (hero — larger)
  [-2.0,  3.2, 0.3],  // 4 orb-engineer
  [0.0,  -3.2, 0],    // 5 orb-root
]

function mobilePositionsForMemories(list) {
  const result = {}
  list.forEach((m, i) => {
    const pos = SCATTERED_MOBILE_POSITIONS[i % SCATTERED_MOBILE_POSITIONS.length]
    result[m.id] = pos
  })
  return result
}

export const MEMORIES = [
  // ─── 1. ORIGIN — RED ────────────────────────────────────────────────────
  {
    id: 'orb-origin',
    tier: 'supporting',
    title: 'Before the Code, There Was Story',
    subtitle: 'BICOL · BROADCASTING · 2012–2016',
    year: '2012',
    emotion: 'Origin',
    icon: '🎬',
    category: 'origin',
    orbPalette: 'vividRed',
    color: '#f87171',
    glowColor: '#ef4444',
    image: '/memories/orb-07.svg',
    labelShort: '2012 · Origin',
    position: [-3.5, -1.5, 0.8],
    visualTier: 'secondary',
    orbType: 'secondary',
    isPrimary: true,
    description: "I started in story. A Bachelor of Communication in Broadcasting at Bicol University taught me to think about audiences, structure information and make a message clear. Those habits now shape how I approach software interfaces, project documentation and interactive work.",
    tags: ['Broadcasting', 'Bicol University', 'Philippines', 'Storytelling', 'Communication'],
    skills: [],
    link: '',
    imageSrc: '/memories/bachelors-graduation-cutout.webp',
    imageAlt: 'Photographic cutout of Unice in her graduation cap and gown holding her Bicol University graduation folder',
    imageCaption: 'Bachelor of Communication in Broadcasting · Bicol University · Graduation photograph',
    isFuture: false,
  },

  // ─── 2. BANKING — YELLOW/AMBER ──────────────────────────────────────────
  {
    id: 'orb-banking',
    tier: 'supporting',
    title: "People, Process and Precision",
    subtitle: 'BANKING INDUSTRY · OPERATIONS · 2019–2022',
    year: '2019',
    emotion: 'Foundation',
    icon: '🏦',
    category: 'operations',
    orbPalette: 'warmAmber',
    color: '#fcd34d',
    glowColor: '#f0b840',
    image: '/memories/orb-08.svg',
    labelShort: '2019 · Operations',
    position: [3.0, -1.0, -0.5],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description: "From 2019 to 2022, I worked in banking operations, coordinating documentation, compliance requirements and stakeholders. It taught me how small gaps in a process can create work for everyone around it. That experience now informs how I approach systems and workflows.",
    tags: ["Banking Industry", "Operations", "Documentation", "Philippines", "Stakeholder Coordination"],
    skills: [],
    link: '',
    imageSrc: '/memories/banking-operations-cutout.webp',
    imageAlt: 'Photographic cutout of Unice in her navy banking uniform with yellow trim, holding a blue Next teller please sign',
    imageCaption: 'Photograph from my banking career',
    isFuture: false,
  },

  // ─── 3. THE LEAP — PURPLE ───────────────────────────────────────────────
  {
    id: 'orb-leap',
    tier: 'core',
    title: 'One Ticket. No Safety Net.',
    subtitle: 'MANILA → SYDNEY · MASTER\'S ENROLMENT · 2023',
    year: '2023',
    emotion: 'Courage',
    icon: '💫',
    category: 'the_leap',
    orbPalette: 'deepPurple',
    color: '#a78bfa',
    glowColor: '#8b5cf6',
    image: '/memories/orb-01.svg',
    labelShort: '2023 · The Leap',
    position: [-2.5, 0.8, 1.2],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description: "In 2023, I moved from the Philippines to Sydney to study a Master of Information and Communications Technology at Western Sydney University. It was a change in direction that connected my experience in communication and banking with a growing interest in software.",
    tags: ['Career Pivot', 'Philippines → Australia', 'Sydney', 'Master\'s Enrolment', 'WSU'],
    skills: [],
    link: '',
    imageSrc: '/memories/leap-sydney-harbour.webp',
    imageAlt: 'Unice seated by Sydney Harbour holding a camera, with the Harbour Bridge and city skyline across the water',
    imageCaption: 'Sydney Harbour · Personal photograph',
    isFuture: false,
  },

  // ─── 4. PROOF — GOLD HERO ───────────────────────────────────────────────
  {
    id: 'orb-proof',
    tier: 'core',
    title: "Learning to Test the Idea",
    subtitle: 'LLM RESEARCH · WSU CAPSTONE · 2025',
    year: '2025',
    emotion: 'Pride',
    icon: '🎓',
    category: 'masters',
    orbPalette: 'heroGold',
    color: '#fde047',
    glowColor: '#ffd700',
    image: '/memories/orb-03.svg',
    labelShort: '2025 · Research',
    position: [2.8, 2.0, 0.6],
    scaleMult: 1.3,
    visualTier: 'hero',
    orbType: 'primary',
    isPrimary: true,
    description:
      'My Master of ICT capstone compared AI-generated and human-written content in a commerce setting. I worked with Python and data analysis to examine the difference between engaging content and useful outcomes. It shaped a habit I bring to every build: test the result, not just the idea.',
    tags: ['WSU', 'Master of ICT', 'LLM Research', 'A/B Testing', 'Python', 'Shopify', 'pandas', 'numpy', 'matplotlib'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/research-graduation-full.mp4',
    videoPoster: '/memories/posters/research-graduation-full.webp',
    videoCaption: 'Full graduation walk · Original ceremony sound',
    videoHasAudio: true,
    videoAspectRatio: '1894 / 1230',
    isFuture: false,
  },

  // ─── 5. AI ENGINEER — BLUE ──────────────────────────────────────────────
  {
    id: 'orb-engineer',
    tier: 'core',
    title: "From Ideas to Working Flows",
    subtitle: "WHAT WAS DRAWN · FLATSYNC · LANDLIT",
    year: "2026",
    emotion: 'Real Impact',
    icon: '🛠️',
    category: 'ai_deployment',
    orbPalette: 'electricBlue',
    color: '#60a5fa',
    glowColor: '#3b82f6',
    image: '/memories/orb-04.svg',
    labelShort: "2026 · Projects",
    position: [-0.5, 3.0, 1.0],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description: "These projects turn ideas into applications, connected workflows and interactive worlds. Each preview opens a case with my contribution, its current stage and the evidence behind it.",
    tags: ["Applications", "Interactive Products", "Systems", "Testing", "Product Direction"],
    skills: [],
    link: '',
    workMedia: 'projects',
    isFuture: false,
  },

  // ─── ROOT — IDENTITY (bottom centre) ────────────────────────────────────
  {
    id: 'orb-root',
    tier: 'root',
    isRoot: true,
    title: 'Unice Bondoc',
    subtitle: "SOFTWARE DEVELOPER · AUTOMATION · SYDNEY",
    year: 'NOW',
    emotion: 'Identity',
    icon: '✦',
    category: 'identity',
    orbPalette: 'warmAmber',
    color: '#f0b840',
    glowColor: '#d4a853',
    image: '/memories/belong.png',
    workMedia: 'now',
    labelShort: 'Now · Unice',
    position: [0, -0.8, 0],
    scaleMult: 1.4,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description: "Alongside my product and team work, I am completing the ACS-accredited Professional Year in Sydney. My focus is software development, AI automation and systems implementation.",
    tags: ["Software Development", "AI Automation", "Systems Implementation", "Professional Year", "Sydney"],
    skills: [],
    link: '',
    isFuture: false,
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
    m.orbFill = ORB_PALETTES.electricBlue.fill
    m.orbGlow = m.glowColor || ORB_PALETTES.electricBlue.glow
    m.orbInnerLight = ORB_PALETTES.electricBlue.innerLight
    m.orbCore = ORB_PALETTES.electricBlue.core
  }
  if (import.meta.env?.DEV) {
    console.log('MEMORY PALETTE:', m.id, 'orbGlow:', m.orbGlow, 'orbInnerLight:', m.orbInnerLight)
  }
})

export const MOBILE_POSITIONS = mobilePositionsForMemories(MEMORIES)
export function getMemoryPosition(memory, isMobile) {
  if (isMobile && MOBILE_POSITIONS[memory.id]) return MOBILE_POSITIONS[memory.id]
  return memory.position
}

export const TIER_RADIUS = {
  root: 0.7,
  core: 0.55,
  supporting: 0.55,
}
