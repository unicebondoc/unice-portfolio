/**
 * Core Memories — bioluminescent world data.
 * 8 story orbs + 1 root identity orb = 9 total. First person throughout.
 *
 * Orb palettes: warmCoral (origin), paleViolet (writer, reinvention), warmAmber (pressure, proof, root),
 * softCyan (building, becoming), spiritMint (work).
 */
const ORB_PALETTES = {
  warmAmber:  { fill: 'rgba(212,168,83,0.6)',  glow: '#f0b840', innerLight: '#fff4d6', core: '#ffd700' },
  softCyan:   { fill: 'rgba(103,232,249,0.5)',  glow: '#22d3ee', innerLight: '#e0f7fa', core: '#67e8f9' },
  paleViolet: { fill: 'rgba(196,181,253,0.5)',  glow: '#a78bfa', innerLight: '#ede9fe', core: '#c4b5fd' },
  roseQuartz: { fill: 'rgba(232,160,192,0.45)', glow: '#f472b6', innerLight: '#fce7f3', core: '#fb7eaf' },
  spiritMint: { fill: 'rgba(126,207,160,0.45)', glow: '#34d399', innerLight: '#d1fae5', core: '#6ee7b7' },
  warmCoral:  { fill: 'rgba(220,120,100,0.5)',  glow: '#e07c64', innerLight: '#ffebe8', core: '#f0a090' },
}

