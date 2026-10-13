# Core Memories — one living forest

Unice Bondoc’s hiring portfolio at https://www.unicebondoc.com. One mounted React Three Fiber forest connects six project memories, the portrait root, all seven career chapters and a readable field journal. Project selection focuses the camera, lights its tendril and brings the case alongside the world. There is no second forest, map or launch iframe.

The journal contains actual project screenshots, personal contribution, decisions, evidence and release stages. Work, Experience, About, Writing, both CV variants and contact remain directly reachable. The approved pearl-earring/diamond-pendant portrait appears at the roots and in About.

## Source and routes

- `src/pages/ForestPortfolio.jsx`: identity, same-world navigation, journal, journey videos, CV and guide.
- `src/components/scene/PortfolioForestScene.jsx`: one Canvas, original forest texture, project art, static tendrils, camera focus, particles, native projected labels and error fallback.
- `src/data/forestNodes.js`: six scene projects and portrait root, derived from shared project facts.
- `src/data/forestNavigation.js`: URL/deep-link resolution and guide-reference mapping.
- `src/data/projects.js` and `lib/portfolioData.js`: shared cases, experience and bounded guide knowledge.
- `src/data/memories.js`: seven career chapters, retained inside the root’s journal.

All Vite entry routes (`/`, `/work/`, `/about/`, `/writing/`) mount the same experience. Existing `#project-*` links open the relevant journal case. `#core-memories` and old story IDs open the journey. `/?embed=1` resolves to this same world for compatibility. Browser Back/Forward restores the selected page/case without rebuilding a separate experience.

Original `App.jsx`, `MemoryOrb`, `FastTrackSite` and the split `PortfolioWorld` remain preserved source, but are not selected by the current entrypoint. Earlier release receipts record their historical deployment.

## Access and performance

- Project names stay visible on native focusable buttons; graphics are an additional interaction surface.
- Journal dialogs support ordinary scrolling, Escape, focus trapping and trigger return.
- Mobile uses unique slots and scales the constellation to viewport height. No 1200px minimum width.
- Reduced motion stops camera pan/zoom, idle sway, ripples and particle loops; the renderer uses demand frames.
- Static tendril geometry is memoized; no React updates or geometry recreation every animation frame.
- Texture/renderer/context failures retain project names, thumbnails and the same hiring journal.
- Story videos load on request, have native controls and do not autoplay; leaving the chapter unmounts its player.
- Navigation is available while the forest loads. There is no forced 2.5-second wait.
- Tyche chat is loaded on demand. Story references highlight the portrait root; project references map to validated scene nodes. Provider response generation remains an existing server feature.
- Exploration progress lasts for the mounted page and has no account or persistent tracking.

## Facts and CVs

ACS WIL remains first in relevant experience: Developer / Programmer, internship team of ten, July 2026–present. ONQST is Founder & Builder. UNIKRE Trading is Software Engineer (Internship), November 2024–January 2025, distinct from later commerce contributions. Banking is brief supporting history and does not lead the identity.

Canonical editable CVs are in `public/resume/`. Run `npm run resume:pdf`, inspect both two-page exports, then synchronize shared/Career mirrors and the canonical resume manifest. The Graduate_Software HTML/PDF filename is a byte-identical compatibility alias to Software_Development. No CV export was changed by this unified-world iteration.

## Local development and art

```sh
npm install
npm run dev
npm run test:content
npm run build
```

Original forest atmosphere and story videos are reused. The miniature-world art and Tyche are served from `public/world/`; their PNG masters, exact generation prompts and hash/dimension receipt remain in `design-assets/living-archive/`. The rejected split-grove artwork is retained as history. Illustrations are atmosphere, not fabricated product evidence; actual screenshots remain in the journal.

Vercel project: `unicebondocs-projects/unice-portfolio`. Verify the linked project before consequential operations. Dated Career handoffs distinguish local build, browser checks, owner feedback and current publication. No public feed post, application or outreach is implied by a site update.
