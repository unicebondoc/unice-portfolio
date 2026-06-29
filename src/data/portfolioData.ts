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
      description: "WhatsApp-native property management SaaS — automating manual tenant communication with rent reminders and lease-expiry alerts. Built with Next.js 15 and TypeScript, Supabase (PostgreSQL) as the data layer, OpenAI for dynamic message generation, Twilio WhatsApp API for delivery, and Stripe for billing. Currently in active development.",
      stack: ["Next.js 15", "TypeScript", "Supabase", "PostgreSQL", "Twilio WhatsApp API", "Stripe", "OpenAI API"],
      highlights: [
        "Designing end-to-end workflow automation to replace manual tenant communication for a property management business.",
        "Built on Next.js 15 + TypeScript with Supabase (PostgreSQL) as the data layer; OpenAI for dynamic message generation.",
        "Twilio WhatsApp API for message delivery and Stripe for subscription billing; rent-reminder and lease-expiry flows in development.",
      ],
    },
    {
      name: "What Was Drawn — Gesture-Based AI Oracle Card Platform",
      year: "2026",
      url: "https://whatwasdrawn.com",
      github: "https://github.com/unicebondoc/whatwasdrawn",
      role: "Sole Developer",
      description: "Full-stack gesture-controlled oracle card app. Users draw cards using real-time hand tracking via webcam — no clicks required. AI generates personalised readings through a full RAG pipeline. Live as a web app, with a native iOS app submitted to the Apple App Store (in final review).",
      stack: ["React", "Vite", "Tailwind CSS", "MediaPipe Hands", "FastAPI", "OpenAI API", "LangChain", "Pinecone", "Docker", "Vercel", "Railway", "iOS"],
      highlights: [
        "Real-time hand gesture recognition via MediaPipe Hands — fully gesture-driven UX with tap-based mobile fallback.",
        "RAG pipeline: LangChain orchestration + Pinecone vector retrieval + OpenAI generation.",
        "FastAPI backend containerised with Docker, deployed to Railway; React frontend on Vercel with custom domain.",
        "Extended to a native iOS app, taken through the full Apple build, TestFlight, and App Store submission process.",
      ],
    },
    {
      name: "Ninja Butler — Personal AI Assistant Agent",
      year: "2026",
      github: "https://github.com/unicebondoc/ninja-butler",
      role: "Sole Developer",
      description: "Conversational AI personal assistant on Telegram, built on the Hermes agent framework (migrated from OpenClaw) — natural-language task management, diary entries, calendar reminders, daily briefings, weather lookups, web search, and GitHub queries. Deployed on a self-hosted Linux server (Zorin OS) at $0/month, running continuously via systemd since March 2026. Uses the OpenAI API and MiniMax for language generation, with persistent memory via the framework's native backend.",
      stack: ["Python", "Hermes", "OpenAI API", "MiniMax", "Telegram Bot API", "Notion API", "TickTick API"],
      highlights: [
        "Hermes agent framework (migrated from OpenClaw) with tool routing for weather, web search, GitHub, Notion, and TickTick integrations.",
        "Uses the OpenAI API and MiniMax for language generation, chosen for a balance of speed, quality, and cost.",
        "Persistent memory via the framework's native backend. Running as a systemd service on a self-hosted Zorin OS Linux server at $0/month.",
      ],
    },
    {
      name: "Core Memories — Interactive 3D AI Portfolio",
      year: "2026",
      url: "https://unicebondoc.com",
      github: "https://github.com/unicebondoc/unice-portfolio",
      role: "Sole Developer",
      description: "Immersive 3D portfolio with a bioluminescent forest environment, animated WebGL memory orbs, particle systems, GLSL shader effects, and a portfolio-aware OpenAI chatbot. The experience the visitor is currently inside.",
      stack: ["React 19", "Three.js", "React Three Fiber", "WebGL", "GLSL", "TypeScript", "OpenAI API", "Node.js"],
    },
  ],

  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "Dart", "HTML5", "CSS3", "SQL"],
    aiAndLLMs: [
      "Generative AI", "OpenAI API (GPT-4o)", "Gemini API",
      "MiniMax", "LLaMA", "LangChain",
      "RAG (Retrieval-Augmented Generation)", "Vector Databases", "Pinecone",
      "Prompt Engineering", "AI Agents", "Tool Calling", "Agentic Workflows",
    ],
    frameworks: [
      "React 19", "Flutter", "Three.js", "React Three Fiber", "WebGL/GLSL",
      "Node.js", "FastAPI", "Vite", "Tailwind CSS", "MediaPipe Hands",
    ],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition", "Hand landmark detection"],
    deploymentAndTools: [
      "Docker", "Linux (CLI)", "Vercel", "Railway", "Git", "GitHub",
      "REST APIs", "API Integration", "CI/CD", "Production Deployment",
      "n8n", "Supabase", "Twilio", "Cursor AI", "VS Code", "Agile",
    ],
    cloud: ["AWS (EC2, S3)", "Azure AI (AI-900)"],
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
        "High Distinction (88/100) — Postgraduate Project A (Capstone): LLMs for E-Commerce Content Generation.",
        "Team Lead — Gachabit (Flutter): Led a 4-person team to design and ship a gamified habit tracker mobile app using Flutter and Dart.",
        "Team Lead — AnyLogic Business Simulation: Led a 4-person team modelling real-world business operations.",
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
    capstoneGrade: "88/100 High Distinction — LLMs for E-Commerce, Western Sydney University. This is in the Education section, NOT a standalone project.",
    unikreTitle: "Software Engineer (NOT AI Software Engineer) at UNIKRE Trading, Nov 2024 – Jan 2025. Single-bullet role.",
    alignerr: "Alignerr — AI Training & Evaluation Specialist (Contract), Mar 2026 – Present. RLHF-style evaluation of LLM outputs for leading AI labs — code generation, reasoning accuracy, and response quality.",
    ninjButlerFramework: "Hermes is the agent framework for Ninja Butler (migrated from OpenClaw) — NOT LangChain. It uses the OpenAI API and MiniMax for language generation. Memory is via the framework's native backend — NOT Supabase.",
    landlit: "LandLIT is a WhatsApp-native property-management SaaS currently in active development — Next.js 15, TypeScript, Supabase (PostgreSQL), Twilio WhatsApp API, Stripe, and OpenAI API. It does NOT use n8n.",
    projectCount: "4 live-deployed products: LandLIT, What Was Drawn, Ninja Butler, Core Memories.",
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
      "deployed in 7 days — never say this",
      "seven days — never say this in relation to any project delivery",
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
    "deployed in 7 days",
    "seven days",
  ],
};
