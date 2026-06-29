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
    description:
      'I didn\'t start in tech. I started in story. A Bachelor of Communication in Broadcasting from Bicol University taught me something most engineers never pick up: how to make meaning land. Strip the noise. Know what your audience needs before they know it. Make it land. That skill doesn\'t appear on a compiler. But it shows up in every system I\'ve designed since.',
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
    subtitle: 'RCBC · OPERATIONS · 2019–2022',
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
    description:
      'Three years inside Rizal Commercial Banking Corporation — managing 100+ concurrent SME client accounts across compliance deadlines, regulatory demands, and real clients with real stakes. You don\'t get to be sloppy in banking. Mistakes cascade. I developed a kind of precision and stakeholder fluency that tech jobs rarely demand at that intensity. I brought every bit of it into AI engineering.',
    tags: ['RCBC', '100+ SME Accounts', 'Banking Operations', 'Philippines', 'Stakeholder Management'],
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
    description:
      'I walked away from a stable banking career, left the Philippines, and arrived in Sydney with a Master\'s offer and precisely nothing else figured out. It wasn\'t recklessness — it was the clearest decision I\'ve ever made. I knew what I was capable of. I just needed the context that matched it. Sydney gave me that. The rest I built myself.',
    tags: ['Career Pivot', 'Philippines → Australia', 'Sydney', 'Master\'s Enrolment', 'WSU'],
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
    title: 'The Data Agreed With Me',
    subtitle: 'HIGH DISTINCTION 88/100 · WSU CAPSTONE · 2025',
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
      'My Masters capstone was a live experiment, not a classroom exercise. I ran A/B tests on a real Shopify platform — AI-generated content versus human-written content, measured properly with Python, pandas, numpy, matplotlib. The numbers: AI drove 165% more page views and 82% longer time on page. Human content pulled 2× higher purchase intent. I published the finding. Western Sydney University awarded it 88 out of 100. High Distinction.',
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
    title: 'AI in the Wild',
    subtitle: 'WHAT WAS DRAWN · NINJA BUTLER · LANDLIT · BOBA RUSH',
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
      'A real Shopify business. A real brief. As Software Engineer at UNIKRE Trading, I applied GPT-4 AI content strategies to a live commercial platform — work that fed straight into my Masters capstone and helped earn 88/100. That was the foundation. Then What Was Drawn: gesture-controlled AI, full RAG pipeline, live on the web and submitted to the App Store. Then Ninja Butler: a self-hosted multi-agent personal OS. LandLIT: WhatsApp-native PropTech automation. And Boba Rush: a Unity mobile game. I ship as a sole trader — web, agents, and games — without a net. The only kind that counts.',
    tags: ['GPT-4', 'OpenAI API', 'What Was Drawn', 'Ninja Butler', 'LandLIT', 'Boba Rush', 'Unity', 'RAG', 'AI Agent', 'Solo Delivery'],
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
    title: 'Still Building. Still Shipping.',
    subtitle: 'SOLE TRADER · PROFESSIONAL YEAR · 2026',
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
      'Professional Year in Sydney, building independently as a registered sole trader — shipping AI, web, and mobile products end-to-end. Alongside it, RLHF-style evaluation of LLM outputs for leading AI labs at Alignerr: real quality bars, real feedback loops. Products out in the world and more in flight — RAG apps, multi-agent systems, PropTech automation, a Unity game. I don\'t wait to be ready. The next chapter is a full-time AI engineering role where the stack is real, the problem is hard, and the team actually cares what they\'re building. That team hasn\'t found me yet.',
    tags: ['Sole Trader', 'Professional Year', 'ACS Accredited', 'Alignerr', 'Open to Work', 'AI Engineer', 'Sydney', '2026'],
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
    subtitle: 'AI ENGINEER · MOBILE & GAME DEV · FROM MANILA TO SYDNEY',
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
    position: [0, -0.8, 0],
    scaleMult: 1.4,
    visualTier: 'primary',
    orbType: 'primary',
    isPrimary: true,
    description:
      'Started in story. Sharpened in banking. Proved it in research. Shipped it in production. The communicator who became an operator. The operator who became a researcher. The researcher who became an engineer. Every orb in this forest is a chapter — and this one is the root they all grew from. The work is real. The stack is live. The builder is still becoming.',
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
