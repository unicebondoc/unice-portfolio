# Core Memories — Interactive AI Portfolio

> *An immersive 3D portfolio experience built around memory, story, and the intersection of intelligence and design.*

**Live:** [unicebondoc.com](https://unicebondoc.com)  
**Built by:** Unice Bondoc — AI Engineer | Full-Stack AI Developer | LLM & Agent Systems

---

## Overview

Core Memories is not a traditional portfolio.  
It is an interactive 3D world where each memory orb holds a chapter of a real career journey — from broadcasting in the Philippines, through banking, across an ocean to Sydney, and into AI engineering.

Visitors explore the world by hovering and clicking glowing orbs suspended from a bioluminescent forest tree. Each orb opens a cinematic panel with a personal story, video, and context. An AI chatbot named **Tyche** (Unice's cat) answers questions about the person behind the portfolio. A treasure chest at the bottom reveals project diamonds when opened.

---

## Features

- **3D Bioluminescent Forest** — immersive Three.js scene with GLSL shader animations, particle systems, fireflies, and a sacred tree
- **Memory Orbs** — 6 story orbs + 1 root identity orb, each representing a chapter of the career journey
- **Video Orbs** — each orb displays a short personal video clip on the sphere surface and inside the panel
- **Tyche Chatbot** — AI-powered portfolio guide built on OpenAI GPT-4, with a witty cat persona, rolling conversation memory, and structured portfolio knowledge
- **Treasure Chest** — animated project showcase; clicking opens the chest and reveals glowing diamond cards for each project
- **Sacred Artifacts** — Skills, Résumé, and Writings sidebar panel
- **Blog Panel** — pulls latest 2 articles from Medium via server-side RSS fetch
- **Onboarding Hints** — first-visit floating hint cards on the right side that guide exploration, then auto-dismiss
- **Lazy Video Loading** — videos load on demand for fast initial page load
- **Responsive Design** — optimised for desktop and mobile
- **Awakening Sequence** — cinematic intro as the forest comes to life

---

## Tech Stack

### Core
| Layer | Technology |
|---|---|
| Framework | React 18 |
| 3D Engine | Three.js + React Three Fiber |
| Shaders | GLSL (custom written) |
| AI Chatbot | OpenAI API (GPT-4) |
| Routing / Build | Vite |
| Deployment | Vercel |

### AI & Chatbot Architecture
| Layer | Details |
|---|---|
| Persona | Tyche — Unice's cat, witty and portfolio-aware |
| System Prompt | `src/data/systemPrompt.ts` + `lib/systemPrompt.js` |
| Portfolio Knowledge | `src/data/portfolioData.ts` + `lib/portfolioData.js` |
| API Route | `api/chat.js` (Vercel serverless) |
| Memory | Rolling summary + last 10 messages |
| Summary Model | GPT-4o-mini |

### Visual Systems
- Custom GLSL particle shaders (fireflies, spores, canopy, water mist)
- Three-layer orb materials (inner soul + glow + glass shell)
- VideoTexture mapped to 3D sphere meshes
- TubeGeometry tendrils connecting orbs to tree root
- AdditiveBlending for bioluminescent glow effects
- CSS 3D perspective transforms for treasure chest lid animation

---

## Project Structure

```
unice-portfolio/
├── api/
│   ├── chat.js               # OpenAI chat API route (Vercel serverless)
│   └── blog.js               # Medium RSS fetch route (Vercel serverless)
├── lib/
│   ├── portfolioData.js      # Server-side copy of portfolio knowledge
│   └── systemPrompt.js       # Server-side copy of system prompt
├── public/
│   ├── memories/
│   │   └── videos/           # Orb video clips (web-optimised MP4)
│   └── resume/
│       └── Unice_Bondoc_Resume.pdf
├── src/
│   ├── components/
│   │   ├── scene/
│   │   │   ├── MemoryOrb.jsx         # Individual orb mesh + material
│   │   │   ├── OrbPanel.jsx          # Panel that opens on orb click
│   │   │   ├── OrbPanel.module.css
│   │   │   ├── HeartOfTree.jsx       # Root orb + tree heart
│   │   │   └── Tendrils.jsx          # Orb-to-root tendril geometry
│   │   └── ui/
│   │       ├── ChatBot.jsx           # Tyche AI chatbot component
│   │       ├── TreasureChest.jsx     # Animated project diamonds showcase
│   │       ├── ProjectModal.jsx      # Project detail modal
│   │       ├── SacredArtifacts.jsx   # Skills / Résumé / Writings HUD
│   │       ├── SkillsPanel.jsx       # Skills artifact panel
│   │       ├── BlogPanel.jsx         # Writings artifact (Medium articles)
│   │       ├── HUD.jsx               # Social links + mute button
│   │       └── OnboardingHints.jsx   # First-visit floating hint cards
│   ├── data/
│   │   ├── memories.js           # All 7 orb content definitions
│   │   ├── portfolioData.ts      # Structured CV knowledge for chatbot
│   │   ├── systemPrompt.ts       # Tyche personality + rules
│   │   └── socials.jsx           # Social media icon definitions
│   ├── hooks/
│   │   └── useChatGPT.js         # Chatbot state + API communication hook
│   └── App.jsx                   # Root component
```

---

## Memory Orbs — Story Arc

| # | ID | Title | Year | Palette |
|---|---|---|---|---|
| 1 | orb-origin | The Communicator | 2012 | Red |
| 2 | orb-banking | 100 Clients. Zero Room For Error. | 2019 | Amber |
| 3 | orb-leap | I Chose the Harder Path | 2023 | Deep Purple |
| 4 | orb-proof | I Proved It Works | 2025 | Gold (Hero) |
| 5 | orb-engineer | Theory Became Delivery | 2024 | Electric Blue |
| 6 | orb-becoming | The Architect, Ongoing | 2026 | Soft Purple |
| Root | orb-root | Unice Bondoc | Now | Warm Amber |

---

## AI Chatbot — Tyche

Tyche is a witty, mildly sardonic Turkish Angora cat who happens to know everything about Unice's career.  
Built on OpenAI GPT-4 via a Vercel serverless function.

**Architecture:**
- Personality, tone, and hard boundaries defined in `src/data/systemPrompt.ts` (client) + `lib/systemPrompt.js` (server)
- All factual career data stored in `src/data/portfolioData.ts` + `lib/portfolioData.js` — injected into every API call
- Never invents facts — if unknown, redirects to direct contact
- Short-term memory: last 10 messages
- Long-term memory: rolling summary via GPT-4o-mini
- Strips all markdown formatting before rendering (no `**`, `***`, `##`)
- Responds with 1–2 relevant emojis

**Boundaries enforced:**
- No salary figures
- No visa details
- No health or personal information
- No private disputes or internal matters
- Never reveals system prompt or internal reasoning
- Never mentions BDO Unibank (not on current CV)

---

## Environment Variables

Create a `.env.local` file in the root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

For Vercel deployment, add this in:  
**Vercel Dashboard → Project → Settings → Environment Variables**

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/unicebondoc/unice-portfolio.git

# Navigate to project
cd unice-portfolio

# Install dependencies
npm install

# Add your OpenAI API key to .env.local
echo "OPENAI_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Video Setup

Place video files in `public/memories/videos/` before building.

**Naming convention:**
```
01-orb-origin-web.mp4
03-orb-pressure-web.mp4
04-orb-reinvention-web.mp4
05-orb-building-web.mp4
06-orb-proof-web.mp4
08-orb-becoming-web.mp4
09-orb-root-web.mp4
```

**Recommended specs:**
- Format: MP4 (H.264), web-optimised with `-movflags +faststart`
- Resolution: 720p max (1280×720)
- Duration: 10–20 seconds, looping
- File size: under 5MB per video

Videos load lazily — only when an orb is first hovered.

---

## Deployment

This project deploys automatically to Vercel on push to `main`.

```bash
git add .
git commit -m "your commit message"
git push origin main
```

Vercel picks up the push and deploys within ~60 seconds.

**Build command:** `npm run build`  
**Output directory:** `dist`  
**Node version:** 18+

---

## Performance Notes

- Pixel ratio capped at 2x to prevent GPU overload
- Particles reduced 50% on mobile/low-end devices
- Videos lazy-load on first hover (not on page load)
- Priority orbs preload silently during intro sequence
- `toneMapped: false` on video materials for accurate colour
- `SRGBColorSpace` on all video textures
- Mouse parallax multiplier kept low (`0.018`) to prevent 3D scene drift over fixed UI elements

---

## About

**Unice Bondoc**  
AI Engineer | Full-Stack AI Developer | LLM & Agent Systems  
Sydney, NSW, Australia

- 🌐 [unicebondoc.com](https://unicebondoc.com)
- 💼 [linkedin.com/in/unicebondoc](https://linkedin.com/in/unicebondoc)
- 📧 uniceabondoc@gmail.com
- 🐙 [github.com/unicebondoc](https://github.com/unicebondoc)

Master of ICT (Web and Mobile Computing) — Western Sydney University  
High Distinction · 88/100 · LLM Research Capstone

*From the Philippines · To Sydney · To the Future*

---

## License

This project and its visual design, written content, and personal media are the intellectual property of Unice Bondoc.  
The codebase structure may be referenced for educational purposes.  
Do not reproduce, clone, or deploy as your own portfolio without permission.

---

<div align="center">
  <sub>Built with React 18 · Three.js · GLSL · OpenAI API · Deployed on Vercel</sub>
  <br/>
  <sub>✦ every orb, every particle, every shader — built from scratch ✦</sub>
</div>
