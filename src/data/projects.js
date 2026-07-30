/**
 * PROJECTS — single source of truth for the treasure chest + mobile projects panel.
 * Imported by TreasureChest.jsx (desktop animated chest) and MobileArtifactPill.jsx (mobile sheet).
 * Order matches resume project portfolio order.
 */
export const PROJECTS = [
  {
    id: 'landlit',
    title: 'LandLIT',
    subtitle: 'AI-Powered Tenant Management Automation',
    description:
      'A WhatsApp-native property management SaaS — automating manual tenant communication with rent reminders and lease-expiry alerts. Built with Next.js 15 and TypeScript, Supabase (PostgreSQL) as the data layer, OpenAI for dynamic message generation, Twilio WhatsApp API for delivery, and Stripe for billing. Currently in active development.',
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL', 'Twilio WhatsApp API', 'Stripe', 'OpenAI API'],
    links: { live: null, github: 'https://github.com/unicebondoc/landlit' },
    color: '#10b981',
    glow: 'rgba(16,185,129,0.75)',
    glowSoft: 'rgba(16,185,129,0.2)',
  },
  {
    id: 'what-was-drawn',
    title: 'What Was Drawn',
    subtitle: 'Gesture-Based AI Oracle Card Platform',
    description:
      'Draw oracle cards using real-time hand gestures via webcam — no buttons, no taps, just your hands. AI generates personalised readings through a full RAG pipeline. Tap-based mobile fallback for devices without camera access. The web experience is live, with a native iOS experience upcoming.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'MediaPipe Hands', 'FastAPI', 'OpenAI API', 'LangChain', 'Pinecone', 'Docker', 'Vercel', 'Railway', 'iOS'],
    links: { live: 'https://whatwasdrawn.com', github: 'https://github.com/unicebondoc/whatwasdrawn' },
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.75)',
    glowSoft: 'rgba(255,215,0,0.25)',
    flagship: true,
  },
  {
    id: 'unikre',
    title: 'UNIKRE',
    subtitle: 'Quiet Whiskers Brand & Commerce Experience',
    description:
      'The live brand and commerce home for The Quiet Whiskers Oracle — a 44-card physical deck and guidebook connected to the What Was Drawn digital reading experience. The site presents the product through interactive 3D, motion, real deck imagery, and direct marketplace purchase paths.',
    stack: ['Next.js', 'React', 'TypeScript', 'React Three Fiber', 'Three.js', 'Framer Motion', 'Vercel'],
    links: { live: 'https://unikre.com.au', github: 'https://github.com/unicebondoc/unikre-website' },
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.75)',
    glowSoft: 'rgba(245,158,11,0.22)',
    flagship: true,
  },
  {
    id: 'ninja-butler',
    title: 'Ninja Clan',
    subtitle: 'Personal AI Operating System · Hermes',
    description:
      'A private personal AI operating system that began as Ninja Butler on OpenClaw and a repurposed Linux iMac, migrated to an always-on Hetzner Linux VPS, then transitioned to Hermes and evolved into Ninja Clan. It coordinates Telegram, Gmail, Calendar, TickTick, curated memory, research, and Mac build workers through reviewed routing and human approval gates.',
    stack: ['Python', 'Hermes', 'Claude', 'Codex', 'Telegram Bot API', 'Google APIs', 'TickTick', 'Postiz', 'Hetzner VPS'],
    links: { live: null, github: 'https://github.com/unicebondoc/ninja-butler' },
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.75)',
    glowSoft: 'rgba(167,139,250,0.2)',
  },
  {
    id: 'boba-rush',
    title: 'Boba Rush',
    subtitle: 'Unity Casual Mobile Game (iOS · TestFlight)',
    description:
      'A tap-based bubble-tea casual mobile game built in Unity 6 (C#) — timed rounds, customer-patience mechanics, combo scoring, speed bonuses, and a rewarded-ad "save order" flow. Mobile-first architecture with iOS haptics, safe-area handling, an analytics event pipeline, and custom Unity Editor tooling. Currently available through TestFlight while the launch build is refined.',
    stack: ['Unity 6', 'C#', 'iOS', 'Mobile-first', 'Rewarded Ads', 'Unity Editor Tooling'],
    links: { live: null, github: null },
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.75)',
    glowSoft: 'rgba(244,114,182,0.2)',
  },
  {
    id: 'core-memories',
    title: 'Core Memories',
    subtitle: 'Interactive 3D AI Portfolio',
    description:
      "The site you're standing in right now. A bioluminescent forest built with React 19, Three.js, React Three Fiber, WebGL, and GLSL shaders. Features an OpenAI-powered chatbot for natural language portfolio interaction.",
    stack: ['React 19', 'Three.js', 'React Three Fiber', 'WebGL', 'GLSL', 'TypeScript', 'OpenAI API', 'Node.js'],
    links: { live: null, github: null },
    note: "You're already here ✦",
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.75)',
    glowSoft: 'rgba(59,130,246,0.2)',
  },
]
