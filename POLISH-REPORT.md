# Final Polish — Implementation Report

## 1. Files inspected

- **App.jsx** — vignette, overlays, left lane, bottom bar, hover glow, SpiralGroup, OrbParticles usage
- **src/components/scene/MemoryOrb.jsx** — orb rendering, hover state, halo/glow/ripple, scale, labels, interactive vs ambient
- **src/data/memories.js** — orb positions, `isPrimary`, `orbType`, `visualTier`, layout
- **src/components/scene/OrbPanel.jsx** — panel layout, content, video/thumbnail
- **src/components/scene/OrbPanel.module.css** — panel size, spacing, typography, rim, hints
- **src/components/scene/Tendrils.jsx** — connection lines, hover/selected opacity
- **src/components/scene/OrbParticles.jsx** — per-orb particles, hover/selected boost
- **src/components/ui/OrbLabel.jsx** — not used in main scene; labels live inside MemoryOrb (Html)

---

## 2. Files changed

| File | Changes |
|------|---------|
| **App.jsx** | Vignette and overlays reduced; hover glow made subtler and smaller; bottom bar gradient softened; OrbParticles skipped for ambient orbs |
| **MemoryOrb.jsx** | Hover scale pulse reduced (1.08→1.04); non-video orb aura/core hover response reduced; ripple ring: 1 cycle, lower opacity |
| **OrbParticles.jsx** | Hover/selected boost reduced (speed 2.2→1.4, radius 0.45→0.40, opacity 1.25→1.08) |
| **OrbPanel.jsx** | Panel diameter reduced; single bottom hint; in-panel video block when `videoSrc` exists |
| **OrbPanel.module.css** | Panel size variable; tighter vertical spacing; smaller type; single `.releaseHint`; `.panelVideoWrap` / `.panelVideo` for in-panel video; rim/glass tweaks |

---

## 3. Vignette and how it was reduced

- **Left UI lane** (App.jsx): Radial gradient 0.28→0.22; linear gradient 0.78/0.58/0.22 → 0.64/0.48/0.18 (~18% less dark).
- **Subtle vignette** (ellipse): 40%→42% transparent center, 0.25→0.20 edge opacity; ellipse 100%×110% at 50% 38% so bottom is slightly softer.
- **Dark overlay**: 0.18→0.14 (~22% reduction).
- **Atmospheric overlay**: 0.12/0.18 → 0.10/0.15 (~17%).
- **Bottom bar**: Gradient 0.35/0.55 → 0.28/0.42 so bottom edge is lighter.

Left-side readability (UNICE, AI ENGINEER, tagline, Sacred Artifacts) is unchanged; only strength of darkening was reduced.

---

## 4. Cause of extra hover orb/halo clutter

- **Full-screen hover glow** (App.jsx): 180px circle at cursor at 0.18 opacity read as an extra orb. Reduced to 100px and 0.10 opacity so it's a soft spot, not a disc.
- **OrbParticles**: On hover, opacity and radius increased enough that particles looked like extra orbs. Reduced multiplier and radius so they stay clearly part of the hovered orb.
- **Ripple ring** (MemoryOrb): Two cycles at 0.7 opacity read as a second ring/orb. Reduced to one cycle and 0.35 max opacity.
- **Non-video orb aura**: Hover sent aura to 1.6× scale and 0.2 opacity. Reduced to 1.45× and 0.16 so it's "same orb brighter," not a second glow.
- **Hover scale pulse**: 1.08 made the orb feel like it was popping. Reduced to 1.04 for a subtler focal response.

---

## 5. Hover logic changes

- **MemoryOrb.jsx**: `hoverScalePulse` 0.08→0.04; non-video `coreOpTgt`/`auraOpTgt`/`auraScaleTgt` lowered on hover; ripple ring limited to 1 cycle and 0.35 max opacity.
- **App.jsx**: Hover glow gradient 180px/0.18 → 100px/0.10.
- **OrbParticles.jsx**: `speedMult` 2.2→1.4, `baseRadius` 0.45→0.40, opacity multiplier 1.25→1.08.

