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
}))

export default useStore
