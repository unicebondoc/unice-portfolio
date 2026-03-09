import { Suspense, useEffect, useLayoutEffect, useRef, useMemo, useState, useCallback } from 'react'
import HUD from './components/ui/HUD'
import SacredArtifacts from './components/ui/SacredArtifacts'
import IntroOverlay from './components/ui/IntroOverlay'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useProgress } from '@react-three/drei'
import { gsap } from 'gsap'
import MemoryOrb from './components/scene/MemoryOrb'
import Particles from './components/scene/Particles'
import Tendrils from './components/scene/Tendrils'
import HeartOfTree from './components/scene/HeartOfTree'
import AwakeningBurst from './components/scene/AwakeningBurst'
import Fireflies from './components/scene/Fireflies'
import DustMotes from './components/scene/DustMotes'
import WaterParticles from './components/scene/WaterParticles'
import GroundSporeParticles from './components/scene/GroundSporeParticles'
import CanopyParticles from './components/scene/CanopyParticles'
import FloatingSkills from './components/scene/FloatingSkills'
import { Environment } from '@react-three/drei'
import { MEMORIES, getMemoryPosition } from './data/memories'
import { SOCIALS } from './data/socials'
import useStore from './hooks/useStore'
import { useSound } from './context/SoundManager'
import OrbPanel from './components/scene/OrbPanel'
import SkillsPanel from './components/ui/SkillsPanel'
import BlogPanel from './components/ui/BlogPanel'
import ResumePanel from './components/ui/ResumePanel'
import hudStyles from './components/ui/HUD.module.css'
import LoadingScreen from './components/ui/LoadingScreen'
import SoundToggle from './components/ui/SoundToggle'
import CustomCursor from './components/ui/CustomCursor'
import GestureTarotScroll from './components/ui/GestureTarotScroll'
import ChatBot from './components/ui/ChatBot'
import TycheMascot from './components/ui/TycheMascot'

const LERP = 0.08

// ── Parallax: mouse-normalized -1..1, lerped; desktop only; drives background / orbs ──
function ParallaxDriver() {
  const isMobile = useStore((s) => s.isMobile)
  const setParallaxMouse = useStore((s) => s.setParallaxMouse)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    if (isMobile) return
    const onMove = (e) => {
      targetRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      targetRef.current.y = (1 - e.clientY / window.innerHeight) * 2 - 1
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(function tick() {
        rafRef.current = null
        const t = targetRef.current
        const c = currentRef.current
        c.x += (t.x - c.x) * LERP
        c.y += (t.y - c.y) * LERP
        setParallaxMouse({ x: c.x, y: c.y })
        if (Math.abs(t.x - c.x) > 0.001 || Math.abs(t.y - c.y) > 0.001) {
          rafRef.current = requestAnimationFrame(tick)
        }
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, setParallaxMouse])
  return null
}

// ── Responsive: FOV adjusts with aspect ratio so orbs fit at all viewport sizes ──
function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    if (aspect < 1) {
      camera.fov = 80
    } else if (aspect < 1.4) {
      camera.fov = 70
    } else {
      camera.fov = 60
    }
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])
  return null
}

// ── Responsive: scale entire constellation so orbs/tendrils/artifacts stay on screen ──
function ResponsiveConstellation({ children }) {
  const { size } = useThree()
  const scale = useMemo(() => {
    const aspect = size.width / size.height
    if (size.width < 768) return 0.5
    if (size.width < 1024) return 0.7
    if (aspect < 1.4) return 0.85
    return 1.0
  }, [size.width, size.height])
  return <group scale={[scale, scale, scale]}>{children}</group>
}

// ── Fires setSceneReady after Suspense resolves ──────────────────
function SceneReadyNotifier() {
  const setSceneReady = useStore((s) => s.setSceneReady)
  useEffect(() => {
    const t = setTimeout(() => setSceneReady(), 80)
    return () => clearTimeout(t)
  }, [setSceneReady])
  return null
}

