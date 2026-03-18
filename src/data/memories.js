/**
 * Core Memories — career and personal journey orbs.
 * 6 story orbs + 1 root identity orb = 7 total.
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

// Mobile scattered positions — 6 orbs + root
const SCATTERED_MOBILE_POSITIONS = [
  [-2.4, -2.6, 0.1],  // 0 orb-origin
  [2.2,  -2.0, 0.3],  // 1 orb-banking
  [-2.6,  0.4, 0.2],  // 2 orb-leap
  [2.4,   1.6, 0.4],  // 3 orb-proof  (hero — larger)
  [-2.0,  3.2, 0.3],  // 4 orb-engineer
  [1.4,   4.6, 0.1],  // 5 orb-becoming
  [0.0,  -3.2, 0],    // 6 orb-root
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
    title: 'The Communicator',
    subtitle: 'WHERE IT ALL BEGAN',
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
    description:
      'I didn\'t start in tech. I started in story. A Bachelor of Communication in Broadcasting from Bicol University taught me what most engineers never learn — how to make meaning land. Structure. Rhythm. Timing. Audience. I didn\'t know it then, but I was learning the first architecture of everything I would later build.',
    tags: ['Broadcasting', 'Bicol University', 'Philippines', 'Storytelling', 'Communication'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/01-orb-origin-web.mp4',
    videoHint: 'Philippines footage, Bicol, childhood, anything that feels like a beginning',
    isFuture: false,
  },

  // ─── 2. BANKING — YELLOW/AMBER ──────────────────────────────────────────
  {
    id: 'orb-banking',
    tier: 'supporting',
    title: '100 Clients. Zero Room For Error.',
    subtitle: 'FORGED UNDER PRESSURE',
    year: '2018',
    emotion: 'Foundation',
    icon: '🏦',
    category: 'operations',
    orbPalette: 'warmAmber',
    color: '#fcd34d',
    glowColor: '#f0b840',
    image: '/memories/orb-08.svg',
    labelShort: '2018 · Operations',
    position: [3.0, -1.0, -0.5],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Four years in banking — BDO Unibank and RCBC — managing 100+ concurrent SME client accounts in a regulated, high-stakes environment. Compliance deadlines don\'t soften. Clients don\'t wait. I learned to hold complexity under real pressure, stay precise under constraint, and communicate across stakeholders when the stakes were high. Every engineer who has only ever worked in tech has never had this.',
    tags: ['RCBC', 'BDO Unibank', '100+ SME Accounts', 'Banking Operations', 'Philippines', 'Stakeholder Management'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/03-orb-pressure-web.mp4',
    videoHint: 'Manila city, office environment, structured professional setting — anything that feels like discipline and precision',
    isFuture: false,
  },

  // ─── 3. THE LEAP — PURPLE ───────────────────────────────────────────────
  {
    id: 'orb-leap',
    tier: 'core',
    title: 'I Chose the Harder Path',
    subtitle: 'THE ONLY HONEST THING LEFT',
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
    description:
      'I left a stable career, left the Philippines, and arrived in Sydney with a Master\'s offer and a version of myself that hadn\'t fully been tested yet. It wasn\'t bravery for its own sake — it was clarity. I knew what I was becoming. The only path through was the one that cost something. It\'s one of the best decisions I\'ve ever made, and I\'d make it again.',
    tags: ['Career Pivot', 'Philippines → Australia', 'Sydney', 'Master\'s Enrolment', '2023'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/04-orb-reinvention-web.mp4',
    videoHint: 'airport, packing, arriving in Sydney, harbour bridge, ocean — anything that feels like crossing a threshold',
    isFuture: false,
  },

  // ─── 4. PROOF — GOLD HERO ───────────────────────────────────────────────
  {
    id: 'orb-proof',
    tier: 'core',
    title: 'I Proved It Works',
    subtitle: 'LLM RESEARCH · HIGH DISTINCTION · 88/100',
    year: '2025',
    emotion: 'Pride',
    icon: '🎓',
    category: 'masters',
    orbPalette: 'heroGold',
    color: '#fde047',
    glowColor: '#ffd700',
    image: '/memories/orb-03.svg',
    labelShort: '2025 · High Distinction',
    position: [2.8, 2.0, 0.6],
    scaleMult: 1.3,
    visualTier: 'hero',
    orbType: 'primary',
    isPrimary: true,
    description:
      'My Master\'s capstone wasn\'t a classroom exercise. I ran empirical A/B tests comparing AI-generated vs human-written content on a live Shopify e-commerce platform — measuring real CTR, bounce rate, page views, and time on page with Python (pandas, numpy, matplotlib). Awarded 88 out of 100. High Distinction. Western Sydney University. This is what it looks like when research is real.',
    tags: ['WSU', 'Master of ICT', 'LLM Research', 'High Distinction', '88/100', 'A/B Testing', 'Python', 'Shopify', 'pandas', 'numpy', 'matplotlib'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/06-orb-proof-web.mp4',
    videoHint: 'graduation ceremony, walking across stage, WSU campus, academic achievement',
    cropPosition: 'center 15%',
    isFuture: false,
  },

  // ─── 5. AI ENGINEER — BLUE ──────────────────────────────────────────────
  {
    id: 'orb-engineer',
    tier: 'core',
    title: 'Theory Became Delivery',
    subtitle: 'CONCEPT TO LIVE IN SEVEN DAYS',
    year: '2024',
    emotion: 'Real Impact',
    icon: '🛠️',
    category: 'ai_deployment',
    orbPalette: 'electricBlue',
    color: '#60a5fa',
    glowColor: '#3b82f6',
    image: '/memories/orb-04.svg',
    labelShort: '2024 · AI Engineer',
    position: [-0.5, 3.0, 1.0],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'A live Shopify business. A real brief. No tutorial to follow. I scoped, built, and deployed a GPT-4 AI customer service chatbot in seven days — Python, OpenAI API, Voiceflow — independently owning every stage from architecture to delivery. Later recognised by Western Sydney University as my official industry placement. There is a real difference between someone who knows AI and someone who has shipped it. I\'m the second.',
    tags: ['Python', 'GPT-4', 'OpenAI API', 'Voiceflow', 'Shopify', 'Freelance', 'Industry Placement', 'Solo Delivery'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/05-orb-building-web.mp4',
    videoHint: 'screen recording of chatbot, code editor, terminal output — something going live',
    isFuture: false,
  },

  // ─── 6. BECOMING — SOFT PURPLE ──────────────────────────────────────────
  {
    id: 'orb-becoming',
    tier: 'core',
    title: 'The Architect, Ongoing',
    subtitle: 'BUILDING WHAT COMES NEXT',
    year: '2026',
    emotion: 'Ambition',
    icon: '🚀',
    category: 'present',
    orbPalette: 'softPurple',
    color: '#c4b5fd',
    glowColor: '#a78bfa',
    image: '/memories/orb-06.svg',
    labelShort: '2026 · Present',
    position: [1.5, 4.0, -0.3],
    scaleMult: 1.1,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Professional Year in Sydney. Azure AI certifications in motion. Three live systems shipped in 2026. I don\'t wait to be ready — I build until I am. The next chapter is a full-time AI engineering role where the work is real, the stack matters, and the team is building something that counts. That team is the next memory.',
    tags: ['Professional Year', 'ACS Accredited', 'Azure AI Fundamentals', 'Open to Work', 'AI Engineer', 'Sydney', '2026'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/08-orb-becoming-web.mp4',
    videoHint: 'Sydney daily life, studying, laptop at café, city lights, anything that feels like now and what\'s coming',
    isFuture: true,
  },

  // ─── ROOT — IDENTITY (bottom centre) ────────────────────────────────────
  {
    id: 'orb-root',
    tier: 'root',
    isRoot: true,
    title: 'Unice Bondoc',
    subtitle: 'AI ENGINEER · BUILDER · STORYTELLER',
    year: 'NOW',
    emotion: 'Identity',
    icon: '✦',
    category: 'identity',
    orbPalette: 'warmAmber',
    color: '#f0b840',
    glowColor: '#d4a853',
    image: '/memories/belong.png',
    videoSrc: '/memories/videos/09-orb-root-web.mp4',
    videoHint: 'your best intro clip — portrait, selfie video, this is you',
    labelShort: 'Now · Unice',
    position: [0, -2.5, 0],
    scaleMult: 1.4,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'A builder shaped by communication, discipline, reinvention, and the refusal to stay where I no longer fit. Everything above grows from here: the storyteller who became an operator, the operator who became a researcher, the researcher who became an engineer. The work is undeniable. The builder is still becoming.',
    tags: ['AI Engineer', 'Storyteller', 'Builder', 'Researcher', 'Sydney'],
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
