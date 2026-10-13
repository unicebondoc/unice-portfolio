# Core Memories — one living forest

Unice Bondoc’s hiring portfolio at https://www.unicebondoc.com. One mounted React Three Fiber forest connects six project memories, the central living portrait, six distinct career chapters and a readable field journal. Project selection focuses the camera, lights its tendril and brings the case alongside the world. There is no second forest, map or launch iframe.

The journal contains actual project screenshots, personal contribution, decisions, evidence and release stages. Work, Experience, About, Writing, both CV variants and contact remain directly reachable. The approved pearl-earring/diamond-pendant portrait replaces the gold diamond at the tree heart. Its revised four-second silent loop from the calm, open-eyed tail of the existing generation stays in the central orb. Now combines the approved still photograph with the ONQST role and product-site link; About also retains the approved photograph.

## Source and routes

- `src/pages/ForestPortfolio.jsx`: identity, same-world navigation, journal, journey videos, CV and guide.
- `src/components/scene/PortfolioForestScene.jsx`: one Canvas, original forest texture, actual project media, static tendrils, camera focus, particles, native projected labels and error fallback.
- `src/components/scene/MemoryGlassNode.jsx`: glass shader, pointer reflection, image drift, video colour conversion, bounded loop lifecycle and image fallback.
- `src/components/ui/ProjectDemo.jsx`: user-started native video/audio, captions, transcripts, credit links and playback cleanup.
- `src/data/forestNodes.js`: six scene projects and portrait root, derived from shared project facts.
- `src/data/forestNavigation.js`: URL/deep-link resolution and guide-reference mapping.
- `src/data/projects.js` and `lib/portfolioData.js`: shared cases, experience and bounded guide knowledge.
- `src/data/memories.js`: six career chapters, retained inside the root’s journal.

All Vite entry routes (`/`, `/work/`, `/about/`, `/writing/`) mount the same experience. Existing `#project-*` links open the relevant journal case. `#core-memories` and old story IDs open the journey. `/?embed=1` resolves to this same world for compatibility. Browser Back/Forward restores the selected page/case without rebuilding a separate experience.

Original `App.jsx`, `MemoryOrb`, `FastTrackSite` and the split `PortfolioWorld` remain preserved source, but are not selected by the current entrypoint. Earlier release receipts record their historical deployment.

## Access and performance

- Project names stay visible on native focusable buttons; graphics are an additional interaction surface.
- Journal dialogs support ordinary scrolling, Escape, focus trapping and trigger return.
- Mobile uses unique slots and scales the constellation to viewport height. No 1200px minimum width.
- Reduced motion stops camera pan/zoom, idle sway, ripples and particle loops; the renderer uses demand frames.
- Static tendril geometry is memoized; no React updates or geometry recreation every animation frame.
- Texture/renderer/context failures retain project names, thumbnails and the same hiring journal.
- Journey uses personal photos for Origin, Operations and The Leap, the complete graduation video for Research, actual project previews for Projects, and the approved portrait with the ONQST role and product-site link for Now. Research loads on explicit Play with native controls, a full-frame poster and original sound. Earlier illustrated story videos remain archived assets. No new journey video or audio was generated. Portrait and short project-orb loops stay muted; reduced motion in Display settings keeps still posters. FlatSync’s opened case has the full approved 27-second narrated demo, native controls, English captions and transcript. Alemio’s case has the existing 2m58 audio edition sample with transcript, attribution and complete credits. Both begin only on explicit Play. Steeped uses its existing silent gameplay excerpt: source film rules prohibit exporting the recorded sound from this Mac. Sound players pause when their media/control area leaves view or the tab hides, never resume automatically, and unmount when a case closes. Only one DOM recording plays at once; silent orb textures remain separate. Playback failures offer the file link and retain the journal/forest.
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

Original forest atmosphere and historical story videos are reused. Current orbs show actual project screenshots and bounded source-recording excerpts, including PH-first fictional LandLIT data, the CauseConnect sample frontend and Steeped r13j gameplay. Four still previews move through a subtle glass shader; they are not represented as recorded product interactions. The original portrait video was generated once in Google Flow under the owner-approved photograph destination and12-credit limit. After the owner rejected its acting, the current quiet four-second loop was edited locally from its open-eyed tail; no further generation or credits were used. Branches and particles render behind opaque media interiors; dimming changes brightness rather than making the portrait transparent. Real-media provenance is in `design-assets/living-archive/media-sources.json`. Tyche remains in `public/world/`; retired miniature-world art, masters and generation receipts are retained as history.

Vercel project: `unicebondocs-projects/unice-portfolio`. Verify the linked project before consequential operations. Dated Career handoffs distinguish local build, browser checks, owner feedback and current publication. No public feed post, application or outreach is implied by a site update.
