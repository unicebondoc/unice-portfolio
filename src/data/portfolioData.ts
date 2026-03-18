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
      description: "Bachelor of Communication (Broadcasting) at Bicol University, Philippines. Foundation in storytelling, media structure, and audience communication — skills that now shape how she designs AI systems and writes documentation.",
    },
    {
      id: "orb-banking",
      title: "100 Clients. Zero Room For Error.",
      years: "2018–2022",
      description: "Four years in banking — BDO Unibank and RCBC — managing 100+ concurrent SME client accounts in a regulated, high-stakes environment. Learned precision, stakeholder coordination, and composure under real pressure.",
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
      description: "Ran empirical A/B tests comparing AI-generated vs human-written content on a live Shopify platform, measuring real CTR, bounce rate, and page views with Python. Awarded 88/100 High Distinction. Western Sydney University.",
    },
    {
      id: "orb-engineer",
      title: "Theory Became Delivery",
      years: "2024–present",
      description: "Scoped, built, and deployed a GPT-4 AI customer service chatbot for a live Shopify business in seven days. Freelance AI Software Engineer, recognised as official industry placement by WSU. Has since shipped What Was Drawn and Ninja Butler.",
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
        "Designed and deployed an AI-powered customer service chatbot using Python, OpenAI API (GPT-4), and Voiceflow on a live Shopify store — independently scoping requirements and owning full delivery.",
        "Built a Shopify e-commerce store from scratch: Liquid theme customisation, RESTful API integration, UI design, product catalogue, and checkout flow.",
        "Benchmarked GPT-4, Claude, Gemini, and LLaMA for response quality, latency, and cost — comparative analysis informed final AI toolchain selection.",
        "Engagement recognised by Western Sydney University as the official Masters of ICT industry placement.",
      ],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "Rizal Commercial Banking Corporation (RCBC)",
      location: "Philippines",
      dates: "Sep 2019 – Sep 2022",
      highlights: [
        "Managed end-to-end account operations for 100+ concurrent SME client accounts.",
        "Coordinated relationship managers, compliance teams, and external stakeholders under regulatory requirements.",
        "Delivered direct client-facing consultations and issue resolution for SME business owners.",
        "Maintained audit-ready compliance documentation across complex multi-party accounts.",
      ],
    },
    {
      title: "Marketing and Client Relations Officer",
      company: "BDO Unibank",
      location: "Philippines",
      dates: "Apr 2018 – Mar 2019",
      highlights: [
        "Client acquisition, onboarding, and relationship management for retail banking products.",
        "CRM records, account documentation, and long-term client engagement.",
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
      name: "Ninja Butler — AI Personal Assistant",
      year: "2026",
      github: "https://github.com/unicebondoc/ninja-butler",
      role: "Sole Developer",
      description: "Conversational AI personal assistant on Telegram with dual-mode LLM inference — cloud (OpenAI) and local (LLaMA, Qwen via Ollama). Manages tasks, calendar, diary, and daily briefings via LangChain tool routing.",
      stack: ["Python", "OpenAI API", "LangChain", "Telegram Bot API", "LLaMA", "Qwen", "Ollama", "Notion API", "TickTick API"],
      highlights: [
        "Dual-mode LLM inference: cloud-based (OpenAI) and locally deployed (LLaMA, Qwen via Ollama).",
        "LangChain tool-routing architecture with weather, web search, GitHub, Notion, and TickTick integrations.",
      ],
    },
    {
      name: "LLMs for E-Commerce Content Generation — WSU Research Capstone",
      year: "2024–2025",
      github: "https://github.com/unicebondoc/llm-ecommerce-analysis",
      role: "Researcher — Western Sydney University",
      grade: "High Distinction — 88/100",
      description: "Empirical A/B testing research comparing AI-generated vs human-generated e-commerce content on a live Shopify platform. Measured page views, CTR, bounce rate, and time on page.",
      stack: ["Python", "OpenAI API (GPT-4)", "Shopify Liquid", "REST APIs", "Voiceflow", "pandas", "numpy", "matplotlib"],
    },
  ],

  skills: {
    languages: ["Python", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SQL"],
    aiAndLLMs: [
      "OpenAI API (GPT-4)", "Claude API", "Gemini API", "LLaMA/Qwen (local via Ollama)",
      "LangChain", "RAG (Retrieval-Augmented Generation)", "Pinecone (Vector Database)",
      "Prompt Engineering", "AI Output Evaluation", "Voiceflow",
    ],
    frameworks: [
      "React 18", "Three.js", "React Three Fiber", "WebGL/GLSL",
      "Node.js", "FastAPI", "Vite", "Tailwind CSS",
    ],
    computerVision: ["MediaPipe Hands", "Real-time gesture recognition", "Hand landmark detection"],
    deploymentAndTools: [
      "Docker", "Vercel", "Railway", "Git", "GitHub",
      "REST APIs", "MongoDB", "Telegram Bot API",
      "VS Code", "Cursor AI IDE",
    ],
    cloud: ["AWS (EC2, S3, deployment basics)", "Azure (Azure OpenAI, Cognitive Services)"],
    projectDelivery: [
      "Agile", "Scrum", "IT Project Management",
      "Stakeholder Coordination", "Requirements Gathering", "Risk Management",
    ],
  },

  education: [
    {
      qualification: "Master of ICT (Web & Mobile Computing)",
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
    banking: "~4 years total — BDO Unibank (Apr 2018–Mar 2019, 1 year) + RCBC (Sep 2019–Sep 2022, 3 years).",
    chatbotDelivery: "Seven days end-to-end, concept to live deployment.",
    capstoneGrade: "88/100 High Distinction — LLMs for E-Commerce, Western Sydney University.",
    freelanceTitle: "AI Software Engineer (Freelance) at UNIKRE Trading, Jun 2024 – Present.",
    neverSay: [
      "salary figures",
      "visa information",
      "health information",
      "relationship information",
      "context-aware chatbot — say portfolio-aware",
      "8 years experience — banking was ~4 years total",
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
    "Sun Life Philippines",
    "Fulton Lane Realty",
    "Love Quest",
    "tarot deck",
  ],
};
