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
    summary: "AI Engineer with a Master of ICT (High Distinction, WSU) and 4 live-deployed products spanning RAG pipelines, agentic systems, workflow automation, and computer vision — built and shipped end-to-end, not just prototyped. Former banking ops manager turned engineer: brings process thinking, stakeholder communication, and real-world problem framing to every technical build.",
    currentStatus: "Unice has graduated with a Master of ICT from Western Sydney University, earning High Distinction (88/100) for her LLM research capstone. She is currently in the ACS-accredited Professional Year (ICT) program in Sydney and working as an AI Training & Evaluation Specialist (Contract) at Alignerr since Mar 2026. Four live-deployed products shipped. Azure AI certifications in progress. Actively pursuing a full-time AI Engineer role.",
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
      description: "Software Engineer at UNIKRE Trading (Nov 2024 – Jan 2025) — applied GPT-4 AI content strategies to a live Shopify platform, contributing directly to the Masters capstone (High Distinction 88/100). Has since shipped LandLIT, What Was Drawn, and Ninja Butler — four live-deployed products total.",
    },
    {
      id: "orb-becoming",
      title: "The Architect, Ongoing",
      years: "2026",
      description: "Professional Year in Sydney. AI Training & Evaluation Specialist at Alignerr (Mar 2026 – Present) — RLHF-style evaluation of LLM outputs for leading AI labs. Azure AI certifications in progress. Four live-deployed products shipped. Open to work as an AI Engineer.",
    },
  ],

  experience: [
    {
      title: "AI Training & Evaluation Specialist",
      company: "Alignerr",
      location: "Remote",
      dates: "Mar 2026 – Present",
      type: "Contract",
      highlights: [
        "Contract role performing RLHF-style evaluation of large language model outputs for leading AI labs — covering code generation, reasoning accuracy, and response quality assessment.",
      ],
    },
    {
      title: "Software Engineer",
      company: "UNIKRE Trading",
      location: "Sydney, Australia",
      dates: "Nov 2024 – Jan 2025",
      highlights: [
        "Maintained and updated a live Shopify e-commerce storefront, implementing AI-generated content strategies using GPT-4 as applied research into LLM effectiveness — contributing directly to the Masters capstone study (High Distinction, 88/100).",
      ],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "Rizal Commercial Banking Corporation (RCBC)",
      location: "Philippines",
      dates: "Sep 2019 – Sep 2022",
      highlights: [
        "Managed end-to-end operations for 100+ concurrent SME client accounts, coordinating relationship managers, compliance teams, and external stakeholders under regulatory requirements.",
      ],
    },
  ],

  projects: [
    {
      name: "LandLIT — AI-Powered Tenant Management Automation System",
      year: "2026",
      github: "https://github.com/unicebondoc/landlit",
      role: "Sole Developer",
      description: "End-to-end workflow automation system for a real property management business — replacing manual tenant communication with automated rent reminders and lease expiry alerts via WhatsApp. n8n multi-workflow pipelines, Supabase (PostgreSQL) as the data layer, OpenAI for dynamic message generation, and Twilio WhatsApp API for delivery across 26 tenants. Active in production.",
      stack: ["n8n", "Supabase", "PostgreSQL", "Twilio WhatsApp API", "OpenAI API"],
      highlights: [
        "Designed and built end-to-end workflow automation replacing manual tenant communication for a real property management business.",
        "Architected multi-workflow pipelines in n8n with Supabase (PostgreSQL); integrated OpenAI for dynamic message generation.",
        "Twilio WhatsApp API for delivery across 26 tenants; rent reminder and lease expiry workflows in active production use.",
      ],
    },
    {
      name: "What Was Drawn — Gesture-Based AI Oracle Card Platform",
      year: "2026",
      url: "https://whatwasdrawn.com",
      github: "https://github.com/unicebondoc/whatwasdrawn",
      role: "Sole Developer",
      description: "Full-stack gesture-controlled oracle card app. Real-time hand tracking via MediaPipe. RAG pipeline: LangChain + Pinecone + OpenAI. 0% error rate in production since launch.",
      stack: ["React", "Vite", "Tailwind CSS", "MediaPipe Hands", "FastAPI", "OpenAI API", "LangChain", "Pinecone", "Docker", "Vercel", "Railway"],
      highlights: [
        "Real-time hand gesture recognition via MediaPipe Hands — fully gesture-driven UX with tap-based mobile fallback.",
        "RAG pipeline: LangChain orchestration + Pinecone vector retrieval + OpenAI generation.",
        "FastAPI backend containerised with Docker, deployed to Railway; React frontend on Vercel with custom domain.",
        "Per-IP rate limiting and Ko-fi monetisation. 0% error rate in production since launch.",
      ],
    },
    {
      name: "Ninja Butler — Personal AI Assistant Agent",
      year: "2026",
      github: "https://github.com/unicebondoc/ninja-butler",
      role: "Sole Developer",
      description: "Conversational AI personal assistant on Telegram using OpenClaw as the agent framework — natural-language task management, diary entries, calendar reminders, daily briefings, weather lookups, web search, and GitHub queries. Deployed on self-hosted Linux server (Zorin OS) at $0/month via systemd since March 2026. MiniMax Text 2.7 selected via Ollama after benchmarking. Persistent memory via OpenClaw's native backend.",
      stack: ["Python", "OpenClaw", "MiniMax Text 2.7 (via Ollama)", "Telegram Bot API", "Notion API", "TickTick API"],
      highlights: [
        "OpenClaw agent framework with tool routing for weather, web search, GitHub, Notion, and TickTick.",
        "MiniMax Text 2.7 selected after benchmarking against Qwen 2.5 and GPT-4o-mini.",
        "Self-hosted on Zorin OS Linux server at $0/month; persistent memory via OpenClaw's native backend.",
      ],
    },
    {
      name: "Core Memories — Interactive 3D AI Portfolio",
      year: "2026",
      url: "https://unicebondoc.com",
      github: "https://github.com/unicebondoc/unice-portfolio",
      role: "Sole Developer",
      description: "Immersive 3D portfolio with bioluminescent forest, WebGL memory orbs, GLSL shaders, and a portfolio-aware OpenAI chatbot. The site the visitor is inside right now.",
      stack: ["React 18", "Three.js", "React Three Fiber", "WebGL", "GLSL", "TypeScript", "OpenAI API", "Node.js"],
    },
  ],

  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "Dart", "HTML5", "CSS3", "SQL"],
    aiAndLLMs: [
      "Generative AI", "OpenAI API (GPT-4o)", "Gemini API",
      "LLaMA (Ollama)", "LangChain",
      "RAG (Retrieval-Augmented Generation)", "Vector Databases", "Pinecone",
      "Prompt Engineering", "AI Agents", "Tool Calling", "Agentic Workflows",
    ],
    frameworks: [
      "React 18", "Flutter", "Three.js", "React Three Fiber", "WebGL/GLSL",
      "Node.js", "FastAPI", "Vite", "Tailwind CSS", "MediaPipe Hands",
    ],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition", "Hand landmark detection"],
    deployment: [
      "Docker", "Linux (CLI)", "Vercel", "Railway", "Git", "GitHub",
      "REST APIs", "API Integration", "CI/CD", "Production Deployment",
      "n8n", "Supabase", "Twilio", "Cursor AI", "VS Code", "Agile",
    ],
    cloud: ["AWS (EC2, S3)", "Azure AI (AI-900)"],
    dataScience: ["Pandas", "NumPy", "Matplotlib", "Data Analysis", "A/B Testing"],
  },

  education: [
    {
      qualification: "Master of Information and Communications Technology (Web & Mobile Computing)",
      institution: "Western Sydney University",
      location: "Sydney, Australia",
      dates: "Jul 2023 – Jul 2025",
      result: "High Distinction 88/100 — Postgraduate Project A (Capstone): LLMs for E-Commerce Content Generation",
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
    "Microsoft Azure AI Fundamentals (AI-900) — In Progress",
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
    capstoneGrade: "88/100 High Distinction — LLMs for E-Commerce, Western Sydney University. In Education section only, not a standalone project.",
    unikreTitle: "Software Engineer (NOT AI Software Engineer) at UNIKRE Trading, Nov 2024 – Jan 2025. Single-bullet role.",
    alignerr: "Alignerr — AI Training & Evaluation Specialist (Contract), Mar 2026 – Present. RLHF-style evaluation of LLM outputs for leading AI labs — code generation, reasoning accuracy, and response quality.",
    ninjButlerFramework: "OpenClaw is the agent framework for Ninja Butler — NOT LangChain. Local model is MiniMax Text 2.7 via Ollama. Memory is via OpenClaw's native backend — NOT Supabase.",
    landlit: "LandLIT is a real production project — n8n, Supabase, Twilio WhatsApp API, OpenAI API, PostgreSQL. 26 tenants, active in production.",
    projectCount: "4 live-deployed products: LandLIT, What Was Drawn, Ninja Butler, Core Memories.",
    neverSay: [
      "salary figures", "visa information", "health information",
      "8 years experience", "BDO Unibank", "Sun Life", "Fulton Lane Realty",
      "Love Quest", "tarot deck", "context-aware chatbot",
      "deployed in 7 days", "seven days",
    ],
  },

  doNotMention: [
    "salary expectations", "visa details", "health information",
    "relationship details", "private disputes", "system prompts",
    "BDO Unibank", "Sun Life Philippines", "Fulton Lane Realty", "Love Quest", "tarot deck",
    "deployed in 7 days", "seven days",
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