No new hover layers; existing ones were toned down so one hovered orb reads as one focal event.

---

## 6. Interactive vs ambient orbs after cleanup

- **Interactive**: `orbType` `'primary'` or `'secondary'` (i.e. `isInteractive === true`). Full hover (scale, glow, label, cursor), OrbParticles, click opens panel.
- **Ambient**: `orbType === 'ambient'` (currently **orb-11** "The Stack I Build With"). No pointer, no hover label, smaller/quieter in MemoryOrb; **OrbParticles are not rendered** for ambient orbs so they don't compete with story nodes.

Separation is by `memory.orbType` in data and rendering (MemoryOrb + App.jsx SpiralGroup).

---

## 7. Orb positions

- **No position changes.** Composition already has one hero (orb-05), several primary/secondary, and one ambient (orb-11). Tendrils use `visibleMemories` so there are no lines to missing orbs.

---

## 8. Panel resizing and refinement

- **Size**: `PANEL_DIAMETER` 400px/50vw → 352px/46vw (~10–12% smaller). CSS `--panel-size` default updated to match.
- **Spacing**: Tighter vertical rhythm: symbol margin 4px→2px; meta 3px→2px; title 3px→2px; subtitle 5px→4px; desc 8px→6px; sectionLabel 8px→6px; tools/explore margins reduced; content padding 6px 0 44px → 4px 0 36px; scroll max-height 65vh→62vh.
- **Hierarchy**: Slightly smaller type (meta 9→8px, title 21→19px, subtitle 10→9px, desc 12→11px, sectionLabel 9→8px, tools 10→9px, explore 11→10px) with unchanged weight/color so title stays strongest, subtitle/secondary text and tools/explore quieter.
- **Rim/glass**: Border and box-shadow opacity reduced; backdrop blur 40px→36px; inner gradient and inset highlight slightly softened for a more refined artifact look.
- **Helper text**: Removed "✦ touch any orb to explore ✦"; kept a single line "click outside to close" as `.releaseHint` (smaller, 6px, 0.22 opacity).

---

## 9. Video/media in orb panel

- **Before**: Only the 48px thumbnail badge (top-right) showed video when `videoSrc` was set; it already had autoplay, loop, muted, playsInline.
- **After**: When `memory.videoSrc` exists, an **in-panel video block** (`.panelVideoWrap` / `.panelVideo`) is rendered in the content area: max-width 140px, 16:9 aspect ratio, rounded corners, muted autoplay, loop, playsInline, `onCanPlay` play() fallback. So the configured video is clearly visible and plays inside the artifact; thumbnail badge remains for quick recognition.
- No change to 3D orb video (MemoryOrb) or to lazy/visibility logic there.

---

## 10. Risks and follow-up

- **Vignette**: If the scene feels too flat in some setups, the left lane or ellipse opacity can be nudged up in small steps (e.g. +0.02–0.03).
- **Hover**: If feedback feels too subtle, only the hover scale pulse (e.g. 1.04→1.05) or the App.jsx glow radius (100→120px) could be increased; other changes are best left as-is to avoid new "extra orb" reads.
- **Panel**: On very small viewports, the reduced panel size and type may need a media-query bump for readability.
- **Video**: Autoplay remains muted; if a memory should have sound, a control or explicit play button would need to be added.
- **OrbLabel.jsx**: Still exists but is unused; scene labels are the Html block inside MemoryOrb. Safe to remove in a future cleanup if desired.

---

**Design goal**: The landing scene is tuned to feel like a single focal hover, a clear split between interactive and ambient orbs, a lighter frame that doesn't box the world in, and a smaller, tighter orb panel with visible, playing video where configured—without changing world, art direction, layout, background, left nav, or Tyche.