// ── Scene background: texture fills canvas; one system with 3D so resize stays in sync ──
function SceneBackground() {
  const { scene, gl } = useThree()
  const setBackgroundReady = useStore((s) => s.setBackgroundReady)
  const parallaxMouse = useStore((s) => s.parallaxMouse)
  const baseOffsetRef = useRef({ x: 0, y: 0 })

  const applyAspect = useCallback((texture) => {
    const canvasAspect = gl.domElement.width / gl.domElement.height
    const imageAspect = texture.image ? (texture.image.width / texture.image.height) : 16 / 9
    if (canvasAspect > imageAspect) {
      texture.repeat.set(1, imageAspect / canvasAspect)
      baseOffsetRef.current = { x: 0, y: (1 - imageAspect / canvasAspect) / 2 }
      texture.offset.set(0, baseOffsetRef.current.y)
    } else {
      texture.repeat.set(canvasAspect / imageAspect, 1)
      baseOffsetRef.current = { x: (1 - canvasAspect / imageAspect) / 2, y: 0 }
      texture.offset.set(baseOffsetRef.current.x, 0)
    }
  }, [gl])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/background.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      applyAspect(texture)
      scene.background = texture
      setBackgroundReady(true)
    })
  }, [scene, gl, setBackgroundReady, applyAspect])

  useEffect(() => {
    const handleResize = () => {
      if (scene.background && scene.background.image) {
        applyAspect(scene.background)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [scene, gl, applyAspect])

  useFrame(() => {
    if (!scene.background || !scene.background.isTexture) return
    const base = baseOffsetRef.current
    const p = parallaxMouse
    const parallaxScale = 0.008
    scene.background.offset.set(
      base.x - p.x * parallaxScale,
      base.y - p.y * parallaxScale
    )
  })
  return null
}

// ── Entrance timeline: 0 → 3s, drives brightness / orbs / tendrils / UI ───
function EntranceDriver() {
  const setEntranceTime = useStore((s) => s.setEntranceTime)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    setEntranceTime(t)
  })
  return null
}

// ── T+1s: soft purple light at tree trunk (awakening) ─────────────────────
function TrunkAwakeningLight() {
  const entranceTime = useStore((s) => s.entranceTime)
  let intensity = 0
  if (entranceTime >= 1) {
    if (entranceTime < 1.5) intensity = ((entranceTime - 1) / 0.5) * 0.35
    else if (entranceTime < 2) intensity = 0.35 - ((entranceTime - 1.5) / 0.5) * 0.2
    else intensity = 0.15
  }
  return (
    <pointLight
      position={[0, 0, -3.5]}
      color="#8060ff"
      intensity={intensity}
      distance={2.5}
      decay={2}
    />
  )
}

// ── Animated caustic lights — simulate light through water ───────
function CausticLights() {
  const l1       = useRef()
  const l2       = useRef()
  const timerRef = useRef(new THREE.Timer())
  useFrame(() => {
    timerRef.current.update()
    const t = timerRef.current.getElapsed() * 0.15
    if (l1.current) {
      l1.current.position.set(
        Math.sin(t)        * 7,
        Math.cos(t * 0.65) * 5 + 4,
        Math.sin(t * 0.42) * 4,
      )
    }
    if (l2.current) {
      l2.current.position.set(
        Math.cos(t * 0.80 + 2) * 6,
        Math.sin(t * 0.52)     * 4 - 3,
        Math.cos(t * 0.35)     * 5,
      )
    }
  })
  return (
    <>
      <pointLight ref={l1} color="#00AACC" intensity={0.10} distance={1.5} />
      <pointLight ref={l2} color="#003344" intensity={0.16} distance={1.5} />
    </>
  )
}

// ── Scene-wide ambient lighting (not per-orb) ────────────────────
// Per-orb PointLights now live inside each MemoryOrb component.
// When memory panel is open: dim by 30% so focused orb feels brighter by contrast.
function AmbientLightWithFocusDim() {
  const ref = useRef()
  const selectedOrb = useStore((s) => s.selectedOrb)
  const intensityRef = useRef(0.05)
  useFrame((_, delta) => {
    if (!ref.current) return
    const target = selectedOrb ? 0.05 * 0.7 : 0.05
    intensityRef.current = THREE.MathUtils.lerp(intensityRef.current, target, Math.min(1, delta * 2.0))
    ref.current.intensity = intensityRef.current
  })
  return <ambientLight ref={ref} intensity={0.05} color="#0a1520" />
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 8]} intensity={0.8} distance={20} decay={2} />
      <AmbientLightWithFocusDim />

      {/* Warm amber — animated by LightShaftBreath (tree breathing) */}
      <LightShaftBreath />

      {/* Cool deep bioluminescent glow from below */}
      <pointLight position={[0, -10, -4]} intensity={0.2} color="#002a44" distance={1.5} />

      {/* Subtle teal rim from far back */}
      <pointLight position={[0, 2, -12]} intensity={0.18} color="#003322" distance={1.5} />

      <CausticLights />
      <RootGlowPulse />
      <TrunkPulseLight />
      <MemoryPanelTreeLight />
      <TreeRootPulse />
      <WaterShimmerLight />
    </>
  )
}

// ── Root glow pulse — every 6–8s, +0.2 intensity then fade back (subtle)
function RootGlowPulse() {
  const lightRef = useRef()
  const timerRef = useRef(new THREE.Timer())
  const pulseAt  = useRef(6 + Math.random() * 2)
  const baseIntensity = 0.2
  useFrame(() => {
    if (!lightRef.current) return
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    const sincePulse = t % pulseAt.current
    const pulseDur   = 1.2
    let add = 0
    if (sincePulse < pulseDur) {
      const p = sincePulse / pulseDur
      add = 0.05 * Math.sin(p * Math.PI)
    }
    lightRef.current.intensity = Math.min(0.2, baseIntensity + add)
  })
  return (
    <pointLight ref={lightRef} position={[0, -5, 0]} intensity={0.2} color="#00d9ff" distance={1.5} />
  )
}

