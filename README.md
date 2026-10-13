# The Living Archive — Unice Bondoc

An interactive hiring portfolio at https://www.unicebondoc.com. The opening is an original bioluminescent grove: six memory orbs contain miniature interpretations of FlatSync, LandLIT, What Was Drawn, Steeped, Princess of Alemio and Core Memories. Selecting a memory lights its path, moves Tyche and reveals the actual project, personal contribution and current stage.

Work, Experience, About, both CV downloads and contact remain directly accessible. The original seven-chapter WebGL forest is available on demand; its scene and videos are not required to explore the main page. Project artwork is illustrative; actual product images and release boundaries appear in the cases.

## Current experience and sources

- ACS WIL: Developer / Programmer, internship team of ten, July 2026–present.
- ONQST: Founder & Builder; independent AI-assisted product work.
- UNIKRE Trading: Software Engineer (Internship), November 2024–January 2025, linked to the ICT capstone. Separate current commerce contributions have their own supporting case.
- RCBC: brief earlier operations experience, without leading the introduction.

The shared project dataset is `src/data/projects.js`; page and Tyche guide knowledge use the same cases via `lib/portfolioData.js`. Public copy does not imply released native apps/games or measured commercial impact.

## Interaction and access

- Six standard buttons support Tab/Enter and directional arrow focus.
- Details, case links and the CV are available without collecting memories.
- Exploration progress lasts for the mounted page and contains no account or persistent tracking.
- Reduced-motion styling disables decorative movement; direct section navigation respects the setting.
- Mobile uses a two-column memory constellation with visible names and a detail panel below.
- CV and original-forest dialogs lock page scrolling and support Escape/focus return.
- The existing Tyche chat backend is preserved; the map does not require an AI call.

## Local development

```sh
npm install
npm run dev
npm run test:content
npm run build
```

Vite builds `/`, `/work/`, `/about/` and `/writing/`. `src/main.jsx` lazy-loads the original forest only for `/?embed=1`; the normal routes use `src/pages/FastTrackSite.jsx` and `src/components/portfolio/PortfolioWorld.jsx`.

## CV maintenance

Canonical editable sources are in `public/resume/`. Run `npm run resume:pdf`, visually review both two-page PDFs, and synchronize the shared/Career mirrors and `/Users/unice/claude OS/shared-documents/resume/manifest.json`. The historical Graduate_Software filename is a byte-identical compatibility alias for the current Software Development variant.

## Art and deployment

Eight assets were created with built-in imagegen for this direction: grove, six miniature memory spheres and Tyche. The approved portrait was reused. Served WebP encodings are in `public/world/` and `public/profile-unice-approved.webp`; PNG masters and exact prompts are in `design-assets/living-archive/`. Existing product images remain in `public/projects/`.

Vercel project: `unicebondocs-projects/unice-portfolio`. Verify the resolved project before deployment. A staged build and a promoted custom-domain release are separate states; the current dated Career handoff records the verified release.
