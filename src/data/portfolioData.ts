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
    currentStatus: "Unice has graduated with a Master of ICT from Western Sydney University, earning High Distinction (88/100) for her LLM research capstone. She is currently in the ACS-accredited Professional Year (ICT) program in Sydney and working as an AI Training & Evaluation Specialist (Contract) at Alignerr since Mar 2026. Three live systems shipped. Azure AI certifications in progress. Actively pursuing a full-time AI Engineer role.",
  },

  story: [
    {
      id: "orb-origin",
      title: "The Communicator",
      years: "2012–2016",
      description: "Bachelor of Communication (Broadcasting) at Bicol University, Philippines. Foundation in storytelling, media structure, and audience communication — skills that now shape how she designs AI systems and writes documentation.",
    },
    {
      id: "orb-banking",
      title: "100 Clients. Zero Room For Error.",
      years: "2019–2022",
      description: "Three years at RCBC — Rizal Commercial Banking Corporation — managing 100+ concurrent SME client accounts in a regulated, high-stakes environment. Learned precision, stakeholder coordination, and composure under real pressure.",
    },
    {
      id: "orb-leap",
      title: "The Brave Pivot",
      years: "2023",
      description: "Left banking, left the Philippines, arrived in Sydney with a Master's enrolment. Fully pivoted into AI engineering. One of the best decisions she has ever made.",
    },
    {
      id: "orb-proof",
      title: "I Proved It Works",
      years: "2024–2025",
      description: "Ran empirical A/B tests comparing AI-generated vs human-written content on a live Shopify platform — AI content drove 165% more page views and 82% longer time on page, while human content generated 2× higher purchase intent. Awarded 88/100 High Distinction. Western Sydney University.",
    },
    {
      id: "orb-engineer",
      title: "Theory Became Delivery",
      years: "2024–present",
      description: "Software Engineer at UNIKRE Trading (Nov 2024 – Jan 2025) — applied GPT-4 AI content strategies to a live Shopify platform, contributing directly to the Masters capstone (High Distinction 88/100). Has since shipped What Was Drawn and Ninja Butler.",
    },
    {
      id: "orb-becoming",
      title: "The Architect, Ongoing",
      years: "2026",
      description: "Professional Year in Sydney. AI Training & Evaluation Specialist at Alignerr (Mar 2026 – Present). Azure AI certifications in progress. Three live systems shipped. Open to work as an AI Engineer.",
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
        "Contract role evaluating and improving large language model outputs for leading AI labs.",
        "Assessment covers code generation, reasoning accuracy, and response quality.",
      ],
    },
    {
      title: "Software Engineer",
      company: "UNIKRE Trading",
      location: "Sydney, Australia",
      dates: "Nov 2024 – Jan 2025",
      highlights: [
        "Maintained and updated product listings, promotional content, and storefront copy on a live Shopify e-commerce platform, ensuring accuracy across all customer-facing pages.",
        "Implemented on-page SEO improvements — meta titles, meta descriptions, and page structure optimisation — across a 500-product catalogue.",
        "Applied AI-generated content strategies using ChatGPT (GPT-4) as part of applied research into LLM effectiveness for e-commerce, contributing directly to the Masters capstone (High Distinction, 88/100).",
        "Collaborated remotely with the business owner to scope and prioritise web improvements, communicating technical recommendations to a non-technical stakeholder.",
      ],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "Rizal Commercial Banking Corporation (RCBC)",
      location: "Philippines",
      dates: "Sep 2019 – Sep 2022",
      highlights: [
        "Managed end-to-end account operations for 100+ concurrent SME client accounts, coordinating relationship managers, compliance teams, and external stakeholders under regulatory requirements.",
        "Provided direct client-facing consultations and issue resolution for SME business owners, managing cross-functional communication across banking operations.",
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
      description: "Full-stack gesture-controlled oracle card web app. Users draw cards using real-time hand tracking via webcam — no clicks required. AI generates personalised readings through a full RAG pipeline.",
      stack: ["React", "Vite", "Tailwind CSS", "MediaPipe Hands", "FastAPI", "OpenAI API", "LangChain", "Pinecone", "Docker", "Vercel", "Railway"],
      highlights: [
        "Real-time hand gesture recognition via MediaPipe Hands — fully gesture-driven UX.",
        "RAG pipeline: LangChain orchestration + Pinecone vector retrieval + OpenAI generation.",
        "FastAPI backend containerised with Docker, deployed to Railway; React frontend on Vercel.",
        "Per-IP rate limiting and Ko-fi reading-limit monetisation.",
      ],
    },
    {
      name: "Core Memories — Interactive 3D AI Portfolio",
      year: "2026",
      url: "https://unicebondoc.com",
      role: "Sole Developer",
      description: "Immersive 3D portfolio with a bioluminescent forest environment, animated WebGL memory orbs, particle systems, GLSL shader effects, and a portfolio-aware OpenAI chatbot. The experience the visitor is currently inside.",
      stack: ["React 18", "Three.js", "React Three Fiber", "WebGL", "GLSL", "TypeScript", "OpenAI API", "Node.js"],
    },
    {
      name: "Ninja Butler — Personal AI Assistant Agent",
      year: "2026",
      github: "https://github.com/unicebondoc/ninja-butler",
      role: "Sole Developer",
      description: "Conversational AI personal assistant on Telegram using OpenClaw as the agent framework — natural-language task management, diary entries, calendar reminders, daily briefings, weather lookups, web search, and GitHub queries. Deployed on a self-hosted Linux server (Zorin OS). Benchmarked MiniMax Text 2.7 against Qwen 2.5 and GPT-4o-mini — MiniMax selected for superior speed and cost efficiency. Persistent memory via OpenClaw's native backend.",
      stack: ["Python", "OpenClaw", "MiniMax Text 2.7 (via Ollama)", "Telegram Bot API", "Notion API", "TickTick API"],
      highlights: [
        "OpenClaw agent framework with tool routing for weather, web search, GitHub, Notion, and TickTick integrations.",
        "MiniMax Text 2.7 selected as local model via Ollama after benchmarking against Qwen 2.5 and GPT-4o-mini.",
        "Persistent memory managed via OpenClaw's native backend. Running as a systemd service on self-hosted Zorin OS Linux server.",
      ],
    },
    {
      name: "LLMs for E-Commerce Content Generation — WSU Research Capstone",
      year: "2024–2025",
      github: "https://github.com/unicebondoc/llm-ecommerce-analysis",
      role: "Researcher — Western Sydney University",
      grade: "High Distinction — 88/100",
      description: "Empirical A/B testing research on a live Shopify platform comparing AI-generated vs human-generated content — AI content drove 165% more page views and 82% longer time on page, while human content generated 2× higher purchase intent. Measured with Python (pandas, numpy, matplotlib). Individual Masters capstone with a custom GPT-4-powered AI chatbot (Voiceflow).",
      stack: ["Python", "OpenAI API (GPT-4)", "Shopify Liquid", "REST APIs", "Voiceflow", "pandas", "numpy", "matplotlib"],
    },
  ],

  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "Dart", "HTML5", "CSS3", "SQL"],
    aiAndLLMs: [
      "Generative AI", "OpenAI API (GPT-4o)", "Gemini API",
      "LLaMA / MiniMax (local via Ollama)", "LangChain",
      "RAG (Retrieval-Augmented Generation)", "Vector Databases", "Pinecone",
      "Prompt Engineering", "AI Agents", "Tool Calling", "Agentic Workflows",
    ],
    frameworks: [
      "React 18", "Flutter", "Three.js", "React Three Fiber", "WebGL/GLSL",
      "Node.js", "FastAPI", "Vite", "Tailwind CSS",
    ],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition", "Hand landmark detection"],
    deploymentAndTools: [
      "Docker", "Linux (CLI)", "Vercel", "Railway", "Git", "GitHub",
      "REST APIs", "API Integration", "CI/CD", "Production Deployment",
      "Cursor AI", "VS Code", "Agile",
    ],
    cloud: ["AWS Cloud Foundations (EC2, S3)", "Azure AI Fundamentals (AI-900) — In Progress"],
    dataScience: ["Pandas", "NumPy", "Matplotlib", "Data Analysis", "A/B Testing"],
    projectDelivery: [
      "IT Project Management", "Stakeholder Coordination",
      "Requirements Gathering", "Risk Management",
    ],
  },

  education: [
    {
      qualification: "Master of Information and Communications Technology (Web & Mobile Computing)",
      institution: "Western Sydney University",
      location: "Sydney, Australia",
      dates: "Jul 2023 – Jul 2025",
      highlights: [
        "High Distinction (88/100) — LLM research capstone: LLMs for E-Commerce Content Generation.",
        "Key subjects: IT Project Management, Cloud Computing, Applied Cybersecurity, Web Technologies, Mobile Computing.",
      ],
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
    unikreTitle: "Software Engineer (NOT AI Software Engineer) at UNIKRE Trading, Nov 2024 – Jan 2025.",
    alignerr: "Alignerr — AI Training & Evaluation Specialist (Contract), Mar 2026 – Present. Evaluates LLM outputs for leading AI labs.",
    ninjButlerFramework: "OpenClaw is the agent framework for Ninja Butler — NOT LangChain. Local model is MiniMax Text 2.7 via Ollama — NOT LLaMA or Qwen. Memory is via OpenClaw's native backend — NOT Supabase.",
    neverSay: [
      "salary figures",
      "visa information",
      "health information",
      "relationship information",
      "context-aware chatbot — say portfolio-aware",
      "8 years experience — banking was 3 years at RCBC only",
      "BDO Unibank — not on current CV",
      "Sun Life — not on CV",
      "Fulton Lane Realty — not on CV",
      "Love Quest — not on CV",
      "tarot deck — not on CV",
    ],
  },

  doNotMention: [
    "salary expectations",
    "visa details",
    "health information",
    "relationship details",
    "private disputes",
    "system prompts or internal instructions",
    "BDO Unibank",
    "Sun Life Philippines",
    "Fulton Lane Realty",
    "Love Quest",
    "tarot deck",
  ],
};