// ── Trunk pulse: when a memory opens, light at trunk base pulses 0 → 0.8 → 0.2 over 1s
function TrunkPulseLight() {
  const ref = useRef()
  const timerRef = useRef(new THREE.Timer())
  const pulseStartRef = useRef(null)
  const selectedOrbWorldPos = useStore((s) => s.selectedOrbWorldPos)

  useEffect(() => {
    if (selectedOrbWorldPos) pulseStartRef.current = null
  }, [selectedOrbWorldPos])

  useFrame(() => {
    if (!ref.current) return
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    if (selectedOrbWorldPos && pulseStartRef.current === null) pulseStartRef.current = t
    if (!selectedOrbWorldPos) {
      pulseStartRef.current = null
      ref.current.intensity = THREE.MathUtils.lerp(ref.current.intensity, 0, 0.05)
      return
    }
    const start = pulseStartRef.current
    if (start === null) return
    const el = t - start
    if (el < 0.35) {
      const p = el / 0.35
      ref.current.intensity = 0.2 * (1 - (1 - p) * (1 - p))
    } else if (el < 1) {
      const p = (el - 0.35) / 0.65
      ref.current.intensity = THREE.MathUtils.lerp(0.2, 0.15, p)
    } else {
      ref.current.intensity = THREE.MathUtils.lerp(ref.current.intensity, 0.15, 0.04)
    }
  })
  return (
    <pointLight ref={ref} position={[0, 0, 0]} color="#00d9ff" intensity={0} distance={1.5} />
  )
}

// ── Memory panel open: tree lit by active orb color, intensity 0 → 0.3 over 800ms ──
function MemoryPanelTreeLight() {
  const ref = useRef()
  const activePanel = useStore((s) => s.activePanel)
  const openStartRef = useRef(null)

  const memory = activePanel?.type === 'memory' ? MEMORIES.find((m) => m.id === activePanel.id) : null
  const color = memory?.color ?? '#ffffff'

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    if (activePanel?.type === 'memory' && openStartRef.current === null) openStartRef.current = t
    if (activePanel?.type !== 'memory') openStartRef.current = null
    const openDur = 0.8
    const elapsed = openStartRef.current != null ? t - openStartRef.current : 0
    const ramp = activePanel?.type === 'memory' ? Math.min(1, elapsed / openDur) : 0
    const target = activePanel?.type === 'memory' ? 0.3 * ramp : 0
    ref.current.intensity = THREE.MathUtils.lerp(ref.current.intensity, target, Math.min(1, delta * 4))
    ref.current.color.set(color)
  })
  return (
    <pointLight ref={ref} position={[0, 0, -3.5]} color={color} intensity={0} distance={2.5} decay={2} />
  )
}

// ── Tree root light pulse: every 3–4s soft light travels up trunk (sap flowing)
function TreeRootPulse() {
  const lightRef = useRef()
  const timerRef = useRef(new THREE.Timer())
  const nextPulseAt = useRef(3 + Math.random() * 1)
  const pulseStartRef = useRef(null)
  const Z = -3.5

  useFrame(() => {
    if (!lightRef.current) return
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    if (pulseStartRef.current === null) {
      pulseStartRef.current = t
      nextPulseAt.current = 3 + Math.random() * 1
    }
    const sinceStart = t - pulseStartRef.current
    if (sinceStart >= nextPulseAt.current) {
      pulseStartRef.current = t
      nextPulseAt.current = 3 + Math.random() * 1
    }
    const phase = sinceStart % nextPulseAt.current
    const dur = 1.5
    if (phase < dur) {
      const p = phase / dur
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      lightRef.current.intensity = 0.15 * Math.sin(p * Math.PI)
      lightRef.current.position.set(0, 0.5 + ease * 2, Z)
    } else {
      lightRef.current.intensity = 0
    }
  })
  return (
    <pointLight ref={lightRef} position={[0, 0.5, Z]} color="#00c8ff" intensity={0} distance={2} decay={2} />
  )
}

// ── Water shimmer: intensity 0.2 → 0.4 → 0.2 over 3s sine
function WaterShimmerLight() {
  const lightRef = useRef()
  useFrame((state) => {
    if (!lightRef.current) return
    const t = state.clock.elapsedTime
    const sine = Math.sin(t * (Math.PI * 2 / 3)) * 0.5 + 0.5
    lightRef.current.intensity = 0.2 + sine * 0.2
  })
  return (
    <pointLight ref={lightRef} position={[0, -3, 1]} color="#4060ff" intensity={0.3} distance={4} decay={2} />
  )
}

