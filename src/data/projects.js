import { PROJECT_GUIDES } from './projectGuides.js'
import { EDITING_SAMPLES } from './editingSamples.js'

const TRANSCRIPT_FLATSYNC = [
  "Always the one reminding the house?",
  "Make it a team thing with FlatSync.",
  "Share the chores, and see who's doing what.",
  "Keep one shopping list, so everyone knows what's needed.",
  "Record shared costs, and see who owes whom.",
  "Payments happen outside the app.",
  "A little less chasing. A lot more living.",
  "Try the free web app, and install it from your browser."
]

const TRANSCRIPT_LANDLIT = [
  "LandLIT connects rental records, balances and next decisions. This is a fictional Philippine demo.",
  "A property links to its tenancies, rent terms and account balances.",
  "Agreement metadata stays connected to the relevant tenancy. No private contract is shown.",
  "Unit 202 has ₱22,000 charged, ₱11,000 recorded and ₱11,000 remaining.",
  "A fictional ₱5,500 receipt reduces the balance to ₱5,500 and updates the reminder draft.",
  "Recording the remaining balance brings it to ₱0. The reminder is suppressed; no message is sent.",
  "Reports offer clearly labelled fictional CSV and JSON exports, alongside the sample action history.",
  "These actions change only this browser tab’s sample data. Reload resets the demo. No money or message is sent."
]

const TRANSCRIPT_ALEMIO = [
  "Narrator: The Sacrifice: Princess of Alemio. Written by Unice Bondoc. Part One: The Fallen Kingdom.",
  "Narrator: Chapter One. The Door in Kimilar.",
  "Narrator: Alicia stepped through the portal into a quiet park. The portal closed behind her. It was evening. A man was sitting on a bench nearby. When he saw her, he gripped the edge of the bench. His lips parted. For a moment, no words came.",
  "Malcolm: Excuse me.",
  "Narrator: He got to his feet so quickly that Alicia stepped back. He stopped at once, leaving the path between them.",
  "Alicia: Do I know you?",
  "Narrator: He looked as though he was about to answer. Then his eyes dropped to the ground. He took a slow breath.",
  "Malcolm: No.",
  "Narrator: She felt as though she knew him, but she couldn't remember meeting him. Neither of them spoke for a moment.",
  "Alicia: Are you sure? You looked surprised to see me.",
  "Malcolm: That portal hasn't opened in a year.",
  "Alicia: A year?",
  "Narrator: Alicia looked back. There was only a stone arch with ivy growing over it. She could see a wall through the gap where the light had been. A moment ago, she had been somewhere else. She was certain of that much.",
  "Alicia: There was a room. I was standing beside a door like that one.",
  "Malcolm: What happened before that?",
  "Narrator: She tried to remember how she had reached the room. Nothing came. Not the way in. Not the day before. She looked at him again. His coat was worn at the elbows, and there was mud on his boots. He was waiting for an answer she could not give him.",
  "Alicia: Where am I?",
  "Malcolm: Kimilar. That's the town hall behind you.",
  "Narrator: She turned far enough to read the name above the entrance, keeping him in sight. Kimilar. The letters were easy to understand. The place meant nothing to her. She knew how to read, how to speak, how to be careful with a stranger. Why couldn't she remember where she lived?",
  "Alicia: Can the portal take me back?",
  "Malcolm: It connects this park to the palace in Alemio. But a strange storm has cut off the kingdom. I don't know how to open it from here.",
  "Narrator: She reached up and pressed her hand against the stone. Nothing happened. Her robe slipped aside, showing the gold handle of a sword at her hip. She knew its weight before she looked down. Her fingers found the handle without searching.",
  "Malcolm: You should cover the gold before you go into town.",
  "Alicia: Why?",
  "Malcolm: Someone might try to take it.",
  "Narrator: She pulled her robe over the sword. He hadn't stepped closer. His worn pack still rested against the bench.",
  "Malcolm: There's a guesthouse in the town centre, next to the guard post. The guards watch that area all night. I can show you.",
  "Alicia: But you are a stranger."
]

