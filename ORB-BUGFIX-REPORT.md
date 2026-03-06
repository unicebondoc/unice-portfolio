# Orb Production Bug Fixes — Report

## 1. Files inspected

- **`src/components/scene/MemoryOrb.jsx`** — Orb core, halo/glow, labels, hover/active state, pointer handlers
- **`src/data/memories.js`** — Orb config, `orbType` / `visualTier` / `isPrimary`, positions
- **`src/App.jsx`** — Canvas, `onPointerMissed`, panel render, overlays, z-index
- **`src/hooks/useStore.js`** — `hoveredOrb`, `selectedOrb`, `activePanel`, `openPanelTimestamp`, `isMobile`
- **`src/components/scene/OrbParticles.jsx`** — Per-orb particles, raycast participation
- **`src/components/scene/Tendrils.jsx`** — Tendril tubes and energy dots, raycast participation
- **`src/components/scene/OrbPanel.jsx`** — Panel content, mobile bottom sheet
- **`src/components/scene/OrbPanel.module.css`** — Panel layout, pointer-events, z-index
- **`src/components/ui/OrbLabel.jsx`** — Not used in App; labels are inline in MemoryOrb
- **`src/components/ui/HUD.jsx`** — Returns null; no overlay

---

## 2. Files changed

| File | Changes |
|------|--------|
| **MemoryOrb.jsx** | Ghost fix: non-video aura no hover scale (stay 1), aura opacity 0.12→0.14; ripple ring 0.12→0.07 opacity, scale 0.2→0.15. Mobile: `handlePointerDown` opens on pointerdown; 500 ms guard so follow-up click doesn’t close; `onPointerDown` on both orb meshes. Dev log: `[Orb] opening panel <id> mobile=<bool>` only in DEV. |
| **OrbParticles.jsx** | Wrapped `<points>` in `<group raycast={() => null}>` so particles don’t intercept raycast; taps reach the orb. |
| **Tendrils.jsx** | Wrapped tube + energy dot in `<group raycast={() => null}>` so tendrils don’t intercept raycast. |
| **App.jsx** | Subscribed to `openPanelTimestamp`. `onPointerMissed`: only close memory panel if it’s been open ≥ 450 ms (avoids close on same gesture as tap). |

---

## 3. Cause of extra ghost-orb visuals

- **Layers that could read as a second orb**
  - **Non-video orbs**: Outer aura at 1.4× radius was scaling on hover to ~1.45× and opacity 0.12→0.16, so the glow could look like a separate disc.
  - **Ripple ring**: Thin ring at orb edge scaled to 1.2× with opacity 0.12 on hover, adding another visible “ring” layer.
- **What was not the cause**
  - The block with halo, rim, outerGlow, bloomRing, hoverRing, replacement orbs, etc. is under `{false && (...)}`, so those refs are never mounted and that code is dead. No extra meshes from that block.
  - OrbParticles are small and don’t form a second orb; they were only a possible raycast blocker.

**Fixes**
- Non-video aura: no hover scale (always 1), hover opacity 0.12→0.14 so it stays one with the orb.
- Ripple: max opacity 0.12→0.07, scale growth 0.2→0.15 so it stays a subtle accent.

---

## 4. Cause of mobile taps not opening orb content

- **Raycast order**: OrbParticles and Tendrils are in the same scene as orbs. The raycaster returns the first intersection. Particles (points) and tendril tubes/dots could be hit first; they have no click handler, so the event never reached the orb and could be treated as a “miss.”
- **Click vs pointerdown**: On touch devices a tap fires `pointerdown` → `pointerup` → `click`. Relying only on `onClick` can be unreliable (timing, focus). Opening on **pointerdown** makes the panel open on the same gesture as the tap.
- **Immediate close**: After opening from pointerdown, the synthetic `click` still fires. The orb’s `onClick` saw `isSelected === true` and called `setActivePanel(null)`, so the panel closed right after opening.
- **onPointerMissed**: If the first intersection was a non-interactive object, the canvas could fire `onPointerMissed` and close the panel; on mobile this could happen in the same gesture as the tap.

