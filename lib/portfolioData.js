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
    headline: "AI Engineer | Mobile & Full-Stack Developer | LLM, Agent & Game Systems",
    summary: "AI engineer and full-stack mobile builder with a Master of ICT (High Distinction, WSU) and a multi-product delivery portfolio spanning RAG products, multi-agent orchestration, AI workflow automation, computer vision, Unity mobile game development, and self-hosted production infrastructure — built and shipped end-to-end, not just prototyped. Operates as a registered sole trader shipping public web products, private agent systems, mobile games, and PropTech automation. Former banking ops manager turned engineer: brings process thinking, stakeholder communication, and real-world problem framing to every build.",
    currentStatus: "Unice has graduated with a Master of ICT from Western Sydney University, earning High Distinction (88/100) for her LLM research capstone. She now works as an Independent AI Engineer (registered sole trader, Mar 2026 – Present), building and shipping AI and mobile products end-to-end while completing the ACS-accredited Professional Year in Sydney. Live experiences include What Was Drawn on the web, the UNIKRE website, Ninja Clan, and Core Memories. What Was Drawn has a native iOS experience upcoming; Boba Rush is in TestFlight testing and LandLIT remains in active development. She is focused on shipping and selling her product portfolio while remaining open to aligned partnerships and engineering opportunities.",
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
      description: "Software Engineer at UNIKRE Trading (Nov 2024 – Jan 2025) — applied GPT-4 AI content strategies to a live Shopify platform, contributing directly to the Masters capstone (High Distinction 88/100). Has since built a multi-product portfolio spanning UNIKRE, What Was Drawn, Ninja Clan, Core Memories, LandLIT, and Boba Rush.",
    },
    {
      id: "orb-becoming",
      title: "The Architect, Ongoing",
      years: "2026",
      description: "Professional Year in Sydney, now building independently as a registered sole trader — shipping AI, web, agent, and mobile products end-to-end. Also contracts on RLHF-style AI training and evaluation at Alignerr. Focused on product delivery and open to aligned partnerships and engineering opportunities.",
    },
  ],

  experience: [
    {
      title: "Independent AI Engineer (Sole Trader)",
      company: "Self-employed — multi-product portfolio",
      location: "Sydney, Remote",
      dates: "Mar 2026 – Present",
      highlights: [
        "Registered sole trader building and shipping AI and mobile products end-to-end after completing the Master of ICT (High Distinction, WSU).",
        "Design, build, and deploy across UNIKRE, What Was Drawn, Ninja Clan, Core Memories, LandLIT, and Boba Rush.",
      ],
    },
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
      description: "Full-stack gesture-controlled oracle card app. Users draw cards using real-time hand tracking via webcam and receive personalised readings through a full RAG pipeline. Live on the web, with a native iOS experience upcoming.",
      stack: ["React", "Vite", "Tailwind CSS", "MediaPipe Hands", "FastAPI", "OpenAI API", "LangChain", "Pinecone", "Docker", "Vercel", "Railway", "iOS"],
      highlights: [
        "Real-time hand gesture recognition via MediaPipe Hands — fully gesture-driven UX with tap-based mobile fallback.",
        "RAG pipeline: LangChain orchestration + Pinecone vector retrieval + OpenAI generation.",
        "FastAPI backend containerised with Docker, deployed to Railway; React frontend on Vercel with custom domain.",
        "Extended into a native iOS experience and taken through the Apple build and TestFlight workflow.",
      ],
    },
    {
      name: "UNIKRE — The Quiet Whiskers Oracle",
      year: "2026",
      url: "https://unikre.com.au",
      github: "https://github.com/unicebondoc/unikre-website",
      role: "Sole Developer / Product Builder",
      description: "Live brand and commerce website for The Quiet Whiskers Oracle physical deck, connected directly to the What Was Drawn digital experience. Interactive product presentation, real deck imagery, marketplace CTAs, and a cohesive physical-to-digital product story.",
      stack: ["Next.js", "React", "TypeScript", "React Three Fiber", "Three.js", "Framer Motion", "Vercel"],
      highlights: [
        "Built the live brand and commerce home for a 44-card physical oracle deck and guidebook.",
        "Connected the physical product, marketplace purchase paths, and What Was Drawn digital reading experience.",
        "Created an interactive 3D presentation using real product assets rather than placeholder renders.",
      ],
    },
    {
      name: "Ninja Clan — Personal AI Operating System",
      year: "2026",
      github: "https://github.com/unicebondoc/ninja-butler",
      role: "Sole Developer",
      description: "Private personal AI operating system that began as Ninja Butler on OpenClaw and a repurposed iMac converted to Linux, migrated to an always-on Hetzner Linux VPS, then transitioned to Hermes and evolved into Ninja Clan. It connects Telegram, Gmail, Google Calendar, TickTick, curated memory, research, and Mac build workers through reviewed routing and human approval gates.",
      stack: ["Python", "Hermes", "Claude", "Codex", "Telegram Bot API", "Google APIs", "TickTick", "Postiz", "Hetzner VPS"],
      highlights: [
        "Started Ninja Butler on OpenClaw using a repurposed Linux iMac, then migrated the runtime to a Hetzner Linux VPS for reliable 24/7 operation.",
        "Transitioned the system from OpenClaw to Hermes and expanded Butler into the wider Ninja Clan agent system.",
        "Routes across Claude and Codex (OAuth-based) for reasoning and high-volume automation.",
        "Persistent memory via the framework's native backend. Running as a systemd service on a self-hosted Hetzner Linux VPS.",
      ],
    },
    {
      name: "Boba Rush — Unity Casual Mobile Game (iOS TestFlight)",
      year: "2026",
      role: "Sole Developer",
      description: "A tap-based bubble-tea casual mobile game built in Unity 6 (C#) — timed rounds, customer-patience mechanics, combo scoring, speed bonuses, and a rewarded-ad \"save order\" flow. Currently in iOS TestFlight testing; public launch is not yet confirmed.",
      stack: ["Unity 6", "C#", "iOS", "Mobile-first architecture", "Rewarded Ads", "Custom Unity Editor Tooling"],
      highlights: [
        "Architected a tap-based bubble-tea game with timed rounds, customer-patience mechanics, combo scoring, and a rewarded-ad save-order flow.",
        "Built full game systems end-to-end: customer queue, recipe data models, ingredient logic, unlock progression, and analytics tracking.",
        "Implemented iOS-specific haptic feedback and safe-area handling; authored custom Unity Editor tools (recipe generator, scene builder) to speed up content creation.",
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
    languages: ["Python", "TypeScript", "JavaScript (ES6+)", "C#", "Dart", "SQL", "HTML5", "CSS3"],
    aiAndLLMs: [
      "Generative AI", "OpenAI API (GPT-4o)", "Claude / Codex Workflows", "Gemini API",
      "MiniMax", "LLaMA", "LangChain",
      "RAG (Retrieval-Augmented Generation)", "Vector Databases", "Pinecone",
      "Prompt Engineering", "AI Agents", "Tool Calling", "Agentic Workflows",
      "RLHF-style Evaluation",
    ],
    frameworks: [
      "React 19", "Flutter", "Three.js", "React Three Fiber", "WebGL/GLSL",
      "Node.js", "FastAPI", "Vite", "Tailwind CSS", "MediaPipe Hands",
    ],
    mobileAndGameDev: [
      "Unity 6", "C#", "Mobile-first Architecture", "iOS Haptics",
      "Custom Unity Editor Tooling", "Rewarded-Ad Integration",
    ],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition", "Hand landmark detection"],
    deploymentAndTools: [
      "Docker", "Linux VPS (Hetzner)", "systemd", "launchd", "SSH Tunnels",
      "Vercel", "Railway", "Git", "GitHub",
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
      dates: "Jul 2026 – Oct 2026",
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
    "ICT Professional Year Program (ACS Accredited) — Performance Education, Jul 2026 – Oct 2026",
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
    soleTrader: "Unice's primary current role is Independent AI Engineer (registered sole trader), Mar 2026 – Present, building and shipping a multi-product portfolio end-to-end. Alignerr is a secondary contract.",
    alignerr: "Alignerr — AI Training & Evaluation Specialist (Contract), Mar 2026 – Present. RLHF-style evaluation of LLM outputs for leading AI labs — code generation, reasoning accuracy, and response quality. This is a contract alongside her independent (sole trader) work, not her main role.",
    ninjButlerFramework: "Ninja Clan began as Ninja Butler on OpenClaw and a repurposed iMac converted to Linux. The runtime migrated to an always-on Hetzner Linux VPS with systemd, persistent logs, and SSH boundaries, then transitioned from OpenClaw to Hermes and expanded into a private personal AI operating system connecting Telegram, Gmail, Google Calendar, TickTick, curated memory, research, Mac workers, and reviewed workflows.",
    landlit: "LandLIT is a WhatsApp-native property-management SaaS currently in active development — Next.js 15, TypeScript, Supabase (PostgreSQL), Twilio WhatsApp API, Stripe-ready, and OpenAI API. It does NOT use n8n.",
    bobaRush: "Boba Rush is a Unity 6 casual mobile game currently in iOS TestFlight testing. Public launch is not yet confirmed.",
    projectCount: "Live experiences include What Was Drawn on the web, the UNIKRE website, Ninja Clan, and Core Memories. What Was Drawn has an iOS experience upcoming; Boba Rush is in TestFlight and LandLIT is in active development. Do not claim a fixed live-product count.",
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

/**
 * Server-safe portfolio snapshot used by the Vercel chat function.
 * Kept as a function so API consumers receive the current canonical data
 * without importing client-only modules or maintaining a second copy.
 */
export function getPortfolioDataForAPI() {
  return PORTFOLIO_DATA;
}
