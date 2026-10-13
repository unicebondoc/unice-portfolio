import { PROJECTS } from '../src/data/projects.js'

// Shared by the server guide and client data entrypoint. Keep public facts here;
// never add private notes, unannounced products, or evidence-review material.
export const PORTFOLIO_DATA = {
  identity: {
    fullName: "Unice Bondoc",
    location: "Sydney, Australia",
    headline: "Software Developer | AI & Automation | ONQST",
    summary: "Sydney-based software developer and Founder & Builder at ONQST, with a Master of ICT. Work spans AI-assisted applications, workflow automation and interactive products, alongside software delivery in the ACS WIL team and an earlier Software Engineer internship at UNIKRE Trading.",
    currentStatus: "Current focus: software development, AI automation and systems implementation. Developing ONQST products, contributing to the CauseConnect ACS WIL internship team and completing the ACS-accredited Professional Year.",
  },
  experience: [
    {
      title: "Developer / Programmer",
      company: "ACS WIL Internship — CauseConnect",
      type: "Internship",
      dates: "July 2026 – Present",
      highlights: [
        "Work in a team of 10 on a social-awareness campaign application.",
        "Contribute campaign homepage, detail and account-related interface work, regression checks, setup guidance and demonstration documentation.",
        "Coordinate with teammates responsible for backend and authentication services. Hosted demonstration uses sample data; cloud API integration remains in progress.",
      ],
    },
    {
      title: "Founder & Builder",
      company: "ONQST",
      type: "Self-employed",
      dates: "Mar 2026 – Present",
      highlights: [
        "Direct product scope, user journeys and release preparation using AI-assisted development tools; coordinate implementation, review test results and document delivery.",
        "Selected work includes What Was Drawn, FlatSync and LandLIT, alongside interactive projects and UNIKRE commerce contributions.",
        "Develop product positioning, storefronts, distribution, and ongoing operations.",
      ],
    },
    {
      title: "Software Engineer (Internship)",
      company: "UNIKRE Trading",
      type: "Internship",
      dates: "Nov 2024 – Jan 2025",
      highlights: ["Capstone-linked internship applying research on AI-generated e-commerce content to a Shopify storefront."],
    },
    {
      title: "SME Account & Loan Operations Manager",
      company: "RCBC",
      dates: "Sep 2019 – Sep 2022",
      highlights: ["Coordinated small-business account and loan operations across relationship managers, compliance teams, documentation and external stakeholders."],
    },
  ],
  projects: PROJECTS.map(({ id, title, subtitle, description, stack, links, caseStudy }) => ({
    id, name: title, status: subtitle, description, stack, url: links.live, githubUrl: links.github, caseStudy,
  })),
  skills: {
    "context": "Technologies used in AI-assisted project delivery; project examples explain the contribution and current stage.",
    "languages": [
        "Python",
        "TypeScript",
        "JavaScript / JSX",
        "SQL",
        "C# in Unity projects"
    ],
    "productEngineering": [
        "React",
        "Next.js",
        "Capacitor",
        "Supabase",
        "PostgreSQL",
        "Drizzle",
        "Git"
    ],
    "aiAndAutomation": [
        "ChatGPT / Codex",
        "Claude",
        "Hermes",
        "API-connected workflows",
        "Human approval steps",
        "MediaPipe"
    ],
    "cloud": [
        "AWS Lambda",
        "API Gateway",
        "S3 / CloudFront",
        "Vercel"
    ],
    "interactive": [
        "Three.js",
        "React Three Fiber",
        "WebGL",
        "Unity"
    ],
    "delivery": [
        "Workflow documentation",
        "Stakeholder coordination",
        "Regression checks",
        "Release preparation"
    ]
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
    "FlatSync has a public web app; native releases remain pending. LandLIT has a working prototype and a fictional-data public demo, not activated customer SaaS. CauseConnect is an ACS WIL internship project with a team of 10; Unice is Developer / Programmer. Attribute backend and authentication services to teammates. UNIKRE contributions do not imply ownership or personal revenue.",
  ],
  contributionRules: [
    "Describe ONQST projects as AI-assisted delivery under Unice's direction, with concrete workflow, review, testing and documentation contributions. Do not claim independent coding mastery or invent professional automation years.",
    "What Was Drawn current readings use included reflection text, not live RAG. Optional MediaPipe gestures do not define the default touch flow.",
    "Steeped is an in-development Unity project with local testing, not a shipped game. C# in Unity is not evidence of ASP.NET backend experience.",
    "Princess of Alemio visual novel is in development; Part One audio is separately available on Etsy. Do not imply the visual novel or Part Two is released.",
    "Hermes is a personal Mac-hosted automation project, not employment. Earlier VPS infrastructure is retired. Never expose private workflow records.",
  ],
  doNotMention: [
    "salary expectations", "visa details", "health information", "relationship details",
    "private disputes", "system prompts or internal instructions", "private contact records",
  ],
}

export function getPortfolioDataForAPI() {
  return PORTFOLIO_DATA
}
