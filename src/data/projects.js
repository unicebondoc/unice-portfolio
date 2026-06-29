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
      'Draw oracle cards using real-time hand gestures via webcam — no buttons, no taps, just your hands. AI generates personalised readings through a full RAG pipeline. Tap-based mobile fallback for devices without camera access. Live as a web app, with a native iOS app submitted to the Apple App Store (in final review).',
    stack: ['React', 'Vite', 'Tailwind CSS', 'MediaPipe Hands', 'FastAPI', 'OpenAI API', 'LangChain', 'Pinecone', 'Docker', 'Vercel', 'Railway', 'iOS'],
    links: { live: 'https://whatwasdrawn.com', github: 'https://github.com/unicebondoc/whatwasdrawn' },
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.75)',
    glowSoft: 'rgba(255,215,0,0.25)',
    flagship: true,
  },
  {
    id: 'ninja-butler',
    title: 'Ninja Butler',
    subtitle: 'Personal AI Assistant Agent',
    description:
      'A conversational AI personal assistant on Telegram, built on the Hermes agent framework (migrated from OpenClaw). Manages tasks, calendar, diary, briefings, weather, web search, and GitHub queries. Uses the OpenAI API and MiniMax for language generation. Persistent memory via the agent framework\'s native backend. Self-hosted on Linux (Zorin OS) at $0/month, running via systemd since March 2026.',
    stack: ['Python', 'Hermes', 'OpenAI API', 'MiniMax', 'Telegram Bot API', 'Notion API', 'TickTick API'],
    links: { live: null, github: 'https://github.com/unicebondoc/ninja-butler' },
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.75)',
    glowSoft: 'rgba(167,139,250,0.2)',
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