// Shared public facts for the hiring page, forest and AI guide.
export const PROJECTS = [
  {
    id: 'video-editing',
    title: 'Unicey & Kretchy · Video Editing',
    subtitle: 'Personally edited published videos · Independent channel work',
    description: 'Short video stories shaped through editing, alongside my broadcasting and interactive-media practice.',
    stack: ['Video editing', 'CapCut'],
    color: '#f2c997',
    flagship: false,
    group: 'media',
    links: { live: 'https://www.youtube.com/@uniceyandkretchy', github: null },
    linkLabel: 'Visit the channel',
    mediaSamples: EDITING_SAMPLES,
    caseStudy: {
      challenge: 'Turn an outing into a short, coherent video with a point of view and an enjoyable sequence.',
      contribution: 'I personally edited these Unicey & Kretchy videos in CapCut. These original channel edits are distinct from the AI-assisted studio demos elsewhere in this portfolio.',
      decision: 'Give the viewer a clear subject and a sense of progression. The original published videos let you assess the editing directly.',
      evidence: 'Two selected public videos are linked here, alongside the original channel. My Bachelor of Communication in Broadcasting provides the educational foundation for this work.',
      result: 'Independent published editing samples. They are personal portfolio work, with no paid-client or studio-employment claim.',
    },
  },
  {
    "id": "causeconnect",
    "title": "CauseConnect",
    "subtitle": "ACS WIL internship · Developer / Programmer",
    "description": "A campaign-discovery application developed with a ten-person ACS internship team. July 2026–present.",
    "stack": [
      "React",
      "JavaScript",
      "Node.js",
      "Express",
      "MySQL",
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
      "contribution": "I contributed React interfaces and Node.js/Express APIs for authenticated creation, photo access, owner changes, participation, enquiries and admin controls, with MySQL persistence and validation, building on the team's backend work.",
      "decision": "The server assigns campaign ownership and pending status; client input cannot override them.",
      "evidence": "Merged and deployed work includes backend/integration checks and a verified browser journey from community submission through private review to approved public photo display.",
      "result": "Community workflows are merged into the team repository and deployed. The preview shown here uses sample data. This is a team contribution, not sole ownership of the application. Business posting still needs profile integration; final team testing, manuals and video remain open."
    },
    "image": "/projects/causeconnect-sample.webp",
    "imageAlt": "Actual CauseConnect hosted homepage with fictional campaign data",
    "imageKind": "dashboard",
    "imageCaption": "Hosted frontend preview · fictional campaign data",
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
      "contribution": "I built React/TypeScript chore, shopping and bill interfaces, Supabase Edge household APIs, PostgreSQL membership and save-receipt logic, and expense/repayment and recurrence rules.",
      "decision": "Household membership and money calculations need explicit rules; accessible feedback must explain a failed or conflicting update.",
      "evidence": "Regression coverage checks bill calculations, conflicting edits and keyboard-accessible interactions. The public web app is available to try.",
      "result": "Public web access is available. Native iOS and Android releases remain pending."
    },
    "demo": {
      "src": "/projects/flatsync-narrated-demo.mp4",
      "poster": "/projects/flatsync-narrated-poster.png",
      "caption": "Narrated web preview · 27 seconds · native releases pending",
      "hasAudio": true,
      "captions": "/projects/flatsync-narrated-demo.vtt",
      "transcript": TRANSCRIPT_FLATSYNC,
      "disclosure": "Example household · Illustrated clay scenes · Synthetic narration · Original FlatSync music. Payments happen outside the app.",
      "credits": "/projects/flatsync-demo-credits.txt"
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
      "PostgreSQL"
    ],
    "color": "#f29b83",
    "flagship": true,
    "group": "featured",
    "links": {
      "live": "https://landlit-preview.vercel.app/#demo",
      "github": null
    },
    "caseStudy": {
      "challenge": "Keep contracts, rent records, utility allocations and monthly exports connected rather than scattered across separate documents.",
      "contribution": "I built the Next.js/React/TypeScript property workspace, authenticated APIs, PostgreSQL financial records, utility allocation and correction logic, and document/export recovery features.",
      "decision": "A recorded receipt is not the same as a processed payment. Demo data, prepared actions and real customer operations stay clearly separated.",
      "evidence": "Checks cover linked financial records, workspace permissions, persistence and encrypted recovery. The public showcase uses fictional data and does not transact; final cloud document-storage and recovery verification remains in progress.",
      "result": "A fictional public showcase and protected Philippine manual-beta deployment exist. Signup is closed; onboarding for real customers remains pending."
    },
    "demo": {
      "src": "/projects/landlit-demo.mp4",
      "poster": "/projects/landlit-demo-poster.webp",
      "aspectRatio": "16 / 9",
      "caption": "Recorded web demo · 60 seconds · fictional Philippine data",
      "hasAudio": false,
      "captions": "/projects/landlit-demo.vtt",
      "transcript": TRANSCRIPT_LANDLIT,
      "disclosure": "Actual interface recording with sample records. Changes reset on reload; no money or message is sent. Silent, with English captions and a transcript. Backend implementation is described separately below.",
      "credits": "/projects/landlit-demo-credits.txt"
    },
    "video": "/projects/landlit-demo-loop.mp4",
    "videoCaption": "Actual fictional-data receipt workflow · silent excerpt",
    "image": "/projects/landlit-ph-demo.webp",
    "imageAlt": "Actual LandLIT Philippine fictional-data demo dashboard",
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
      "contribution": "I built the React/Capacitor reading interface, account-scoped Supabase journal and optional camera interactions. The production billing API migrated from Railway to AWS Lambda and API Gateway with the public domain preserved.",
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
      "contribution": "I implemented Unity/C# focus-session and tea-interaction logic, cup/visit checkpoints, atomic JSON save replacement and backup recovery, preserving existing progress through the fixes.",
      "decision": "Qualify the exact build and its save behaviour before expanding release claims; scripted checks and creative acceptance answer different questions.",
      "evidence": "The tested local r13j owner preview has Mac and simulator checks covering sessions, recovery and story state. Physical-device and owner creative acceptance remain separate.",
      "result": "A tested local preview is available for owner review. Public game release and store acceptance remain pending."
    },
    "image": "/projects/steeped-gameplay.webp",
    "imageAlt": "Actual Steeped r13j tea-making gameplay preview",
    "imageKind": "wide",
    "imageCaption": "Actual r13j gameplay · development preview · release acceptance pending",
    "demo": {
      "src": "/projects/steeped-gameplay-loop.mp4",
      "caption": "Silent gameplay preview · development build · release pending",
      "hasAudio": false
    },
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
      "Ren’Py",
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
      "contribution": "I write the story and build the Ren’Py dialogue, choice, evidence, history and save/load interfaces, along with scene/audio preparation and the separate audio edition’s transcript, credits and delivery package.",
      "decision": "The visual novel is a development prototype. Part One audio is a separate released edition, with its own preview, content and download route.",
      "evidence": "The studio presents actual development imagery and an audio sample. The audio edition includes nine English chapters and an illustrated transcript/guide; it ends on a cliffhanger.",
      "result": "The visual novel remains in development. Part One audio is available on Etsy; Part Two is not included."
    },
    "image": "/projects/alemio-vn.webp",
    "imageAlt": "Actual Princess of Alemio development scene showing Alicia in Kimilar",
    "imageKind": "wide",
    "imageCaption": "Visual-novel development scene",
    "secondaryImage": "/projects/alemio-audio.webp",
    "audioPreview": {
      "src": "/projects/alemio-audio-preview.mp3",
      "title": "Princess of Alemio · Audio edition",
      "caption": "Part One audio drama · Opening excerpt · 2 minutes 58 seconds",
      "transcript": TRANSCRIPT_ALEMIO,
      "disclosure": "A separate audio edition from the visual novel. Original synthetic voices; the opening sample includes its published music and sound mix.",
      "attribution": "Music: Beautiful Oblivion by Scott Buckley, CC BY 4.0. Sound effects: Sword Clash and Sword Clash 2 by Gravity Sound, CC BY 4.0; complete sources and changes in the credits.",
      "credits": "/projects/alemio-audio-credits.txt"
    },
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
      "evidence": "The forest combines project artwork with actual case screenshots and six career chapters. Keyboard controls, reduced motion and direct journal links support access.",
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
].map(project => PROJECT_GUIDES[project.id] ? { ...project, guide: PROJECT_GUIDES[project.id] } : project)
