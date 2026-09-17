// Public portfolio facts shared by the forest, work overview and AI guide.
// Lead work comes first. Private concepts and unbuilt projects stay out.
export const PROJECTS = [
  {
    "id": "what-was-drawn",
    "title": "What Was Drawn",
    "subtitle": "AI product · Public web experience",
    "flagship": true,
    "image": "/projects/what-was-drawn.jpg",
    "imageAlt": "What Was Drawn oracle web experience",
    "color": "#ffd700",
    "description": "An oracle experience that lets people draw cards with hand gestures and receive AI readings grounded in the card material. A tap-based fallback makes it usable without a camera.",
    "stack": [
      "React",
      "MediaPipe",
      "Python",
      "FastAPI",
      "LangChain",
      "Pinecone",
      "OpenAI"
    ],
    "links": {
      "live": "https://whatwasdrawn.com",
      "github": null
    },
    "caseStudy": {
      "challenge": "Make an AI interaction feel intentional and approachable, rather than another text box.",
      "contribution": "Shaped the interaction and built the hand-tracking interface, tap fallback and retrieval-augmented reading flow.",
      "result": "Public web experience. Mobile builds and store-review work are separate from public mobile availability."
    },
    "glow": "#ffd700",
    "glowSoft": "#ffd70033"
  },
  {
    "id": "flatsync",
    "title": "FlatSync",
    "subtitle": "Household app · In testing",
    "flagship": true,
    "color": "#9de1c3",
    "description": "A shared-home app for chores, shopping and household costs. The engineering goes beyond screens: invitations, member permissions, bill splitting and reliable shared updates.",
    "stack": [
      "React",
      "TypeScript",
      "Capacitor",
      "Supabase",
      "PostgreSQL"
    ],
    "links": {
      "live": null,
      "github": null
    },
    "caseStudy": {
      "challenge": "Help housemates coordinate everyday work and money without making shared state or permissions confusing.",
      "contribution": "Developed the shared household flows and mobile builds, with regression coverage for money rules, conflicting edits, keyboard focus and accessible feedback.",
      "result": "iOS and Android test builds prepared. Currently in testing, with device validation and store-release work still underway."
    },
    "glow": "#9de1c3",
    "glowSoft": "#9de1c333"
  },
  {
    "id": "core-memories",
    "title": "Core Memories",
    "subtitle": "Creative engineering · Public portfolio",
    "flagship": true,
    "image": "/projects/core-memories-forest.jpg",
    "imageAlt": "Core Memories forest with glowing memory orbs",
    "color": "#7eddf2",
    "description": "A portfolio built as a place to explore: a forest of personal milestones, interactive project artifacts and an AI-assisted guide. The experience connects storytelling with software.",
    "stack": [
      "React 19",
      "JavaScript / JSX",
      "Three.js",
      "React Three Fiber",
      "WebGL",
      "GLSL"
    ],
    "links": {
      "live": null,
      "github": null
    },
    "note": "You're already here ✦",
    "caseStudy": {
      "challenge": "Communicate an unusual path into engineering without reducing it to a timeline of job titles.",
      "contribution": "Built the forest, animated orbs, shader effects and portfolio guide, alongside a direct route to work, CV and contact details.",
      "result": "Public interactive portfolio. The standard project overview gives visitors a way to understand the work without exploring every orb."
    },
    "glow": "#7eddf2",
    "glowSoft": "#7eddf233"
  },
  {
    "id": "unikre",
    "title": "UNIKRE",
    "subtitle": "Commerce · Software & operations",
    "color": "#f59e0b",
    "image": "/projects/unikre-product-world.jpg",
    "imageAlt": "The Quiet Whiskers Oracle physical deck and cards",
    "description": "A commerce business selling the Quiet Whiskers Oracle physical card deck. My work spans its website, product presentation, marketplace listings, marketing, order fulfilment and cost tracking.",
    "stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "E-commerce",
      "Product operations"
    ],
    "links": {
      "live": "https://unikre.com.au",
      "github": null
    },
    "caseStudy": {
      "challenge": "Connect a physical oracle deck, its digital experience and the practical work of selling and fulfilling it.",
      "contribution": "Built the brand and commerce website and contributed to product imagery, listings, campaign preparation, fulfilment workflows and contribution-cost review.",
      "result": "A working commerce website supporting a physical product and ongoing sales operations. My contribution combines engineering with hands-on commercial support."
    },
    "glow": "#f59e0b",
    "glowSoft": "#f59e0b33"
  },
  {
    "id": "ninja-butler",
    "title": "Ninja Clan / Hermes",
    "subtitle": "Private operational system · Mac-hosted",
    "color": "#a78bfa",
    "image": "/projects/ninja-clan.png",
    "imageAlt": "Ninja Clan emblem",
    "description": "A private automation environment for tasks, calendar, messaging and curated knowledge. The current Hermes runtime is on a Mac, with human approval gates for consequential actions.",
    "stack": [
      "Python",
      "Hermes",
      "macOS",
      "launchd",
      "Telegram",
      "Google APIs",
      "TickTick",
      "Obsidian"
    ],
    "links": {
      "live": null,
      "github": null
    },
    "caseStudy": {
      "challenge": "Keep daily work connected without turning chat history into an unreliable task database.",
      "contribution": "Configured integrations, reviewed workflows and operating boundaries; migrated earlier Linux and VPS infrastructure to the Mac and retired the VPS.",
      "result": "Private operational system, not a public SaaS product. Obsidian holds knowledge, TickTick holds actions and Calendar holds time."
    },
    "glow": "#a78bfa",
    "glowSoft": "#a78bfa33"
  },
  {
    "id": "causeconnect",
    "title": "CauseConnect",
    "subtitle": "ACS internship · Developer / Programmer",
    "color": "#f3b9aa",
    "description": "A web application for discovering and exploring social-awareness campaigns, developed as an ACS internship project by a team of 10. My role is Developer / Programmer, contributing to application development, API integration, testing and technical documentation. July 2026 to present; expected completion October 2026.",
    "stack": [
      "React",
      "JavaScript",
      "REST APIs",
      "Vitest",
      "Git",
      "Team delivery"
    ],
    "links": {
      "live": null,
      "github": "https://github.com/acs-wil-wd-team1/social-awareness-web-app"
    },
    "caseStudy": {
      "challenge": "Turn the team's campaign API into a dependable browsing experience across homepage and detail views.",
      "contribution": "Implemented campaign frontend work, mapped API responses, handled campaign routing and missing presentation data, and added tests and setup documentation.",
      "result": "Campaign frontend integrated and checked within the WIL team project, with regression tests and setup documentation. Backend and authentication were implemented by teammates."
    },
    "glow": "#f3b9aa",
    "glowSoft": "#f3b9aa33"
  }
]