// ── Light shaft breath: every 10–15s warm light brightens 1.4× over 2s
function LightShaftBreath() {
  const lightRef = useRef()
  const timerRef = useRef(new THREE.Timer())
  const nextAt = useRef(10 + Math.random() * 5)
  const breathStartRef = useRef(null)
  const baseIntensity = 0.16

  useFrame(() => {
    if (!lightRef.current) return
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    if (breathStartRef.current === null) breathStartRef.current = t
    let elapsed = t - breathStartRef.current
    if (elapsed >= nextAt.current) {
      breathStartRef.current = t
      nextAt.current = 10 + Math.random() * 5
      elapsed = 0
    }
    if (elapsed < 2) {
      const p = elapsed / 2
      const mult = p < 0.5 ? 1 + 0.4 * (p * 2) : 1.4 - 0.4 * ((p - 0.5) * 2)
      lightRef.current.intensity = baseIntensity * mult
    } else {
      lightRef.current.intensity = baseIntensity
    }
  })
  return (
    <pointLight ref={lightRef} position={[0, 14, 3]} color="#3a1e00" intensity={baseIntensity} distance={1.5} />
  )
}

// ── Idle orb pulse driver: every 5–7s one random non-hovered orb pulses
function IdleOrbPulseDriver() {
  const nextAt = useRef(5 + Math.random() * 2)
  const lastPulseStartRef = useRef(0)
  const lastPulsedIdRef = useRef(null)
  const hoveredOrb = useStore((s) => s.hoveredOrb)
  const setIdlePulseOrb = useStore((s) => s.setIdlePulseOrb)
  const clearIdlePulseOrb = useStore((s) => s.clearIdlePulseOrb)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (t - lastPulseStartRef.current < nextAt.current) return
    const candidates = MEMORIES.filter((m) => m.id !== hoveredOrb && m.id !== lastPulsedIdRef.current)
    if (candidates.length === 0) return
    const orb = candidates[Math.floor(Math.random() * candidates.length)]
    lastPulsedIdRef.current = orb.id
    lastPulseStartRef.current = t
    nextAt.current = 5 + Math.random() * 2
    setIdlePulseOrb(orb.id, t)
    setTimeout(clearIdlePulseOrb, 1200)
  })
  return null
}

// ── Fixed camera: no user drag; optional nudge toward orb when memory panel opens ────
const HOME_TARGET = new THREE.Vector3(0, 0, 0)
const DEFAULT_CAM = new THREE.Vector3(0, 0, 8)

function CameraController() {
  const { camera } = useThree()
  const selectedOrbWorldPos = useStore((s) => s.selectedOrbWorldPos)
  const parallaxMouse = useStore((s) => s.parallaxMouse)
  const isMobile = useStore((s) => s.isMobile)

  const focusCamPos = useRef(new THREE.Vector3(0, 0, 8))
  const driftTargetRef = useRef(new THREE.Vector3(0, 0, 8))
  const isFocused   = useRef(false)

  useEffect(() => {
    if (selectedOrbWorldPos) {
      const [wx, wy, wz] = selectedOrbWorldPos

      const defaultCam = new THREE.Vector3(0, 0, 8)
      const orbPos     = new THREE.Vector3(wx, wy, wz)
      const dir        = orbPos.clone().sub(defaultCam).normalize()
      const nudgedCam  = defaultCam.clone().addScaledVector(dir, 0.6)

      const panelDir = wx > 1.0 ? -1 : 1
      nudgedCam.x   += panelDir * 1.2

      focusCamPos.current.copy(nudgedCam)
      driftTargetRef.current.copy(nudgedCam).addScaledVector(dir, 0.3)
      isFocused.current = true
    } else {
      focusCamPos.current.set(0, 0, 8)
      driftTargetRef.current.set(0, 0, 8)
      isFocused.current = false
    }
  }, [selectedOrbWorldPos])

  useFrame((state, delta) => {
    const driftTgt = isFocused.current ? driftTargetRef.current : DEFAULT_CAM
    const base = camera.position.clone().lerp(driftTgt, Math.min(1, delta * 0.8))
    camera.position.copy(base)
    if (!isMobile) {
      camera.position.x += parallaxMouse.x * 0.04
      camera.position.y += parallaxMouse.y * 0.04
    }
    camera.lookAt(HOME_TARGET)
  })
  return null
}

// ── Orb group — constellation base positions; drift offset when panel open
function SpiralGroup({ entranceOrderMap, firstOrbId, memories, visibleMemories, hoveredOrb, activePanel }) {
  const isMobile = useStore((s) => s.isMobile)

  return (
    <group position={[0, 0, -3.5]}>
      {visibleMemories.map((memory, i) => {
        const position = getMemoryPosition(memory, isMobile)
        return (
          <MemoryOrb
            key={memory.id}
            memory={{ ...memory, position }}
            index={i}
            entranceOrder={entranceOrderMap ? entranceOrderMap[memory.id] ?? i : i}
            isFirstOrb={memory.id === firstOrbId}
            memories={memories.map((m) => ({ ...m, position: getMemoryPosition(m, isMobile) }))}
          />
        )
      })}
    </group>
  )
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src
    const done = () => resolve(true)
    img.onload = async () => {
      try { if (img.decode) await img.decode() } catch {}
      done()
    }
    img.onerror = done
  })
}

