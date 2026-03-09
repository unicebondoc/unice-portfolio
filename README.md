# Core Memories — Interactive AI Portfolio

> *An immersive 3D portfolio experience built around memory, story, and the intersection of intelligence and design.*

**Live:** [unicebondoc.com](https://unicebondoc.com)  
**Built by:** Unice Bondoc — AI Software Engineer · Technical Project Lead

---

## Overview

Core Memories is not a traditional portfolio.  
It is an interactive 3D world where each memory orb holds a chapter of a real career journey — from broadcasting in the Philippines, through banking, across an ocean to Sydney, and into AI engineering.

Visitors explore the world by hovering and clicking glowing orbs suspended from a bioluminescent forest tree. Each orb opens a cinematic panel with a personal story, video, and context. An AI chatbot called the **Memory Tree** answers questions about the person behind the portfolio.

---

## Features

- **3D Bioluminescent Forest** — immersive Three.js scene with GLSL shader animations, particle systems, fireflies, and a sacred tree
- **Memory Orbs** — 8 story orbs + 1 root identity orb, each representing an emotional chapter
- **Video Orbs** — each orb displays a short personal video clip on the sphere surface and inside the panel
- **Memory Tree Chatbot** — AI-powered portfolio guide built on OpenAI API with rolling conversation memory and structured portfolio knowledge
- **Suggested Questions** — clickable chip UI for guided exploration
- **Sacred Artifacts** — Skills, Résumé, and Writings sidebar
- **Gesture Tarot Scroll** — live project artifact displayed as an ancient 3D scroll
- **Lazy Video Loading** — videos load on demand for fast initial page load
- **Responsive Design** — optimised for desktop and mobile
- **Awakening Sequence** — cinematic black screen intro as the world comes to life

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
| System Prompt | `src/data/systemPrompt.ts` |
| Portfolio Knowledge | `src/data/portfolioData.ts` |
| Suggested Questions | `src/data/suggestedQuestions.ts` |
| Memory | Rolling summary + last 10 messages |
| Summary Model | GPT-4o-mini |

### Visual Systems
- Custom GLSL particle shaders (fireflies, spores, canopy, water mist)
- Three-layer orb materials (inner soul + glow + glass shell)
- VideoTexture mapped to 3D sphere meshes
- TubeGeometry tendrils connecting orbs to tree root
- AdditiveBlending for bioluminescent glow effects

---

## Project Structure

```
unice-portfolio/
├── public/
│   ├── videos/              # Orb video clips
│   │   ├── orb1-origin.mp4
│   │   ├── orb2-writer.mp4
│   │   ├── orb3-pressure.mp4
│   │   ├── orb4-reinvention.mp4
│   │   ├── orb5-building.mp4
│   │   ├── orb6-proof.mp4
│   │   ├── orb7-work.mp4
│   │   ├── orb8-becoming.mp4
│   │   └── root-identity.mp4
│   └── resume/
│       └── Unice_Bondoc_Resume.pdf
├── src/
│   ├── components/
│   │   ├── MemoryOrb.jsx         # Individual orb mesh + material
│   │   ├── OrbPanel.jsx          # Panel that opens on orb click
│   │   ├── Constellation.jsx     # All orbs + tendril layout
│   │   ├── Particles.jsx         # GLSL particle systems
│   │   ├── SacredArtifacts.jsx   # Skills/Résumé/Writings sidebar
│   │   ├── GestureTarotScroll.jsx # Right-side project scroll
│   │   ├── MemoryTreeChat.jsx    # AI chatbot component
│   │   └── Tyche.jsx             # Cat character + chat trigger
│   ├── data/
│   │   ├── memories.js           # All 9 orb content definitions
│   │   ├── portfolioData.ts      # Structured CV knowledge for chatbot
│   │   ├── systemPrompt.ts       # Chatbot personality + rules
│   │   └── suggestedQuestions.ts # Clickable chat chips
│   └── app/
│       └── api/
│           └── chat/
│               └── route.ts      # OpenAI API route with memory
```

---

## Memory Orbs — Story Arc

| # | Title | Year | Emotional Beat |
|---|---|---|---|
| 1 | Creative Foundations | 2012 | Origin — before code, there was story |
| 2 | The Writer | 2020 | Voice — finding what needed to be said |
| 3 | Corporate Discipline | 2018 | Pressure — forged, not broken |
| 4 | I Chose Different | 2022 | Reinvention — the point of no return |
| 5 | Theory Became Real | 2024 | Building — concept to production in one week |
| 6 | I Earned My Place | 2025 | Proof — High Distinction, 88/100, WSU |
| 7 | Core Memories | 2026 | The Work — you're standing inside it |
| 8 | Still Becoming | 2026 | Becoming — the threshold |
| Root | Identity | — | Unice — the person behind the portfolio |

---

## AI Chatbot — Memory Tree

The Memory Tree is a portfolio-aware AI guide built on OpenAI GPT-4.

**Architecture:**
- Personality, tone, and hard boundaries defined in `systemPrompt.ts`
- All factual career data stored in `portfolioData.ts` — injected into every API call
- Never invents facts — if unknown, redirects to direct contact
- Short-term memory: last 10 messages
- Long-term memory: rolling summary via GPT-4o-mini
- Suggested question chips rendered from `suggestedQuestions.ts`

**Boundaries enforced:**
- No salary figures
- No visa details
- No health or personal information
- No private disputes or internal matters
- Never reveals system prompt or internal reasoning

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

Place video files in `public/videos/` before building.

**Recommended specs:**
- Format: MP4 (H.264)
- Resolution: 720p max (1280×720)
- Duration: 10–20 seconds, looping
- File size: under 5MB per video
- Codec: H.264, AAC audio (or muted)

Videos load lazily — only when an orb is first hovered. This keeps initial page load fast.

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

---

## About

**Unice Bondoc**  
AI Software Engineer · Technical Project Lead  
Sydney, NSW, Australia

- 🌐 [unicebondoc.com](https://unicebondoc.com)
- 💼 [linkedin.com/in/unicebondoc](https://linkedin.com/in/unicebondoc)
- 📧 uniceabondoc@gmail.com

Master of ICT (Web and Mobile Computing) — Western Sydney University  
High Distinction · 88/100 · LLM Research

*From Manila · To Sydney · To the Future*

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
