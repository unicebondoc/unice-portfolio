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

// Scattered layout for mobile: much bigger, no overlap, extend above (full height).
// Order: 0 origin, 1 writer, 2 pressure, 3 reinvention, 4 building, 5 proof, 6 work, 7 becoming, 8 root.
const SCATTERED_MOBILE_POSITIONS = [
  [-2.4, -2.6, 0.1],  // 0 orb-origin — bottom-left
  [2.2, -2.0, 0.3],   // 1 orb-writer — bottom-right
  [-2.6, 0.4, 0.2],   // 2 orb-pressure — mid-left
  [2.4, 1.4, 0.4],    // 3 orb-reinvention — center-right
  [-2.0, 3.0, 0.3],   // 4 orb-building — upper-left
  [2.6, 3.6, 0.2],    // 5 orb-proof — top-right
  [-0.8, 4.8, 0.2],   // 6 orb-work — top center-left
  [1.4, 5.4, 0.1],    // 7 orb-becoming — top-right (extends above)
  [0.0, -3.2, 0],     // 8 orb-root — bottom center
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
      'Before I ever wrote a line of code, I learned how to make meaning land. Communications majored in Broadcastin at Bicol University taught me that words are not decoration. They are structure, rhythm, timing, and feeling. I did not know it then, but I was learning the first architecture of everything I would later build.',
    tags: ['Broadcasting', 'Bicol University', 'Storytelling', 'Philippines'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/01-orb-origin-web.mp4',
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
    scaleMult: 0.95,
    visualTier: 'secondary',
    orbType: 'secondary',
    isPrimary: true,
    description:
      'When the world slowed down, I started writing. Not because I had answers, but because I needed somewhere honest to place the questions. I wrote through grief, love, distance, and becoming. That habit never left. It only changed shape. Now the same voice turns toward technology, AI, and the futures we are quietly building.',
    tags: ['Writing', 'Voice', 'Reflection', '2020'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/02-orb-writer-web.mp4',
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
      'Banking taught me the weight of real responsibility. Four years across BDO Unibank and RCBC. More than one hundred SME accounts. Deadlines that did not soften for anyone. It taught me precision, coordination, restraint, and the kind of composure that only forms under pressure. I still carry that discipline into every build.',
    tags: ['BDO Unibank', 'RCBC', '100+ Accounts', 'Banking', 'Operations'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/03-orb-pressure-web.mp4',
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
      'Some decisions do not just change your life. They reveal it. I left banking, left the Philippines, and arrived in Sydney carrying a Master\'s offer and a version of myself that had not fully been tested yet. It was not bravery in the theatrical sense. It was alignment. The kind that costs something, and is worth it anyway.',
    tags: ['Career Pivot', 'Sydney', 'Master\'s', 'Philippines → Australia'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/04-orb-reinvention-web.mp4',
    videoHint: 'airport, packing, arriving Sydney, harbour bridge, ocean — anything that feels like crossing a threshold',
    isFuture: false,
  },
  // 5 — BUILDING
  {
    id: 'orb-building',
    tier: 'core',
    title: 'Theory Became Real',
    subtitle: 'CONCEPT TO LIVE DEPLOYMENT · ONE WEEK',
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
      'This is the memory I return to when doubt starts performing. A live Shopify business. A real brief. A real deadline. Python, GPT-4, Voiceflow. Scoped, built, tested, and deployed in seven days. Not classroom confidence. Not theory. This was the moment learning crossed the line into delivery.',
    tags: ['Python', 'GPT-4', 'Voiceflow', 'Shopify', 'One Week', 'Solo'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/05-orb-building-web.mp4',
    videoHint: 'screen recording of chatbot, code editor, terminal output — anything that feels like something going live',
    isFuture: false,
  },
  // 6 — PROOF (gold, prominent — second largest)
  {
    id: 'orb-proof',
    tier: 'core',
    title: 'I Earned My Place',
    subtitle: 'LLM RESEARCH · HIGH DISTINCTION · 88/100',
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
    scaleMult: 1.3,
    visualTier: 'hero',
    orbType: 'primary',
    isPrimary: true,
    description:
      'I graduated with a Master of Information and Communications Technology in Web and Mobile Computing from Western Sydney University. My LLM research earned 88/100 with High Distinction, focused on AI-generated content in e-commerce. I moved to a country I had never lived in, stepped into a field I was still learning to claim, and finished with work I could stand behind. That mattered to me more than ease ever could.',
    tags: ['WSU', 'LLM Research', '88/100', 'High Distinction', 'Graduation'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/06-orb-proof-web.mp4',
    videoHint: 'graduation ceremony, walking across stage, WSU — that graduation clip is perfect for this',
    cropPosition: 'center 15%',
    isFuture: false,
  },
  // 7 — THE WORK (Core Memories, no links)
  {
    id: 'orb-work',
    tier: 'core',
    title: 'Core Memories',
    subtitle: 'A PORTFOLIO THAT BECAME A WORLD',
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
      'I did not want a portfolio that behaved like a filing cabinet. I wanted a place. A memory system. A bioluminescent archive of who I have been, what I have built, and what still pulls me forward. React, Three.js, GLSL, OpenAI. Built alone. Shaped with intention. The brief was simple: make them feel something true.',
    tags: ['React 18', 'Three.js', 'GLSL', 'OpenAI API', 'Solo Build'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/07-orb-work-web.mp4',
    videoHint: 'screen recording of this portfolio being built, code, the 3D scene coming to life — or just a beautiful clip of the forest itself',
    isFuture: false,
  },
  // 8 — BECOMING (present — slightly larger)
  {
    id: 'orb-becoming',
    tier: 'core',
    title: 'Still Becoming',
    subtitle: 'THE STORY DOES NOT END HERE',
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
      'I am in my Professional Year in Sydney, continuing to sharpen the technical side of what I can do while building what comes next. Azure AI certifications are in motion. New systems are taking shape. I have crossed countries, industries, and versions of myself already. I know how to begin again. That is one of my strongest skills.',
    tags: ['Professional Year', 'Azure AI', 'Sydney', 'Open to Work', 'AI Engineer'],
    skills: [],
    link: '',
    videoSrc: '/memories/videos/08-orb-becoming-web.mp4',
    videoHint: 'Sydney daily life, studying, laptop at cafe, city at night — anything that feels like right now and what\'s coming',
    isFuture: true,
  },
  // 9 — ROOT (identity — largest, base of tree)
  {
    id: 'orb-root',
    tier: 'root',
    isRoot: true,
    title: 'Unice Bondoc',
    subtitle: 'THE ROOT OF ALL THIS',
    year: 'NOW',
    emotion: 'Pride',
    icon: '🎓',
    category: 'achievement',
    orbPalette: 'warmAmber',
    color: '#d4a853',
    glowColor: '#d4a853',
    image: '/memories/belong.png',
    videoSrc: '/memories/videos/09-orb-root-web.mp4',
    videoHint: 'your best intro clip, portrait, selfie video — this is you',
    labelShort: 'Now · Identity',
    position: [0, -2.5, 0],
    scaleMult: 1.4,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'A builder shaped by communication, pressure, reinvention, and the refusal to stay where I no longer fit. Everything above grows from here: the storyteller, the operator, the researcher, the one who kept going until the work became undeniable.',
    tags: ['Identity', 'Storyteller', 'Builder', 'Researcher'],
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