export default function App() {
  const sceneReady   = useStore((s) => s.sceneReady)
  const entranceTime = useStore((s) => s.entranceTime)
  const activePanel  = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const [memoryPanelClosing, setMemoryPanelClosing] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const { progress: threeProgress, active: threeActive, total: threeTotal } = useProgress()
  const mainUiRef = useRef(null)
  const mainContentRef = useRef(null)
  const hasEnteredRef = useRef(false)
  const sound = useSound()
  const isMobile = useStore((s) => s.isMobile)
  const backgroundReady = useStore((s) => s.backgroundReady)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const hoveredOrbScreenPos = useStore((s) => s.hoveredOrbScreenPos)
  const hoveredOrb = useStore((s) => s.hoveredOrb)
  const openPanelTimestamp = useStore((s) => s.openPanelTimestamp)
  const setLoadingExited = useStore((s) => s.setLoadingExited)
  const loadingExited = useStore((s) => s.loadingExited)
  const visibleMemories = useMemo(
    () => MEMORIES.filter((m) => m.isPrimary !== false).slice(0, 8),
    []
  )

  // Viewport: isMobile (<768px) and prefers-reduced-motion
  useEffect(() => {
    const setViewport = useStore.getState().setViewport
    const setReducedMotion = useStore.getState().setReducedMotion
    const update = () => {
      const w = window.innerWidth
      const mobile = w < 768
      const scale = mobile ? 0.5 : w < 1024 ? 0.7 : 1
      setViewport(scale, mobile)
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
    update()
    let t
    const debounced = () => {
      if (t) clearTimeout(t)
      t = setTimeout(update, 120)
    }
    window.addEventListener('resize', debounced)
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onReduce = () => setReducedMotion(mql.matches)
    mql.addEventListener('change', onReduce)
    return () => {
      if (t) clearTimeout(t)
      window.removeEventListener('resize', debounced)
      mql.removeEventListener('change', onReduce)
    }
  }, [])

  const requestClosePanel = useCallback(() => {
    if (activePanel?.type === 'memory') {
      sound?.play('orbClose')
      setMemoryPanelClosing(true)
      setTimeout(() => {
        setActivePanel(null)
        setMemoryPanelClosing(false)
      }, 260)
    } else {
      setActivePanel(null)
    }
  }, [activePanel, setActivePanel, sound])

  // Entrance order: orbs by distance from center (closest first) for stagger
  const entranceOrderMap = useMemo(() => {
    const withDist = MEMORIES.map((m) => ({
      id: m.id,
      dist: Math.hypot(m.position[0], m.position[1], m.position[2]),
    }))
    withDist.sort((a, b) => a.dist - b.dist)
    const map = {}
    withDist.forEach(({ id }, order) => { map[id] = order })
    return map
  }, [])

  // Chronologically earliest memory (for "begin here" pulse — FIX 3)
  const firstOrbId = useMemo(() => {
    const sorted = [...MEMORIES].sort((a, b) => String(a.year).localeCompare(String(b.year), undefined, { numeric: true }))
    return sorted[0]?.id ?? null
  }, [])

  // Escape closes the active panel
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && activePanel) requestClosePanel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePanel, requestClosePanel])

  // Page transition: when opening Skills or Writings, drift canvas back; when closing, bring back
  useEffect(() => {
    const el = mainContentRef.current
    if (!el) return
    const isPanelOpen = activePanel?.type === 'skills' || activePanel?.type === 'blog' || activePanel?.type === 'resume'
    gsap.killTweensOf(el)
    if (isPanelOpen) {
      gsap.to(el, {
        y: -50,
        scale: 0.97,
        opacity: 0.28,
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: true,
      })
    } else {
      gsap.to(el, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: true,
      })
    }
    return () => gsap.killTweensOf(el)
  }, [activePanel?.type])

  // Track real non-Three assets (fonts + key images).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (document?.fonts?.ready) await document.fonts.ready
      } catch {}
      if (!cancelled) setFontsReady(true)
    })()
    ;(async () => {
      await Promise.all([
        preloadImage('/background.png'),
        preloadImage('/memories/belong.png'),
      ])
      if (!cancelled) setImagesReady(true)
    })()
    return () => { cancelled = true }
  }, [])

  const threeReady = useMemo(() => {
    // If Three has nothing to load (total=0 and not active), treat as complete immediately.
    if (!threeActive && (threeTotal ?? 0) === 0) return true
    return (threeProgress ?? 0) >= 99
  }, [threeActive, threeTotal, threeProgress])

  const combinedProgress = useMemo(() => {
    const threeP = threeReady ? 1 : Math.max(0, Math.min(1, (threeProgress ?? 0) / 100))
    const otherP = (fontsReady ? 0.5 : 0) + (imagesReady ? 0.5 : 0)
    // Weight Three heavier (most assets), but include real font/image readiness.
    return Math.min(1, threeP * 0.8 + otherP * 0.2)
  }, [threeProgress, fontsReady, imagesReady, threeReady])

  const assetsReady = sceneReady && fontsReady && imagesReady && threeReady && combinedProgress >= 0.99

  useEffect(() => {
    if (assetsReady) setShowLoader(false)
  }, [assetsReady])

  // Fallback: ensure loadingExited becomes true after loader hides (in case AnimatePresence onExitComplete doesn't fire)
  useEffect(() => {
    if (!showLoader) {
      const t = setTimeout(() => {
        setLoadingExited(true)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [showLoader, setLoadingExited])

  // Hard safety valve: never allow loader to block beyond 8s.
  useEffect(() => {
    const t = setTimeout(() => {
      setShowLoader(false)
    }, 8000)
    return () => clearTimeout(t)
  }, [])

  // Keep main UI hidden until entrance timeline runs.
  useLayoutEffect(() => {
    const el = mainUiRef.current
    if (!el) return
    const q = (sel) => el.querySelector(sel)
    const targets = [
      q('[data-entrance="title"]'),
      q('[data-entrance="left"]'),
      q('[data-entrance="artifacts"]'),
      q('[data-entrance="bottomhint"]'),
      q('[data-entrance="canvas"]'),
    ].filter(Boolean)
    if (targets.length) gsap.set(targets, { opacity: 0 })
  }, [])

  // GSAP entrance: fade/scale UI elements in while loader fades out.
  const runEntrance = useCallback(() => {
    if (hasEnteredRef.current) return
    hasEnteredRef.current = true
    const el = mainUiRef.current
    if (!el) return
    const q = (sel) => el.querySelector(sel)
    const titleEl = q('[data-entrance="title"]')
    const leftEl = q('[data-entrance="left"]')
    const artifactsEl = q('[data-entrance="artifacts"]')
    const bottomhintEl = q('[data-entrance="bottomhint"]')
    const canvasEl = q('[data-entrance="canvas"]')
    const tl = gsap.timeline()
    tl.set(el, { opacity: 1, pointerEvents: 'none' })
    if (titleEl) tl.fromTo(titleEl, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0)
    if (leftEl) tl.fromTo(leftEl, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.15)
    if (artifactsEl) tl.fromTo(artifactsEl, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.25)
    if (bottomhintEl) tl.fromTo(bottomhintEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.35)
    if (canvasEl) tl.fromTo(canvasEl, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 0.1)
  }, [])

  const enableInteraction = useCallback(() => {
    setLoadingExited(true)
    const el = mainUiRef.current
    if (!el) return
    gsap.set(el, { pointerEvents: 'auto' })
  }, [setLoadingExited])

  useEffect(() => {
    if (!showLoader) runEntrance()
  }, [showLoader, runEntrance])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', isolation: 'isolate' }}>
      {/* Skip to main content — visible on focus */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 10000,
          padding: '12px 20px',
          background: 'rgba(0, 229, 255, 0.15)',
          color: '#fff',
          fontFamily: 'Raleway, sans-serif',
          fontSize: 14,
          textDecoration: 'none',
          borderRadius: 6,
          border: '1px solid rgba(0, 229, 255, 0.4)',
        }}
        onFocus={(e) => {
          e.target.style.left = '16px'
          e.target.style.top = '16px'
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px'
          e.target.style.top = 'auto'
        }}
      >
        Skip to main content
      </a>
      <ParallaxDriver />
      {/* Lazy background placeholder: blurred until Three texture loads */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(24px)',
          opacity: backgroundReady ? 0 : 0.85,
          transition: 'opacity 0.6s ease-out',
          pointerEvents: 'none',
          isolation: 'isolate',
        }}
      />
      <div
        ref={mainUiRef}
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: 1,
          pointerEvents: 'none',
        }}
      >
        {/* ── UI separation lane: left-side readable interface band (above scene, below UI) ── */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 15,
            pointerEvents: 'none',
            background: `
              radial-gradient(ellipse at 12% 18%, rgba(0, 0, 0, 0.22) 0%, transparent 58%),
              linear-gradient(90deg,
                rgba(2, 6, 18, 0.64) 0%,
                rgba(2, 6, 18, 0.48) 26%,
                rgba(2, 6, 18, 0.18) 46%,
                rgba(2, 6, 18, 0.0) 68%
              )
            `,
          }}
        />

        {/* ── Site title: fixed top-left, always visible, never clipped ── */}
        <div
          data-entrance="title"
          aria-label="Unice Bondoc"
          style={{
            position: 'fixed',
            top: isMobile ? 20 : 28,
            left: isMobile ? 20 : 32,
            zIndex: 100,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isMobile ? '28px' : 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.97)',
              lineHeight: 1,
              margin: 0,
              marginBottom: 6,
              padding: 0,
              textShadow: '0 0 40px rgba(0,200,255,0.15)',
            }}
          >
            UNICE
          </h1>
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: isMobile ? '9px' : 'clamp(11px, 1.1vw, 13px)',
              fontWeight: 500,
              letterSpacing: isMobile ? '4px' : '7px',
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
              marginBottom: 5,
              padding: 0,
            }}
          >
            AI ENGINEER
          </p>
          {!isMobile && (
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 'clamp(8px, 0.85vw, 10px)',
              fontWeight: 300,
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
              padding: 0,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              width: 'max-content',
              lineHeight: 1.35,
            }}
          >
            FROM MANILA · TO SYDNEY · TO THE FUTURE
          </p>
          )}
        </div>

        {/* Left edge: no dots — nav is Sacred Artifacts sidebar only */}

      {/* Right side intentionally empty (no fixed elements) */}

        {/* ── Left menu (artifacts) — desktop: left vertical; mobile: bottom horizontal ── */}
        <div
          data-entrance="artifacts"
          style={{
            position: 'fixed',
            left: isMobile ? '50%' : '20px',
            bottom: isMobile ? 70 : '15vh',
            transform: isMobile ? 'translateX(-50%)' : 'none',
            zIndex: 20,
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            gap: isMobile ? 16 : 0,
            pointerEvents: 'auto',
            opacity: activePanel?.type === 'memory' ? 0 : 1,
            transition: activePanel?.type === 'memory' ? 'opacity 300ms ease-out' : 'opacity 400ms ease-out',
          }}
        >
          <SacredArtifacts />
        </div>

        {/* ── Right side: Gesture Tarot scroll artifact ── */}
        <GestureTarotScroll />

        {/* ── Chat + Tyche (bottom-right): wrapper pointer-events none; Tyche has pointer-events auto ── */}
        <div
          style={{
            position: 'fixed',
            right: 0,
            bottom: 0,
            zIndex: 2147483646,
            pointerEvents: 'none',
          }}
        >
          <ChatBot />
          <TycheMascot />
        </div>

      {/* ── Bottom bar: socials only, fades when memory panel open ── */}
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? 20 : 24,
          left: isMobile ? 20 : '24px',
          right: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '0',
          background: 'transparent',
          opacity: activePanel?.type === 'memory' ? 0 : 1,
          transition: activePanel?.type === 'memory' ? 'opacity 300ms ease-out' : 'opacity 400ms ease-out',
        }}
      >
        <div className={hudStyles.socialsBar} style={{ flex: 1, justifyContent: 'flex-start' }}>
          <SoundToggle />
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={s.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className={hudStyles.socialLink}
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }} aria-hidden />
        <div style={{ flex: 1, minWidth: 0 }} aria-hidden />
      </div>

      {/* ── Subtle vignette: draws eye to center; softer at bottom so frame breathes (FIX 6) ───────────────────────────── */}
      <div
        role="presentation"
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 100% 110% at 50% 38%, transparent 42%, rgba(0,0,0,0.20) 100%)',
        }}
      />

      {/* ── Dark overlay (reduced ~18% so world keeps depth) ───────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.14)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── No hover glow overlay: one-orb-one-response; no extra disc (Part 2) ───────────────────────────── */}
      {/* Hover glow removed so hovered orb is the only focal response. */}

        {/* ── 3D Canvas — above background, fixed so it doesn’t drift on resize ── */}
        <div
          ref={mainContentRef}
          id="main-content"
          data-entrance="canvas"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: activePanel?.type === 'memory' ? 51 : 1,
            pointerEvents: entranceTime >= 3 ? 'auto' : 'none',
            transformOrigin: '50% 50%',
            isolation: 'isolate',
          }}
        >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        onPointerMissed={() => {
          if (activePanel?.type !== 'memory') return
          // Don't close on "miss" right after opening (e.g. tap on mobile can fire miss)
          const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
          if (openPanelTimestamp != null && now - openPanelTimestamp < 450) return
          requestClosePanel()
        }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        style={{
          background: 'transparent',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      >
        <SceneReadyNotifier />
        <SceneBackground />
        <EntranceDriver />
        <ResponsiveCamera />
        <Lights />
        <TrunkAwakeningLight />

        <fog attach="fog" args={['#010a0f', 7, 22]} />

        <Suspense fallback={null}>
          <Environment preset="warehouse" />
        </Suspense>

        <Particles />
        {!reducedMotion && (
          <>
            <Fireflies />
            <DustMotes />
            <WaterParticles />
            <GroundSporeParticles />
            <CanopyParticles />
          </>
        )}
        <FloatingSkills />

        <ResponsiveConstellation>
          <group position={[0, 0, -3.5]}>
            <HeartOfTree />
          </group>
          <Tendrils memories={visibleMemories} />
          <AwakeningBurst />
          <SpiralGroup
            entranceOrderMap={entranceOrderMap}
            firstOrbId={firstOrbId}
            memories={MEMORIES}
            visibleMemories={visibleMemories}
            hoveredOrb={hoveredOrb}
            activePanel={activePanel}
          />
        </ResponsiveConstellation>

        <IdleOrbPulseDriver />
        <CameraController />
      </Canvas>
      </div>

      {/* ── Atmospheric UI overlay: soft indigo dimmer (reduced ~17%) ── */}
      <div
        role="presentation"
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(3, 8, 22, 0.10) 0%, rgba(3, 8, 22, 0.15) 100%)',
        }}
      />

      {/* ── Memory immersion: vignette overlay (panel owns the moment), 400ms in / 300ms out ── */}
      <div
        role="presentation"
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.65) 100%)',
          opacity: activePanel?.type === 'memory' ? 1 : 0,
          transition: activePanel?.type === 'memory' ? 'opacity 400ms ease-out' : 'opacity 300ms ease-out',
        }}
      />

      {/* ── Memory immersion: colored vignette (world narrows to this memory), 600ms ── */}
      {(() => {
        const isMemoryOpen = activePanel?.type === 'memory'
        const memory = isMemoryOpen ? MEMORIES.find((m) => m.id === activePanel.id) : null
        const hex = memory?.color ?? '#ffffff'
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        const orbColorRgba = `rgba(${r},${g},${b},0.06)`
        return (
          <div
            role="presentation"
            aria-hidden
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 5,
              pointerEvents: 'none',
              background: `radial-gradient(ellipse at center, transparent 50%, ${orbColorRgba} 100%)`,
              opacity: isMemoryOpen ? 1 : 0,
              transition: 'opacity 600ms ease-out',
            }}
          />
        )
      })()}

      {/* ── Implosion flash: orb color 0→0.15→0 at 150ms, 300ms duration ── */}
      {activePanel?.type === 'memory' && (() => {
        const memory = MEMORIES.find((m) => m.id === activePanel.id)
        if (!memory) return null
        return (
          <div
            key={activePanel.id}
            role="presentation"
            aria-hidden
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              pointerEvents: 'none',
              background: memory.color ?? '#ffffff',
              opacity: 0,
              animation: 'memoryOrbFlash 300ms ease-out 150ms forwards',
            }}
          />
        )
      })()}

      {/* ── When memory panel open: dim scene 30% so panel feels "in the world" ── */}
      {activePanel?.type === 'memory' && (
        <div
          role="presentation"
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            pointerEvents: 'none',
            background: 'rgba(0, 0, 0, 0.3)',
            opacity: 1,
            transition: 'opacity 400ms ease-out',
          }}
        />
      )}

      {/* No blocking backdrop: keep orbs clickable while panel open */}

      {/* ── HTML overlays ─────────────────────────────────────── */}
      {/* Custom cursor removed to eliminate stray cyan dot; re-enable if desired */}
      {/* <CustomCursor /> */}
      {/* Intro overlay disabled so orbs/scene are visible from load; re-enable to restore 3s awakening */}
      {/* <IntroOverlay /> */}
      <HUD />
        {/* ── Bottom hint: mobile only ── */}
        {isMobile && (
          <div
            data-entrance="bottomhint"
            aria-hidden
            style={{
              position: 'fixed',
              bottom: '3.5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 12,
              fontSize: 9,
              letterSpacing: 4,
              color: 'rgba(255,255,255,0.28)',
              fontFamily: 'Raleway, sans-serif',
              textTransform: 'uppercase',
              opacity: activePanel?.type === 'memory' ? 0 : 1,
              transition: 'opacity 300ms ease-out',
              animation: activePanel?.type === 'memory' ? 'none' : 'hintPulse 4s ease-in-out infinite',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 6px rgba(0,0,0,0.45)',
            }}
          >
            ✦ TAP THE ORBS ✦
          </div>
        )}

      {/* ── Memory panel (at orb position); on mobile: bottom sheet ── */}
      {activePanel?.type === 'memory' && (() => {
        const memory = MEMORIES.find((m) => m.id === activePanel.id)
        if (!memory) return null
        return (
          <OrbPanel
            memory={memory}
            onClose={requestClosePanel}
            memories={MEMORIES}
            closing={memoryPanelClosing}
            panelPos={activePanel.screenPos ?? null}
            mobile={isMobile}
          />
        )
      })()}

      {activePanel?.type === 'skills' && (
        <SkillsPanel onClose={() => setActivePanel(null)} />
      )}
      {activePanel?.type === 'blog' && (
        <BlogPanel onClose={() => setActivePanel(null)} />
      )}
      {activePanel?.type === 'resume' && (
        <ResumePanel onClose={() => setActivePanel(null)} />
      )}

      </div>

      {/* ── Loading / Entrance (AnimatePresence) ────────────────────── */}
      <LoadingScreen
        show={showLoader}
        progress={combinedProgress}
        minDurationMs={2500}
        whisperAfterMs={6000}
        onExited={enableInteraction}
      />
    </div>
  )
}
