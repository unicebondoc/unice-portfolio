import { create } from 'zustand'

/**
 * activePanel: single source of truth for what is open.
 * - null: nothing open
 * - { type: 'memory', id, worldPos }: memory panel for orb id (worldPos for camera)
 * - { type: 'chat' }: chat panel
 * - { type: 'skills' }: skills panel (Crystal artifact)
 * - { type: 'blog' }: blog/writings panel (Tome artifact)
 * Only one can be open at a time. setActivePanel keeps selectedOrb/selectedOrbWorldPos in sync.
 */
const useStore = create((set) => ({
  // Which memory orb is currently hovered
  hoveredOrb: null,
  setHoveredOrb: (id) => set({ hoveredOrb: id }),

  // Screen position of hovered orb (for glow overlay) — [x, y] in px or null
  hoveredOrbScreenPos: null,
  setHoveredOrbScreenPos: (pos) => set({ hoveredOrbScreenPos: pos }),

  // Parallax: mouse position normalized -1..1 (for background/orb/cursor layers)
  parallaxMouse: { x: 0, y: 0 },
  setParallaxMouse: (v) => set({ parallaxMouse: v }),

  // Which left-side artifact is hovered ('scroll' | 'crystal' | 'tome' | null)
  hoveredArtifact: null,
  setHoveredArtifact: (id) => set({ hoveredArtifact: id }),

  // Single active overlay: null | { type: 'memory', id, worldPos } | { type: 'chat' }
  activePanel: null,
  setActivePanel: (panel) =>
    set((state) => {
      if (!panel) {
        return {
          activePanel: null,
          selectedOrb: null,
          selectedOrbWorldPos: null,
          openRitualStartTime: null,
          openPanelTimestamp: null,
          activeSection: 0,
        }
      }
      if (panel.type === 'chat') {
        return { activePanel: panel, selectedOrb: null, selectedOrbWorldPos: null }
      }
      if (panel.type === 'memory') {
        return {
          activePanel: panel,
          selectedOrb: panel.id,
          selectedOrbWorldPos: panel.worldPos ?? null,
          openPanelTimestamp: typeof performance !== 'undefined' ? performance.now() : Date.now(),
          userHasOpenedOrb: true,
          activeSection: 0,
        }
      }
      if (panel.type === 'skills') {
        return { activePanel: panel, activeSection: 1 }
      }
      if (panel.type === 'blog') {
        return { activePanel: panel, activeSection: 3 }
      }
      return { activePanel: panel }
    }),

  // Ritual: Three clock time when memory panel opened (for tendril light + panel timing)
  openRitualStartTime: null,
  setOpenRitualStartTime: (v) => set({ openRitualStartTime: v }),

  // When panel closed: clock time when dim-recovery started (600ms fade back to full)
  dimRecoverStartTime: null,
  setDimRecoverStartTime: (v) => set({ dimRecoverStartTime: v }),

  // Derived from activePanel when type === 'memory' (kept for CameraController, OrbPanel, etc.)
  selectedOrb: null,
  setSelectedOrb: (id) => set({ selectedOrb: id }),

  // World-space position of the selected orb (set when opening memory panel)
  selectedOrbWorldPos: null,
  setSelectedOrbWorldPos: (pos) => set({ selectedOrbWorldPos: pos }),

  // Global scene state
  sceneReady: false,
  setSceneReady: () => set({ sceneReady: true }),

  // Loading screen has exited (exit animation finished) — Tyche/ChatBot show after this
  loadingExited: false,
  setLoadingExited: (v) => set({ loadingExited: !!v }),

  // Camera scroll progress (0 → 1)
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),

  // Active AI-triggered pulse animations  { 'orb-01': triggerTimestamp, ... }
  // Entries are added on pulseOrb() and removed automatically after 2.4 s.
  pulsingOrbs: {},
  pulseOrb: (id) => {
    set((state) => ({
      pulsingOrbs: { ...state.pulsingOrbs, [id]: Date.now() },
    }))
    // Auto-remove after the animation completes
    setTimeout(() => {
      set((state) => {
        const next = { ...state.pulsingOrbs }
        delete next[id]
        return { pulsingOrbs: next }
      })
    }, 2400)
  },

  // Entrance sequence: seconds since load, 0 → 3 then stays 3. Driver runs in Canvas.
  // Default 3 so orbs/tendrils/overlay are visible from load (intro effectively skipped until we re-enable).
  entranceTime: 3,
  setEntranceTime: (t) => set({ entranceTime: Math.min(3, t) }),

  // One-shot click pulse ring: { position [x,y,z], color hex, radius, startTime } — cleared after 600ms
  clickPulse: null,
  setClickPulse: (v) => set({ clickPulse: v }),

  // Viewport: for orb/tendril responsive scaling (set by App or a component on resize)
  viewportScale: 1,
  isMobile: false,
  setViewport: (scale, mobile) => set({ viewportScale: scale, isMobile: !!mobile }),

  // prefers-reduced-motion: when true, simplify animations (particles off, orb animations to fades)
  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: !!v }),

  // Idle orb pulse: one random non-hovered orb pulses every 5-7s (world breathing)
  idlePulseOrbId: null,
  idlePulseOrbStartTime: null,
  setIdlePulseOrb: (id, startTime) => set({ idlePulseOrbId: id, idlePulseOrbStartTime: startTime }),
  clearIdlePulseOrb: () => set({ idlePulseOrbId: null, idlePulseOrbStartTime: null }),

  // Background texture loaded (for lazy placeholder)
  backgroundReady: false,
  setBackgroundReady: (v) => set({ backgroundReady: v }),

  // Tyche whisper: once per session, only if user hasn't opened an orb
  tycheWhisperShown: false,
  setTycheWhisperShown: (v) => set({ tycheWhisperShown: !!v }),
  userHasOpenedOrb: false,
  setUserHasOpenedOrb: (v) => set({ userHasOpenedOrb: !!v }),

  // Section for constellation dots / scroll (0 = main, 1 = skills, 2 = resume, 3 = writings)
  activeSection: 0,
  setActiveSection: (v) => set({ activeSection: v }),
}))

export default useStore
