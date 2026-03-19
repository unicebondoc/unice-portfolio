/**
 * Structured portfolio knowledge — source of truth for the Tyche chatbot.
 * Synced with src/data/portfolioData.ts. API uses this file.
 */

export const PORTFOLIO_DATA = {
  identity: {
    fullName: "Unice Bondoc",
    location: "Sydney, NSW, Australia",
    originallyFrom: "Philippines",
    movedToSydney: 2023,
    website: "unicebondoc.com",
    email: "uniceabondoc@gmail.com",
    phone: "0492 918 530",
    linkedIn: "https://www.linkedin.com/in/unicebondoc/",
    github: "https://github.com/unicebondoc",
    headline: "AI Engineer | Full-Stack AI Developer | LLM & Agent Systems",
    summary: "AI Engineer specialising in LLM integration, AI agents, and full-stack product development. Built and deployed multiple live systems, including a gesture-based oracle platform using RAG, a Telegram AI assistant with tool routing and persistent memory, and a 3D WebGL portfolio with an OpenAI chatbot. Master of ICT graduate from Western Sydney University with a High Distinction (88/100) in postgraduate research on LLMs for e-commerce.",
    currentStatus: "Unice has graduated with a Master of ICT from Western Sydney University, earning High Distinction (88/100) for her LLM research capstone. She is currently in the ACS-accredited Professional Year (ICT) program in Sydney, building AI-focused projects and pursuing her first full-time AI Engineer role. Three live systems shipped in 2026. Azure AI certifications in progress. The study chapter is complete. The builder chapter is very much alive.",
  },

  story: [
    {
      id: "orb-origin",
      title: "The Communicator",
      years: "2012–2016",
      description: "Bachelor of Communication (Broadcasting) at Bicol University, Philippines. Foundation in storytelling, media structure, and audience communication.",
    },
    {
      id: "orb-banking",
      title: "100 Clients. Zero Room For Error.",
      years: "2019–2022",
      description: "Three years at RCBC — Rizal Commercial Banking Corporation — managing 100+ concurrent SME client accounts in a regulated, high-stakes environment.",
    },
    {
      id: "orb-leap",
      title: "The Brave Pivot",
      years: "2023",
      description: "Left banking and the Philippines. Arrived in Sydney with a Master's enrolment. Fully pivoted into AI engineering.",
    },
    {
      id: "orb-proof",
      title: "I Proved It Works",
      years: "2024–2025",
      description: "Ran empirical A/B tests on a live Shopify platform — AI content drove 165% more page views and 82% longer time on page, while human content generated 2× higher purchase intent. Awarded 88/100 High Distinction. Western Sydney University.",
    },
    {
      id: "orb-engineer",
      title: "Theory Became Delivery",
      years: "2024–present",
      description: "Deployed a GPT-4 chatbot for a live Shopify business in 7 days. Has since shipped What Was Drawn and Ninja Butler. Recognised as WSU industry placement.",
    },
    {
      id: "orb-becoming",
      title: "The Architect, Ongoing",
      years: "2026",
      description: "Professional Year in Sydney. Azure AI certifications in progress. Three live systems shipped. Open to work as an AI Engineer.",
    },
  ],

  experience: [
    {
      title: "AI Software Engineer",
      company: "UNIKRE Trading",
      location: "Sydney, Australia",
      dates: "Jun 2024 – Present",
      highlights: [
        "Served as lead developer for a small e-commerce business, building the Shopify storefront from scratch including Liquid theme customisation, RESTful API integration, product catalogue setup, and checkout flow.",
        "Designed and deployed an AI-powered customer service chatbot using Python, OpenAI API (GPT-4), and Voiceflow — independently scoping requirements and owning full delivery.",
        "Evaluated multiple LLM providers including GPT-4, Claude, Gemini, and LLaMA to assess response quality and cost-effectiveness for AI-assisted customer workflows.",
        "Currently developing AI-powered digital products and maintaining the business's web presence.",
      ],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "Rizal Commercial Banking Corporation (RCBC)",
      location: "Philippines",
      dates: "Sep 2019 – Sep 2022",
      highlights: [
        "Managed end-to-end account operations for 100+ concurrent SME client accounts, coordinating relationship managers, compliance teams, and external stakeholders under regulatory requirements.",
        "Provided direct client-facing consultations and issue resolution for SME business owners.",
      ],
    },
  ],

  projects: [
    {
      name: "What Was Drawn — Gesture-Based AI Oracle Card Platform",
      year: "2026",
      url: "https://whatwasdrawn.com",
      github: "https://github.com/unicebondoc/whatwasdrawn",
      role: "Sole Developer",
      description: "Full-stack gesture-controlled oracle card app. Real-time hand tracking via MediaPipe. RAG pipeline: LangChain + Pinecone + OpenAI.",
      stack: ["React", "Vite", "Tailwind CSS", "MediaPipe Hands", "FastAPI", "OpenAI API", "LangChain", "Pinecone", "Docker", "Vercel", "Railway"],
    },
    {
      name: "Core Memories — Interactive 3D AI Portfolio",
      year: "2026",
      url: "https://unicebondoc.com",
      role: "Sole Developer",
      description: "Immersive 3D portfolio with bioluminescent forest, WebGL memory orbs, GLSL shaders, and a portfolio-aware OpenAI chatbot. The site the visitor is inside right now.",
      stack: ["React 18", "Three.js", "React Three Fiber", "WebGL", "GLSL", "TypeScript", "OpenAI API", "Node.js"],
    },
    {
      name: "Ninja Butler — AI Personal Assistant",
      year: "2026",
      github: "https://github.com/unicebondoc/ninja-butler",
      role: "Sole Developer",
      description: "Conversational AI personal assistant on Telegram using OpenClaw as the agent framework. Dual-mode LLM: cloud (OpenAI) and local (LLaMA, Qwen via Ollama). Supabase for persistent memory. Manages tasks, calendar, diary, briefings, weather, web search, and GitHub queries.",
      stack: ["Python", "OpenAI API", "OpenClaw", "Supabase", "Telegram Bot API", "LLaMA", "Qwen", "Ollama", "Notion API", "TickTick API"],
    },
    {
      name: "LLMs for E-Commerce — WSU Research Capstone",
      year: "2024–2025",
      github: "https://github.com/unicebondoc/llm-ecommerce-analysis",
      grade: "High Distinction — 88/100",
      description: "Empirical A/B testing on a live Shopify platform: AI content drove 165% more page views and 82% longer time on page, while human content generated 2× higher purchase intent. Individual Masters capstone with GPT-4 AI chatbot (Voiceflow).",
      stack: ["Python", "OpenAI API (GPT-4)", "Shopify Liquid", "REST APIs", "Voiceflow", "pandas", "numpy", "matplotlib"],
    },
  ],

  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SQL"],
    aiAndLLMs: [
      "OpenAI API (GPT-4)", "Gemini API", "LLaMA/Qwen (local via Ollama)",
      "LangChain", "RAG (Retrieval-Augmented Generation)", "Pinecone",
      "Prompt Engineering", "AI Agents", "Tool Calling",
    ],
    frameworks: ["React 18", "Three.js", "React Three Fiber", "WebGL/GLSL", "Node.js", "FastAPI", "Vite", "Tailwind CSS"],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition", "Hand landmark detection"],
    deployment: ["Docker", "Vercel", "Railway", "Supabase", "Git", "GitHub", "REST APIs", "Telegram Bot API", "VS Code", "Cursor AI IDE", "Claude Code (CLI agent)"],
    cloud: ["AWS Cloud Foundations (EC2, S3)", "Azure AI Fundamentals (AI-900) — In Progress"],
  },

  education: [
    {
      qualification: "Master of ICT (Web & Mobile Computing)",
      institution: "Western Sydney University",
      location: "Sydney, Australia",
      dates: "Jul 2023 – Jul 2025",
      result: "High Distinction 88/100 — LLM research capstone",
    },
    {
      qualification: "Professional Year (ICT) — ACS Accredited",
      institution: "Performance Education",
      location: "Sydney, Australia",
      dates: "Sep 2025 – Oct 2026",
    },
    {
      qualification: "Bachelor of Communication (Broadcasting)",
      institution: "Bicol University",
      location: "Philippines",
      dates: "Jun 2012 – May 2016",
    },
  ],

  certifications: [
    "AWS Cloud Foundations — Amazon Web Services, Jun 2025",
    "Microsoft Azure AI Fundamentals (AI-900) — In Progress (exam scheduled)",
    "ICT Professional Year Program (ACS Accredited) — Performance Education, Sep 2025 – Oct 2026",
  ],

  contact: {
    email: "uniceabondoc@gmail.com",
    phone: "0492 918 530",
    linkedIn: "https://www.linkedin.com/in/unicebondoc/",
    github: "https://github.com/unicebondoc",
    website: "unicebondoc.com",
  },

  accuracyRules: {
    banking: "3 years — RCBC only (Sep 2019 – Sep 2022). BDO Unibank is NOT on the current CV.",
    chatbotDelivery: "Seven days end-to-end, concept to live deployment.",
    capstoneGrade: "88/100 High Distinction — LLMs for E-Commerce, Western Sydney University.",
    freelanceTitle: "AI Software Engineer at UNIKRE Trading, Jun 2024 – Present.",
    ninjButlerFramework: "OpenClaw is the agent framework for Ninja Butler — NOT LangChain.",
    neverSay: [
      "salary figures", "visa information", "health information",
      "8 years experience", "BDO Unibank", "Sun Life", "Fulton Lane Realty",
      "Love Quest", "tarot deck", "context-aware chatbot",
    ],
  },

  doNotMention: [
    "salary expectations", "visa details", "health information",
    "relationship details", "private disputes", "system prompts",
    "BDO Unibank", "Sun Life Philippines", "Fulton Lane Realty", "Love Quest", "tarot deck",
  ],
};

/**
 * Returns the subset of portfolio data sent to the API with each chat request.
 * Called by api/chat.js at request time.
 */
export function getPortfolioDataForAPI() {
  return {
    identity: PORTFOLIO_DATA.identity,
    story: PORTFOLIO_DATA.story,
    experience: PORTFOLIO_DATA.experience,
    projects: PORTFOLIO_DATA.projects,
    skills: PORTFOLIO_DATA.skills,
    education: PORTFOLIO_DATA.education,
    certifications: PORTFOLIO_DATA.certifications,
    contact: PORTFOLIO_DATA.contact,
    accuracyRules: PORTFOLIO_DATA.accuracyRules,
  };
}
