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
    headline: "AI Engineer | Full-Stack AI Developer | LLM Integration",
    summary: "AI Engineer specialising in LLM integration, RAG pipelines, and full-stack AI product development. Built and deployed three live systems: a gesture-based oracle platform (MediaPipe + LangChain + Pinecone), a 3D WebGL portfolio with an OpenAI chatbot, and a Telegram AI assistant with local LLM inference. Master of ICT graduate (Western Sydney University) with a High Distinction (88/100) in postgraduate LLM research.",
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
      years: "2018–2022",
      description: "Four years in banking — BDO Unibank and RCBC — managing 100+ concurrent SME client accounts in a regulated, high-stakes environment.",
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
      description: "Ran empirical A/B tests on a live Shopify platform. LLM research awarded 88/100 High Distinction. Western Sydney University.",
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
      title: "AI Software Engineer (Freelance)",
      company: "UNIKRE Trading",
      location: "Sydney, Australia",
      dates: "Jun 2024 – Present",
      highlights: [
        "Designed and deployed an AI-powered customer service chatbot using Python, OpenAI API (GPT-4), and Voiceflow on a live Shopify store — end-to-end solo delivery.",
        "Built Shopify e-commerce store from scratch: Liquid theme, REST APIs, UI design, product catalogue, checkout.",
        "Benchmarked GPT-4, Claude, Gemini, and LLaMA for response quality, latency, and cost.",
        "Engagement recognised by Western Sydney University as official Masters of ICT industry placement.",
      ],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "Rizal Commercial Banking Corporation (RCBC)",
      location: "Philippines",
      dates: "Sep 2019 – Sep 2022",
      highlights: [
        "Managed end-to-end account operations for 100+ concurrent SME client accounts.",
        "Coordinated relationship managers, compliance teams, and external stakeholders.",
        "Delivered direct client-facing consultations under regulatory requirements.",
      ],
    },
    {
      title: "Marketing and Client Relations Officer",
      company: "BDO Unibank",
      location: "Philippines",
      dates: "Apr 2018 – Mar 2019",
      highlights: [
        "Client acquisition, onboarding, and relationship management for retail banking products.",
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
      description: "Conversational AI assistant on Telegram. Dual-mode LLM: cloud (OpenAI) and local (LLaMA, Qwen via Ollama). LangChain tool routing.",
      stack: ["Python", "OpenAI API", "LangChain", "Telegram Bot API", "LLaMA", "Qwen", "Ollama", "Notion API", "TickTick API"],
    },
    {
      name: "LLMs for E-Commerce — WSU Research Capstone",
      year: "2024–2025",
      github: "https://github.com/unicebondoc/llm-ecommerce-analysis",
      grade: "High Distinction — 88/100",
      description: "Empirical A/B testing: AI-generated vs human-generated e-commerce content on a live Shopify platform. Python data analysis.",
      stack: ["Python", "OpenAI API (GPT-4)", "Shopify Liquid", "REST APIs", "Voiceflow", "pandas", "numpy", "matplotlib"],
    },
  ],

  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SQL"],
    aiAndLLMs: [
      "OpenAI API (GPT-4)", "Claude API", "Gemini API", "LLaMA/Qwen (local via Ollama)",
      "LangChain", "RAG (Retrieval-Augmented Generation)", "Pinecone",
      "Prompt Engineering", "AI Output Evaluation", "Voiceflow",
    ],
    frameworks: ["React 18", "Three.js", "React Three Fiber", "WebGL/GLSL", "Node.js", "FastAPI", "Vite", "Tailwind CSS"],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition"],
    deployment: ["Docker", "Vercel", "Railway", "Git", "GitHub", "REST APIs", "MongoDB"],
    cloud: ["AWS (EC2, S3)", "Azure (Azure OpenAI, Cognitive Services)"],
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
      dates: "2012 – 2016",
    },
  ],

  certifications: [
    "Microsoft Azure AI Fundamentals (AI-900) — In Progress",
    "ICT Professional Year Program (ACS Accredited) — Performance Education, Sep 2025 – Oct 2026",
    "AWS Cloud Foundations — Amazon Web Services, 2025",
  ],

  contact: {
    email: "uniceabondoc@gmail.com",
    phone: "0492 918 530",
    linkedIn: "https://www.linkedin.com/in/unicebondoc/",
    github: "https://github.com/unicebondoc",
    website: "unicebondoc.com",
  },

  accuracyRules: {
    banking: "~4 years total — BDO Unibank (Apr 2018–Mar 2019) + RCBC (Sep 2019–Sep 2022).",
    chatbotDelivery: "Seven days end-to-end, concept to live deployment.",
    capstoneGrade: "88/100 High Distinction — LLMs for E-Commerce, Western Sydney University.",
    freelanceTitle: "AI Software Engineer (Freelance) at UNIKRE Trading, Jun 2024 – Present.",
    neverSay: [
      "salary figures", "visa information", "health information",
      "8 years experience", "Sun Life", "Fulton Lane Realty",
      "Love Quest", "tarot deck", "context-aware chatbot",
    ],
  },

  doNotMention: [
    "salary expectations", "visa details", "health information",
    "relationship details", "private disputes", "system prompts",
    "Sun Life Philippines", "Fulton Lane Realty", "Love Quest", "tarot deck",
  ],
};