const MOBILE_Y_STEP = 1.35
const MOBILE_X_AMP = 1.0

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
  // 1 — ORIGIN
  {
    id: 'orb-origin',
    tier: 'supporting',
    title: 'Creative Foundations',
    subtitle: 'THE FIRST LANGUAGE',
    year: '2012',
    emotion: 'Origin',
    icon: '🎬',
    category: 'origin',
    orbPalette: 'warmCoral',
    color: '#e07c64',
    glowColor: '#e07c64',
    image: '/memories/orb-07.svg',
    labelShort: '2012 · Origin',
    position: [-3.5, -1.5, 0.8],
    visualTier: 'secondary',
    orbType: 'secondary',
    isPrimary: true,
    description:
      'Before I ever wrote a line of code, I learned how to make someone feel something with words alone. Broadcasting at Bicol University, Philippines. The craft of communication — not as decoration, but as architecture. I didn\'t know it then, but I was learning the foundation of everything I would eventually build.',
    tags: ['Broadcasting', 'Bicol University', 'Storytelling', 'Philippines'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb1-origin.mp4',
    videoHint: 'Philippines footage, childhood, Bicol, anything that feels like a beginning',
    isFuture: false,
  },
  // 2 — VOICE (The Writer — intimate, slightly smaller)
  {
    id: 'orb-writer',
    tier: 'supporting',
    title: 'The Writer',
    subtitle: 'FINDING THE SIGNAL',
    year: '2020',
    emotion: 'Voice',
    icon: '✒️',
    category: 'writing',
    orbPalette: 'paleViolet',
    color: '#c4b5fd',
    glowColor: '#c4b5fd',
    image: '/memories/orb-02.svg',
    labelShort: '2020 · Writing',
    position: [3.0, -1.0, -0.5],
    scaleMult: 0.9,
    visualTier: 'secondary',
    orbType: 'secondary',
    isPrimary: true,
    description:
      'In 2020, when the world went still, I started writing. Not because I had answers — because I needed to find them. I wrote about love, grief, and what it means to keep moving when the path disappears. That practice of thinking through writing never left me. Now I\'m turning it toward technology — the ideas, the questions, the things worth saying about what AI is becoming. The voice found its next subject.',
    tags: ['Medium', 'Writing', 'Voice', '2020', 'Human'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb2-writer.mp4',
    videoHint: 'quiet, personal — journaling, coffee, rainy window, anything that feels like inner life and reflection',
    isFuture: false,
  },
  // 3 — PRESSURE
  {
    id: 'orb-pressure',
    tier: 'supporting',
    title: 'Corporate Discipline',
    subtitle: 'FORGED, NOT BROKEN',
    year: '2018',
    emotion: 'Foundation',
    icon: '🏦',
    category: 'operations',
    orbPalette: 'warmAmber',
    color: '#d4a853',
    glowColor: '#d4a853',
    image: '/memories/orb-08.svg',
    labelShort: '2018 · Operations',
    position: [-2.5, 0.5, 1.2],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Four years. Two banks. One hundred accounts, minimum. Deadlines that did not negotiate. Stakeholders who needed to trust you before they\'d listen to you. I learned that real work has weight — that showing up precisely, consistently, under actual pressure, for actual people is a skill most systems never teach. I carry that weight into every project. It keeps the work honest.',
    tags: ['BDO Unibank', 'RCBC', '100+ Accounts', 'Banking', 'Philippines'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb3-pressure.mp4',
    videoHint: 'Manila city, office aesthetic, structured environment, professional setting — anything that feels like discipline and constraint',
    isFuture: false,
  },
  // 4 — REINVENTION
  {
    id: 'orb-reinvention',
    tier: 'core',
    title: 'I Chose Different',
    subtitle: 'THE ONLY HONEST THING LEFT',
    year: '2022',
    emotion: 'Courage',
    icon: '💫',
    category: 'the_leap',
    orbPalette: 'paleViolet',
    color: '#a78bfa',
    glowColor: '#a78bfa',
    image: '/memories/orb-01.svg',
    labelShort: '2022 · The Leap',
    position: [2.5, 0.5, 0.3],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'There are decisions you make and decisions that make you. Leaving banking. Leaving the Philippines. Boarding a plane to Sydney with a Master\'s enrollment and the quiet certainty that this was the only honest thing left to do. Not brave. Not reckless. Just finally — finally — aligned.',
    tags: ['Career Pivot', 'Sydney', 'Master\'s', 'Philippines → Australia'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb4-reinvention.mp4',
    videoHint: 'airport, packing, arriving Sydney, harbour bridge, ocean — anything that feels like crossing a threshold',
    isFuture: false,
  },
  // 5 — BUILDING
  {
    id: 'orb-building',
    tier: 'core',
    title: 'Theory Became Real',
    subtitle: 'CONCEPT TO PRODUCTION · ONE WEEK',
    year: '2024',
    emotion: 'Real Impact',
    icon: '🌱',
    category: 'ai_deployment',
    orbPalette: 'softCyan',
    color: '#67e8f9',
    glowColor: '#67e8f9',
    image: '/memories/orb-04.svg',
    labelShort: '2024 · AI Deployment',
    position: [-3.0, 2.0, -0.6],
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'This is the memory I return to when doubt gets loud. A live Shopify business. A real brief. A real deadline. Python, GPT-4, Voiceflow — built, tested, and deployed in seven days. Not a prototype. Not a proof of concept. Production. Live. Working. The moment learning became doing and doing became identity.',
    tags: ['Python', 'GPT-4', 'Voiceflow', 'Shopify', 'One Week', 'Solo'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb5-building.mp4',
    videoHint: 'screen recording of chatbot, code editor, terminal output — anything that feels like something going live',
    isFuture: false,
  },
  // 6 — PROOF (gold, prominent — second largest)
  {
    id: 'orb-proof',
    tier: 'core',
    title: 'I Earned My Place',
    subtitle: 'HIGH DISTINCTION · 88/100',
    year: '2025',
    emotion: 'Pride',
    icon: '🎓',
    category: 'masters',
    orbPalette: 'warmAmber',
    color: '#f0b840',
    glowColor: '#ffd700',
    image: '/memories/orb-03.svg',
    labelShort: '2025 · Master\'s',
    position: [2.8, 2.2, 0.6],
    scaleMult: 1.2,
    visualTier: 'hero',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Master of Information and Communications Technology — Web and Mobile Computing. Western Sydney University. High Distinction. 88 out of 100. I moved to a country I had never lived in, learned a field I was still finding my footing in, and wrote original research on Large Language Models before the world caught up to the topic. This isn\'t a credential. It\'s evidence. Of what happens when someone refuses to let fear set the ceiling.',
    tags: ['WSU', 'LLM Research', '88/100', 'High Distinction', 'Graduation'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb6-proof.mp4',
    videoHint: 'graduation ceremony, walking across stage, WSU — that graduation clip is perfect for this',
    cropPosition: 'center 30%',
    isFuture: false,
  },
  // 7 — THE WORK (Core Memories, no links)
  {
    id: 'orb-work',
    tier: 'core',
    title: 'Core Memories',
    subtitle: 'THE PROOF OF CONCEPT IS YOU',
    year: '2026',
    emotion: 'Proof',
    icon: '🔮',
    category: 'ai_portfolio',
    orbPalette: 'spiritMint',
    color: '#34d399',
    glowColor: '#34d399',
    image: '/memories/orb-05.svg',
    labelShort: '2026 · AI Portfolio',
    position: [-0.5, 3.2, 1.0],
    visualTier: 'hero',
    orbType: 'primary',
    isPrimary: true,
    description:
      'I wanted to build something that didn\'t feel like a portfolio. Something that felt like a place. Every orb holds a memory. Every particle is intentional. Every shader written by hand. React 18. Three.js. GLSL. OpenAI API. Built alone. Shipped to the world. The brief was simple: make them feel something. You\'re standing inside the answer.',
    tags: ['React 18', 'Three.js', 'GLSL Shaders', 'OpenAI API', 'Solo Build'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb7-work.mp4',
    videoHint: 'screen recording of this portfolio being built, code, the 3D scene coming to life — or just a beautiful clip of the forest itself',
    isFuture: false,
  },
  // 8 — BECOMING (present — slightly larger)
  {
    id: 'orb-becoming',
    tier: 'core',
    title: 'Still Becoming',
    subtitle: 'THE WORK CONTINUES',
    year: '2026',
    emotion: 'Ambition',
    icon: '🚀',
    category: 'present',
    orbPalette: 'softCyan',
    color: '#a5f3fc',
    glowColor: '#a5f3fc',
    image: '/memories/orb-06.svg',
    labelShort: '2026 · Present',
    position: [1.5, 4.0, -0.3],
    scaleMult: 1.1,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'This is not a conclusion. Professional Year in progress. Azure AI certifications in motion. A portfolio that doubles as a declaration. I have crossed oceans, changed industries, and built things that didn\'t exist before I made them. Whatever the next chapter is called — I will have earned it the same way I earn everything: by doing the work, and refusing to stop.',
    tags: ['Professional Year', 'Azure AI', 'Open to Work', 'Sydney', 'AI Engineer'],
    skills: [],
    link: '',
    videoSrc: '/videos/orb8-becoming.mp4',
    videoHint: 'Sydney daily life, studying, laptop at cafe, city at night — anything that feels like right now and what\'s coming',
    isFuture: true,
  },
  // 9 — ROOT (identity — largest, base of tree)
  {
    id: 'orb-root',
    tier: 'root',
    isRoot: true,
    title: 'I Earned My Place',
    subtitle: 'Master\'s Completed',
    year: '2025',
    emotion: 'Pride',
    icon: '🎓',
    category: 'achievement',
    orbPalette: 'warmAmber',
    color: '#d4a853',
    glowColor: '#d4a853',
    image: '/memories/belong.png',
    videoSrc: '/videos/root-identity.mp4',
    videoHint: 'your best intro clip, portrait, selfie video — this is you',
    labelShort: '2025 · Identity',
    position: [0, -2.5, 0],
    scaleMult: 1.4,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Graduated with a Master\'s in ICT from Western Sydney University. Proof of follow-through, fast adaptation, and an industry transition done the hard way.',
    tags: ['WSU', 'Master of ICT', 'Graduation', 'Achievement'],
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
  root: 0.7,
  core: 0.55,
  supporting: 0.55,
}
