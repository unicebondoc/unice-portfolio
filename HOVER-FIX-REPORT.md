# Orb Hover Behavior — Singular, Controlled, Premium (Report)

## 1. Which file owns the hover logic

- **Global hover state**: `src/hooks/useStore.js` — `hoveredOrb` (single orb id or null), `setHoveredOrb`, and `hoveredOrbScreenPos` / `setHoveredOrbScreenPos`.
- **Per-orb handling**: `src/components/scene/MemoryOrb.jsx` — each orb reads `hoveredOrb` from the store, computes `isHovered = (hoveredOrb === id)`, and sets hover on `handlePointerOver` / `handlePointerOut` only when `isInteractive` (i.e. `orbType !== 'ambient'`). So hover is **tracked globally** (one orb at a time), and **owned** by MemoryOrb for pointer events and by the store as single source of truth.

---

## 2. Which layers were causing the extra orb-like artifacts

- **App.jsx — full-screen radial gradient**: A circle (100px radius, 0.10 opacity) was drawn at `hoveredOrbScreenPos` over the whole viewport. That read as an extra glow disc. **Fix**: Removed this overlay entirely so no second “orb” appears on hover.
- **MemoryOrb — ripple ring**: On hover, a ring scaled from 1 to ~2.4 and reached 0.35 opacity, reading as a second circle. **Fix**: Ripple is now a thin accent only (scale 1 → 1.2, max opacity 0.12).
- **MemoryOrb — outerGlow / aura / hoverRing / bloomRing**: These refs are driven in `useFrame` but their meshes live inside a `{false && (...)}` block, so they are not mounted and did not contribute to the current frame. No code change needed for them.
- **OrbParticles**: Particles around the hovered orb gained opacity (1.08×) and larger radius (0.40) on hover, so they could read as extra dots. **Fix**: No opacity boost on hover; only a very slight speed multiplier (1.1×) so the orb’s own particles stay clearly part of that orb.

---

## 3. Which tendril logic was causing excess line activity

- **Tendrils.jsx**: For the hovered orb’s tendril, opacity went from 0.15 to **0.25** and the **energy dot** (moving sphere along the line) **sped up** (loop 2.5s → 1.25s) and brightened (0.7 → 0.95). That made the whole line feel busy and the scene noisier.
- **Fix**: Only the hovered orb’s line may brighten slightly (opacity 0.15 → 0.18). Energy dot **no longer speeds up** (loop stays 2.5s); dot opacity on hover is reduced (0.5) so the line clarifies without extra motion. Ambient orbs’ tendrils do not brighten on hover (`isAmbient` check).

---

## 4. What was changed to enforce one-orb-one-response behavior

| Change | File | Description |
|--------|------|-------------|
| Remove hover glow overlay | App.jsx | Removed the radial gradient at `hoveredOrbScreenPos`. No extra disc on hover. |
| No drift of other orbs | MemoryOrb.jsx | Removed “gravity” drift of non-hovered orbs away from the hovered orb. Other orbs stay in place (only gentle sway remains). |
| No particle cloud drift | Particles.jsx | Removed whole-cloud bias and per-particle attraction toward `hoveredPos`. Clouds no longer move toward the hovered orb. |
| Ripple ring minimal | MemoryOrb.jsx | Ripple on hover: one cycle, scale 1→1.2, max opacity 0.12. Thin accent only. |
| OrbParticles minimal | OrbParticles.jsx | Hover/selected: no opacity increase, baseRadius fixed at 0.35, speedMult 1.1 only. |
| Tendril: brighten only, no speed-up | Tendrils.jsx | Hovered orb’s line: opacity 0.15→0.18; energy dot same speed, moderate opacity (0.5). |
| Hover dim only interactive | MemoryOrb.jsx | `isHoverDimmed` is true only when `isInteractive`; ambient orbs are not dimmed by others’ hover. |

Result: **Only the hovered orb** brightens, scales slightly (1.04× pulse), shows its label, and has its tendril slightly brighter. Everything else stays stable or dims slightly (interactive orbs only); no extra orbs, halos, or global motion.

---

## 5. How interactive and ambient orbs are now differentiated

- **Data**: `src/data/memories.js` uses `orbType: 'primary' | 'secondary' | 'ambient'` and `visualTier: 'hero' | 'primary' | 'secondary'`. Ambient example: **orb-11** (“The Stack I Build With”).
- **MemoryOrb.jsx**:
  - `isInteractive = (orbType !== 'ambient')`. Only interactive orbs get pointer handlers and set `hoveredOrb`.
  - **Ambient**: smaller scale (`ambientScaleMult` 0.62), lower opacity (0.32), reduced glow (0.35), no hover label, no click, no cursor change. **They do not dim** when another orb is hovered (`isHoverDimmed` only for interactive orbs); `nearHoveredDim` is 1 for ambient so they stay fully stable.
- **App.jsx**: OrbParticles are not rendered for `orbType === 'ambient'` (no particle ring around ambient orbs).
- **Tendrils.jsx**: When `memory.orbType === 'ambient'`, the tendril does not brighten and the energy dot does not change on hover (`isAmbient` check).

So: **interactive** = clear core, stronger glow, hover response, label, pointer, click; **ambient** = smaller, dimmer, no hover response, no label, no click, no particle ring, tendril stays at base.

---

## 6. Which files were changed

| File | Changes |
|------|---------|
| **App.jsx** | Removed hover glow overlay (radial gradient at hovered orb screen position). |
| **MemoryOrb.jsx** | Removed drift of other orbs; reduced ripple ring (scale 1.2, opacity 0.12); `isHoverDimmed` only when `isInteractive`; kept `hoveredMem`/`isNearHovered` for interactive-only “nearby dim”. |
| **Particles.jsx** | Removed whole-cloud bias and per-particle attraction toward hovered orb; clouds no longer react to hover. |
| **Tendrils.jsx** | Hovered line: opacity 0.18 (was 0.25); energy dot no speed-up, opacity 0.5; ambient tendrils never brighten on hover. |
| **OrbParticles.jsx** | Hover/selected: no opacity boost, baseRadius 0.35, speedMult 1.1 only. |

---

Art direction (luminous forest, orb materials, constellation lines, cinematic mood) is unchanged. Only hover-driven noise and extra orb-like visuals were removed so one hovered orb gives one clear, premium focal response.
