/**
 * PROJECTS — single source of truth for the treasure chest + mobile projects panel.
 * Imported by TreasureChest.jsx (desktop animated chest) and MobileArtifactPill.jsx (mobile sheet).
 */
export const PROJECTS = [
  {
    id: 'what-was-drawn',
    title: 'What Was Drawn',
    subtitle: 'Gesture-Based AI Oracle Card Platform',
    description:
      'Draw oracle cards using real-time hand gestures via webcam — no buttons, no taps, just your hands. AI generates personalised readings through a full RAG pipeline. Tap-based mobile fallback for devices without camera access.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'MediaPipe Hands', 'FastAPI', 'OpenAI API', 'LangChain', 'Pinecone', 'Docker', 'Vercel', 'Railway'],
    links: { live: 'https://whatwasdrawn.com', github: 'https://github.com/unicebondoc/whatwasdrawn' },
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.75)',
    glowSoft: 'rgba(255,215,0,0.25)',
    flagship: true,
  },
  {
    id: 'core-memories',
    title: 'Core Memories',
    subtitle: 'Interactive 3D AI Portfolio',
    description:
      "The site you're standing in right now. A bioluminescent forest built with React 18, Three.js, React Three Fiber, WebGL, and GLSL shaders. Features an OpenAI-powered chatbot for natural language portfolio interaction.",
    stack: ['React 18', 'Three.js', 'React Three Fiber', 'WebGL', 'GLSL', 'TypeScript', 'OpenAI API', 'Node.js'],
    links: { live: null, github: null },
    note: "You're already here ✦",
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.75)',
    glowSoft: 'rgba(59,130,246,0.2)',
  },
  {
    id: 'ninja-butler',
    title: 'Ninja Butler',
    subtitle: 'Personal AI Assistant Agent',
    description:
      'A conversational AI personal assistant on Telegram using OpenClaw as the agent framework. Manages tasks, calendar, diary, briefings, weather, web search, and GitHub queries. Benchmarked MiniMax Text 2.7 against Qwen 2.5 and GPT-4o-mini — MiniMax selected for speed and cost efficiency. Persistent memory via OpenClaw\'s native backend. Self-hosted on Linux (Zorin OS) as a systemd service.',
    stack: ['Python', 'OpenClaw', 'MiniMax Text 2.7 (via Ollama)', 'Telegram Bot API', 'Notion API', 'TickTick API'],
    links: { live: null, github: 'https://github.com/unicebondoc/ninja-butler' },
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.75)',
    glowSoft: 'rgba(167,139,250,0.2)',
  },
  {
    id: 'llm-research',
    title: 'LLMs for E-Commerce',
    subtitle: 'WSU Research — High Distinction 88/100',
    description:
      'Masters capstone at Western Sydney University. A/B testing comparing AI-generated vs human-generated content on a live Shopify platform — AI content drove 165% more page views and 82% longer time on page, while human content generated 2× higher purchase intent.',
    stack: ['Python', 'OpenAI API (GPT-4)', 'Shopify Liquid', 'REST APIs', 'Voiceflow', 'pandas', 'numpy', 'matplotlib'],
    links: { live: null, github: 'https://github.com/unicebondoc/llm-ecommerce-analysis' },
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.75)',
    glowSoft: 'rgba(239,68,68,0.2)',
  },
]
