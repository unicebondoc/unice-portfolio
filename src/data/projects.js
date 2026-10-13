// Shared public facts for the hiring page, forest and AI guide.
export const PROJECTS = [
  {
    "id": "causeconnect",
    "title": "CauseConnect",
    "subtitle": "ACS WIL internship · Developer / Programmer",
    "description": "A campaign-discovery application developed with a ten-person ACS internship team. July 2026–present.",
    "stack": [
      "React",
      "JavaScript",
      "REST APIs",
      "Vitest",
      "Git"
    ],
    "color": "#f3b9aa",
    "flagship": false,
    "group": "experience",
    "links": {
      "live": null,
      "github": "https://github.com/acs-wil-wd-team1/social-awareness-web-app"
    },
    "caseStudy": {
      "challenge": "Turn campaign data into clear homepage, detail and account-related journeys while coordinating with a team.",
      "contribution": "I contribute interface work, regression checks, setup guidance and demonstration documentation, alongside teammates responsible for backend and authentication services.",
      "decision": "Keep hosted sample data and local API integration distinct, so a successful demonstration does not hide an unfinished backend handover.",
      "evidence": "Frontend regression checks, local integration checks and setup/demo documentation support the work. Team review and API handover remain part of delivery.",
      "result": "Hosted sample demonstration; cloud API integration remains in progress. This is an internship team contribution, not sole ownership of the application."
    },
    "image": "/projects/causeconnect-sample.webp",
    "imageAlt": "Actual CauseConnect hosted homepage with fictional campaign data",
    "imageKind": "dashboard",
    "imageCaption": "Hosted frontend · sample data · backend integration pending",
    "glow": "#f3b9aa",
    "glowSoft": "#f3b9aa33"
  },
  {
    "id": "flatsync",
    "title": "FlatSync",
    "subtitle": "Public web app · Native releases pending",
    "description": "A shared home for household tasks, shopping and bills.",
    "stack": [
      "React",
      "TypeScript",
      "Capacitor",
      "Supabase",
      "PostgreSQL"
    ],
    "color": "#9de1c3",
    "flagship": true,
    "group": "featured",
    "links": {
      "live": "https://flatsync.onqst.com/",
      "github": null
    },
    "caseStudy": {
      "challenge": "Help housemates coordinate work and money without confusing permissions or shared updates.",
      "contribution": "I direct the product flows and AI-assisted implementation of invitations, member permissions, chores, shopping and shared bills.",
      "decision": "Household membership and money calculations need explicit rules; accessible feedback must explain a failed or conflicting update.",
      "evidence": "Regression coverage checks bill calculations, conflicting edits and keyboard-accessible interactions. The public web app is available to try.",
      "result": "Public web access is available. Native iOS and Android releases remain pending."
    },
    "video": "/projects/flatsync-demo-loop.mp4",
    "videoCaption": "Actual web-demo recording · fictional household · native releases pending",
    "image": "/projects/flatsync-live.webp",
    "imageAlt": "Actual FlatSync mobile-web screen showing a fictional household",
    "imageKind": "phone",
    "imageCaption": "Mobile-web screen · fictional household",
    "glow": "#9de1c3",
    "glowSoft": "#9de1c333"
  },
  {
    "id": "landlit",
    "title": "LandLIT",
    "subtitle": "Working prototype · Fictional-data demo",
    "description": "Connected property records for contracts, rent, utilities and monthly reporting.",
    "stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Drizzle"
    ],
    "color": "#f29b83",
    "flagship": true,
    "group": "featured",
    "links": {
      "live": "https://landlit-preview.vercel.app/",
      "github": null
    },
    "caseStudy": {
      "challenge": "Keep contracts, rent records, utility allocations and monthly exports connected rather than scattered across separate documents.",
      "contribution": "I shape the workflows and AI-assisted implementation of a property-operations prototype, including linked records and reviewable exports.",
      "decision": "A recorded receipt is not the same as a processed payment. Demo data, prepared actions and real customer operations stay clearly separated.",
      "evidence": "Local checks cover persistence, controlled registration and encrypted restore. The public demonstration uses fictional data and does not transact.",
      "result": "A working prototype with a public fictional-data demo. Deployment for real customers remains pending."
    },
    "image": "/projects/landlit-ph-demo.webp",
    "imageAlt": "LandLIT fictional Australian sample dashboard with a demo disclosure",
    "imageKind": "dashboard",
    "imageCaption": "Fictional sample dashboard · no real accounts or transactions",
    "glow": "#f29b83",
    "glowSoft": "#f29b8333"
  },
  {
    "id": "what-was-drawn",
    "title": "What Was Drawn",
    "subtitle": "Public web app · iOS review pending",
    "description": "A card-based reflection companion with touch, optional gestures and journaling.",
    "stack": [
      "React",
      "Capacitor",
      "Supabase",
      "MediaPipe",
      "Python",
      "AWS Lambda",
      "API Gateway",
      "S3 / CloudFront"
    ],
    "color": "#e3bd68",
    "flagship": true,
    "group": "featured",
    "links": {
      "live": "https://www.whatwasdrawn.com/",
      "github": null
    },
    "caseStudy": {
      "challenge": "Make a quiet reflection flow usable with or without a camera, and keep saved journals scoped to the right account.",
      "contribution": "I direct AI-assisted product development, interaction review and release preparation. The production billing API migrated from Railway to AWS Lambda and API Gateway with the public domain preserved.",
      "decision": "Touch is the default, gestures are optional, and current readings use included reflection text. Camera recognition asks for confirmation rather than pretending certainty.",
      "evidence": "Account-scoped persistence and billing failure/recovery checks accompany the release. The web frontend now runs on private S3/CloudFront; billing remains on Lambda/API Gateway.",
      "result": "The web app is public. Native iOS review remains pending. Legacy RAG code is not the current ordinary reading flow."
    },
    "image": "/projects/what-was-drawn-live.webp",
    "imageAlt": "Actual What Was Drawn public homepage and Begin a reading action",
    "imageKind": "wide",
    "imageCaption": "Public web interface",
    "glow": "#e3bd68",
    "glowSoft": "#e3bd6833"
  },
  {
    "id": "steeped",
    "title": "Steeped",
    "subtitle": "Unity game · In development",
    "description": "A quiet tea-and-focus game with visits, stories and persistent progress.",
    "stack": [
      "Unity",
      "C#",
      "Save-state recovery",
      "Regression checks"
    ],
    "color": "#a9cfae",
    "flagship": false,
    "group": "interactive",
    "links": {
      "live": "https://steeped.onqst.com/",
      "github": null
    },
    "caseStudy": {
      "challenge": "Keep focus sessions, tea interactions and story progress consistent when players stop, return or recover from an interrupted interaction.",
      "contribution": "I direct AI-assisted development and review of gameplay, save-state recovery and bounded fixes, with existing saves preserved through the checks.",
      "decision": "Qualify the exact build and its save behaviour before expanding release claims; scripted checks and creative acceptance answer different questions.",
      "evidence": "The tested local r13j owner preview has Mac and simulator checks covering sessions, recovery and story state. Physical-device and owner creative acceptance remain separate.",
      "result": "A tested local preview is available for owner review. Public game release and store acceptance remain pending."
    },
    "image": "/projects/steeped-gameplay.webp",
    "imageAlt": "Actual Steeped r13j tea-making gameplay preview",
    "imageKind": "wide",
    "imageCaption": "Actual r13j gameplay · development preview · release acceptance pending",
    "video": "/projects/steeped-gameplay-loop.mp4",
    "videoCaption": "Actual r13j gameplay recording · development preview · release acceptance pending",
    "linkLabel": "Explore the development site",
    "glow": "#a9cfae",
    "glowSoft": "#a9cfae33"
  },
  {
    "id": "princess-of-alemio",
    "title": "Princess of Alemio",
    "subtitle": "Visual novel in development · Audio edition available",
    "description": "One story world explored through an interactive visual novel and a separate audio drama.",
    "stack": [
      "Interactive narrative",
      "AI-assisted production",
      "Media delivery"
    ],
    "color": "#b8a8ed",
    "flagship": false,
    "group": "interactive",
    "links": {
      "live": "https://onqst.com/#product/alemio",
      "github": null
    },
    "caseStudy": {
      "challenge": "Translate a story into two different experiences while keeping their format, scope and availability clear.",
      "contribution": "I direct the AI-assisted story and product work, reviewing narrative presentation and preparing distinct visual-novel and audio editions.",
      "decision": "The visual novel is a development prototype. Part One audio is a separate released edition, with its own preview, content and download route.",
      "evidence": "The studio presents actual development imagery and an audio sample. The audio edition includes nine English chapters and an illustrated transcript/guide; it ends on a cliffhanger.",
      "result": "The visual novel remains in development. Part One audio is available on Etsy; Part Two is not included."
    },
    "image": "/projects/alemio-vn.webp",
    "imageAlt": "Actual Princess of Alemio development scene showing Alicia in Kimilar",
    "imageKind": "wide",
    "imageCaption": "Visual-novel development scene",
    "secondaryImage": "/projects/alemio-audio.webp",
    "linkLabel": "View the editions at ONQST",
    "glow": "#b8a8ed",
    "glowSoft": "#b8a8ed33"
  },
  {
    "id": "core-memories",
    "title": "Core Memories",
    "subtitle": "Interactive portfolio · One living forest",
    "description": "One interactive forest connecting project worlds, career chapters and a readable hiring journal.",
    "stack": [
      "React",
      "JavaScript / JSX",
      "Three.js",
      "React Three Fiber",
      "WebGL",
      "GLSL"
    ],
    "color": "#7eddf2",
    "flagship": false,
    "group": "forest",
    "links": {
      "live": null,
      "github": null
    },
    "caseStudy": {
      "challenge": "Offer an expressive way to explore a career without hiding useful information from a recruiter.",
      "contribution": "I shape the visual direction and AI-assisted interactive implementation, bringing project cases, career chapters, experience and CV into one explorable forest.",
      "decision": "Keep direct project, experience and CV navigation available in the same world; provide usable controls when graphics are unavailable.",
      "evidence": "The forest combines project artwork with actual case screenshots and seven career chapters. Keyboard controls, reduced motion and direct journal links support access.",
      "result": "A working interactive portfolio. Project evidence, personal history and both CV variants are available within the same forest."
    },
    "image": "/projects/core-memories-calm-heart.webp",
    "imageAlt": "Actual unified Core Memories portfolio with six project worlds and Unice’s portrait root",
    "imageCaption": "Actual browser preview · one forest for projects, career and CV",
    "glow": "#7eddf2",
    "glowSoft": "#7eddf233"
  },
  {
    "id": "ninja-butler",
    "title": "Ninja Clan / Hermes",
    "subtitle": "Personal automation · Mac-hosted",
    "description": "A private workflow environment connecting tasks, calendar, messaging and curated knowledge.",
    "stack": [
      "Python",
      "Hermes",
      "macOS",
      "APIs",
      "TickTick",
      "Obsidian"
    ],
    "color": "#a78bfa",
    "flagship": false,
    "group": "support",
    "links": {
      "live": null,
      "github": null
    },
    "caseStudy": {
      "challenge": "Keep actions, schedules and project knowledge connected without relying on chat history as a task database.",
      "contribution": "I configure workflows connecting TickTick, Google Calendar, Telegram and curated Obsidian knowledge, document operating boundaries and review AI-assisted changes. The current Hermes runtime is on a Mac; earlier VPS infrastructure is retired.",
      "decision": "Tasks, calendar and durable notes have distinct homes. Consequential external actions require human approval.",
      "evidence": "Workflow documentation and scoped checks support the personal system. Private records are not exposed as a portfolio demo.",
      "result": "A personal operational project, not commercial employment or a public SaaS product."
    },
    "glow": "#a78bfa",
    "glowSoft": "#a78bfa33"
  },
  {
    "id": "unikre",
    "title": "UNIKRE",
    "subtitle": "Commerce · Software and operations",
    "description": "A commerce website and operational support for the Quiet Whiskers Oracle physical deck.",
    "stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Commerce operations"
    ],
    "color": "#f59e0b",
    "flagship": false,
    "group": "support",
    "links": {
      "live": "https://unikre.com.au/",
      "github": null
    },
    "caseStudy": {
      "challenge": "Connect physical-product information, the companion experience and practical fulfilment work.",
      "contribution": "I contribute to the website, product presentation, marketplace listings, marketing preparation, order fulfilment and product-cost review.",
      "decision": "Product information and marketplace purchase links should make the offer and delivery clear.",
      "evidence": "The public site supports the physical product and its existing purchase routes. No personal revenue or ownership metric is claimed.",
      "result": "Public commerce website and operational contributions."
    },
    "image": "/projects/unikre-product-world.jpg",
    "imageAlt": "Quiet Whiskers Oracle physical deck and cards",
    "glow": "#f59e0b",
    "glowSoft": "#f59e0b33"
  }
]
