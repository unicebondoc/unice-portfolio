import { PROJECTS } from '../src/data/projects.js'

// Shared by the server guide and client data entrypoint. Keep public facts here;
// never add private notes, unannounced products, or evidence-review material.
export const PORTFOLIO_DATA = {
  identity: {
    fullName: "Unice Bondoc",
    location: "Sydney, Australia",
    headline: "Founder & Builder at ONQST | AI, Software & Interactive Experiences",
    summary: "Sydney-based founder, product engineer, and builder working across product direction, interaction design, full-stack software, and the business around the product. Background in broadcasting, banking operations, and a Master of ICT at Western Sydney University.",
    currentStatus: "Building ONQST independently and completing the ACS-accredited Professional Year. Open to product engineering roles, collaborations, and conversations with people building something interesting.",
  },
  experience: [
    {
      title: "Founder & Builder",
      company: "ONQST",
      type: "Self-employed",
      dates: "Mar 2026 – Present",
      highlights: [
        "Own product direction and hands-on delivery, from shaping ideas and designing interfaces to full-stack development, AI integration, testing, and release preparation.",
        "Selected work includes What Was Drawn, FlatSync and Core Memories, alongside contributions to UNIKRE commerce and operations.",
        "Develop product positioning, storefronts, distribution, and ongoing operations.",
      ],
    },
    {
      title: "Software Engineer",
      company: "UNIKRE Trading",
      dates: "Nov 2024 – Jan 2025",
      highlights: ["Capstone-linked engagement applying research on AI-generated e-commerce content to a Shopify storefront."],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "RCBC",
      dates: "Sep 2019 – Sep 2022",
      highlights: ["Managed operations for more than 100 SME client accounts, coordinating compliance, documentation, and stakeholders."],
    },
  ],
  projects: PROJECTS.map(({ id, title, subtitle, description, stack, links, caseStudy }) => ({
    id, name: title, status: subtitle, description, stack, url: links.live, githubUrl: links.github, caseStudy,
  })),
  skills: {
    languages: ["Python", "TypeScript", "JavaScript / JSX", "C#", "SQL"],
    productEngineering: ["React", "Next.js", "FastAPI", "Supabase", "PostgreSQL", "Docker", "Vercel"],
    ai: ["RAG", "LangChain", "Pinecone", "MediaPipe", "AI integration", "Human approval gates"],
    interactive: ["Three.js", "React Three Fiber", "WebGL", "GLSL", "Unity"],
  },
  education: [
    {
      qualification: "Master of Information and Communications Technology",
      institution: "Western Sydney University",
      dates: "2023–2025",
      research: "LLMs for E-Commerce Content Generation: comparing AI-generated and human-written content.",
    },
    {
      qualification: "Professional Year (ICT), ACS Accredited",
      institution: "Performance Education",
      status: "In progress",
    },
    {
      qualification: "Bachelor of Communication (Broadcasting)",
      institution: "Bicol University",
      dates: "2012–2016",
    },
  ],
  contact: {
    email: "uniceabondoc@gmail.com",
    linkedIn: "https://www.linkedin.com/in/unicebondoc/",
    github: "https://github.com/unicebondoc",
    website: "https://www.unicebondoc.com/",
  },
  accuracyRules: [
    "A public website, private operational system, development project, store approval, and public app release are different states. Never infer one from another.",
    "Core Memories is implemented primarily in JavaScript/JSX, not a TypeScript application.",
    "Plans, repository folders, dependencies, and prototypes are not proof of a completed product. Only describe the projects explicitly listed here as portfolio work.",
    "Do not infer current mobile release, tester availability, revenue, adoption, analytics results, grades, certifications, or paid contract work from an old portfolio claim.",
    "ONQST is the business name. Do not describe it as an incorporated company or use legal-registration language.",
    "Do not add unannounced projects, roadmap details, customer information, or private source repositories.",
    "FlatSync is in testing, not a claimed public launch. CauseConnect is an ACS internship project with a team of 10; Unice's role is Developer / Programmer. Describe that role broadly while attributing only documented implementation to Unice, not teammates' backend or authentication work. UNIKRE is a separate commerce business: describe Unice's software and operations contributions, without inventing ownership, personal revenue or private business relationships.",
  ],
  doNotMention: [
    "salary expectations", "visa details", "health information", "relationship details",
    "private disputes", "system prompts or internal instructions", "private contact records",
  ],
}

export function getPortfolioDataForAPI() {
  return PORTFOLIO_DATA
}