**Fixes**
- **OrbParticles** and **Tendrils**: wrapped in a group with `raycast={() => null}` so they are skipped by the raycaster; taps hit the orb mesh.
- **MemoryOrb**: `handlePointerDown` opens the panel on pointerdown (same as click path but without waiting for click); 500 ms guard so a follow-up click when already selected does not close the panel.
- **App**: `onPointerMissed` closes the memory panel only if it has been open for at least 450 ms, so a “miss” from the same tap doesn’t close it.

---

## 5. Event handling changes

- **MemoryOrb**
  - **onPointerDown** added on both orb meshes (video and non-video), calling `handlePointerDown` which opens the panel when not selected (no extra logic for close).
  - **onClick** (`handleClick`): when selected, close only if `now - lastOpenTimeRef.current >= 500` ms, so the synthetic click after a tap does not close the panel.
- **App**
  - **onPointerMissed**: only calls `requestClosePanel()` for the memory panel when `activePanel?.type === 'memory'` and `now - openPanelTimestamp >= 450` ms.

---

## 6. Pointer-events / raycast layering changes

- **OrbParticles**: `<points>` wrapped in `<group raycast={() => null}>` so the group (and its points) are not considered by the raycaster; touches pass through to orbs.
- **Tendrils**: Tube and energy-dot meshes wrapped in `<group raycast={() => null}>` so tendrils don’t steal taps.
- No DOM pointer-events changes: overlays (vignette, dark overlay, etc.) already use `pointer-events: none`; OrbPanel and interactive UI use `pointer-events: auto` where needed. Orb label Html in MemoryOrb already has `pointerEvents: 'none'`.

---

## 7. Interactive vs ambient orbs

- **Config** (in `memories.js`): `orbType: 'primary' | 'secondary' | 'ambient'`, `isPrimary`, `visualTier: 'hero' | 'primary' | 'secondary'`.
- **MemoryOrb**: `isInteractive = orbType !== 'ambient'`. Only interactive orbs get click/pointer handlers, hover label, and stronger hover response.
- **Ambient** (e.g. orb-11 “The Stack I Build With”): `orbType: 'ambient'` — no click/tap, no hover label, quieter glow; decorative only.
- **OrbParticles** (in App): Rendered only for non-ambient orbs (`memory.orbType === 'ambient'` → skip).
- **Tendrils**: All visible memories get a tendril; hover/selected brightening is skipped for ambient (`!isAmbient` in opacity calc).

No change to this model; it was already correct and was left as-is.

---

## 8. Mobile vs desktop open-state logic

- **Single flow**: Both mobile and desktop use the same `activePanel` state and the same open path: `setActivePanel({ type: 'memory', id, worldPos, screenPos })`. OrbPanel receives `memory`, `panelPos`, and `mobile`; it uses `mobile` only for layout (bottom sheet vs centered) and touch drag-to-close.
- **Opening**: Desktop uses click or pointerdown; mobile uses pointerdown (and optionally click). Same `handleClick` / `handlePointerDown` and same 400 ms open throttle.
- **Closing**: Same `requestClosePanel()` (Escape, outside click, or clicking the same orb after 500 ms). Mobile bottom sheet can also close by dragging down; OrbPanel handles that internally.
- **Panel visibility**: Same z-index (100) and same `activePanel?.type === 'memory'` condition; mobile uses `OrbPanel.module.css` bottom-sheet rules (`anchorBottomSheet`, `panelBottomSheet`). No separate mobile open state.

---

## 9. Success criteria

- **Ghost orbs**: Hover/selection no longer adds a second visible disc; one orb reads as one object (aura and ripple kept subtle and unified).
- **Mobile tap**: Tapping a visible interactive orb opens its panel reliably (raycast hits orb; open on pointerdown; no close from follow-up click or immediate miss).
- **Interactive vs ambient**: Only primary/secondary orbs are clickable and show labels; ambient orbs remain decorative.
- **Logging**: One dev-only log: `[Orb] opening panel <id> mobile=<bool>` when a panel opens (DEV only). No other console logs added for orb events.
