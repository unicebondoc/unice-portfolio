import { create } from 'zustand'

const useStore = create((set) => ({
  // Which memory orb is currently hovered
  hoveredOrb: null,
  setHoveredOrb: (id) => set({ hoveredOrb: id }),

  // Which memory orb is selected / detail panel open
  selectedOrb: null,
  setSelectedOrb: (id) => set({ selectedOrb: id }),

  // Global scene state
  sceneReady: false,
  setSceneReady: () => set({ sceneReady: true }),

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
}))

export default useStore
