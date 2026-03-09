import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, Html, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../hooks/useStore'
import { TIER_RADIUS } from '../../data/memories'
import { getVideoUrl } from '../../utils/videoUrl'
import { useSound } from '../../context/SoundManager'

/**
 * MemoryOrb — glass soul crystal.
 *
 * Layer stack (renderOrder):
 *   0  outer halo   RADIUS × 1.22  diffuse soft ring
 *   0  fresnel rim  RADIUS × 1.10  additive edge glow
 *   1  glass body   RADIUS × 1.00  MeshPhysicalMaterial
 *   2  inner core   RADIUS × 0.35  emissive solid
 *   3  dust cloud
 *
 * When selected: orb settles to rest (no bob/spin), OrbPanel materialises
 * via drei/Html beside it. drei handles all 3D→screen projection.
 */
function OrbInner({ memory, index = 0, entranceOrder = 0, isFirstOrb = false, memories = [] }) {
  const { id, color, position, isFuture, tier, title, subtitle, year, icon, labelShort } = memory
  const orbGlow = memory.orbGlow || memory.glowColor || color
  const orbInnerLight = memory.orbInnerLight || memory.glowColor || color
  const orbCore = memory.orbCore || memory.orbInnerLight || color
  const { camera, size } = useThree()

  if (import.meta.env?.DEV) {
    console.log('ORB RENDER:', memory.id, memory.orbGlow, memory.orbInnerLight)
  }

  const isCore  = tier === 'core' || tier === 'root'
  const isRoot  = tier === 'root' || memory.isRoot
  // Root orb (central identity) gets flat circular portrait; story orbs get sphere video
  const orbType = memory.orbType || (memory.isPrimary === false ? 'secondary' : 'primary') // 'primary' | 'secondary' | 'ambient'
  const isInteractive = orbType !== 'ambient'
  const isPrimary = memory.isPrimary !== false
  const visualTier = memory.visualTier || (isRoot ? 'primary' : 'primary') // 'hero' | 'primary' | 'secondary'
  const RADIUS  = (TIER_RADIUS[tier] ?? 0.50) * (memory.scaleMult ?? 1.0)

  const BREATHE_SPEED   = isCore ? 0.55 : 0.42
  const PULSE_SPEED     = isCore ? 1.35 : 0.85
  // Holographic crystalline: softer emissive, breathing inner core
  const EM_BASE         = isCore ? 0.15 : 0.12
  const POINT_INTENSITY_MIN = 0.08
  const POINT_INTENSITY_MAX = 0.2
  const POINT_DISTANCE  = 1.5
  const POINT_DECAY     = 2
  // Breathing frequency in Hz: 0.8 memory orbs, 0.4 center (slower/deeper)
  const BREATHE_HZ      = isRoot ? 0.4 : 0.8
  const BREATHE_ANGULAR = BREATHE_HZ * Math.PI * 2

  // ── Refs ────────────────────────────────────────────────────────
  const groupRef       = useRef()
  const haloMat        = useRef()
  const rimMat         = useRef()
  const bodyMat        = useRef()
  const videoInnerMat  = useRef()
  const discRef        = useRef()
  const pointRef       = useRef()
  const corePtRef      = useRef()
  const dustRef        = useRef()
  const dustMat        = useRef()
  const videoRef       = useRef(null)
  const timerRef       = useRef(new THREE.Timer())
  // Per-frame elapsed snapshot so event handlers can read it
  const tRef           = useRef(0)
  // Core emissive surge on click: current → 3.5 (250ms) → settle 1.4 (600ms ease-out)
  const coreFlashRef   = useRef(null)
  // Aura glow sprite — radial gradient, scale 0.6→2.2, opacity 0→0.45→0.15
  const auraRef        = useRef()
  const auraMatRef     = useRef()
  const auraStartRef   = useRef(null)
  const outerGlowRef   = useRef()
  const outerGlowMatRef = useRef()
  // Soft outer bloom ring — faint expanding halo, scale 1→1.8 over 400ms, fade out
  const bloomRingRef   = useRef()
  const bloomRingMatRef = useRef()
  const bloomRingStartRef = useRef(null)
  const seamRef        = useRef()
  const seamMatRef     = useRef()
  const seamStartRef   = useRef(null)
  const orbitParticlesRef = useRef()
  const videoWorldPosRef  = useRef(new THREE.Vector3())
  const hoverAuraColorRef = useRef(new THREE.Color())
  const whiteRef          = useRef(new THREE.Color('#ffffff'))
  const orbAuraRef        = useRef()
  const orbAuraMatRef     = useRef()
  const onboardingStartRef = useRef(null)
  const ritualStartSetRef = useRef(false)
  const shellCrackDoneRef = useRef(false)
  const panelShownRef = useRef(false)
  const panelPhaseRef = useRef(null)
  const prevWasSelectedRef = useRef(false)
  const ritualStartRef = useRef(null)
  const breathRef = useRef(0.7)
  const hoverFactorRef = useRef(0)
  const dimMultiplierRef = useRef(1)
  const lastOpenTimeRef = useRef(0)
  // Replacement orb (memory immersion): refs for point light and materials
  const focusLightRef = useRef()
  const replacementBodyMatRef = useRef()
  const replacementGlassMatRef = useRef()
  const replacementVideoMatRef = useRef()
  const replacementGlowMatRef = useRef()
  const replacementBreathRef = useRef(0.1)
  const hoverRingRef = useRef()
  const hoverRingMatRef = useRef()
  const hoverRingOpacityRef = useRef(0)
  const hoverRingRotationRef = useRef(0)
  // Expanding ripple ring on hover (light ring)
  const rippleRingRef = useRef()
  const rippleRingMatRef = useRef()
  const rippleProgressRef = useRef(0)
  const rippleOpacityRef = useRef(0)
  // Hover label opacity (lerped in useFrame, state so Html re-renders)
  const [hoverLabelOpacity, setHoverLabelOpacity] = useState(0)
  // Hover scale pulse 1.0 → 1.06 → 1.0 over 300ms (one-shot on hover enter)
  const hoverScaleRef = useRef(1)
  const hoverPulseStartRef = useRef(null)
  // Ripple ring: 2 cycles then stop
  const rippleCycleCountRef = useRef(0)
  // DEBUG: ref for outer glass mesh (first orb only logs opacity/visible/scale)
  const orbMeshRef = useRef()
  // Refs for video-orb layers (hover: emissive, mid glow opacity, point light)
  const orbPointLightRef = useRef()
  const orbShellMatRef = useRef()
  const orbVideoPlaneMatRef = useRef()
  const orbGlowAuraRef = useRef()
  const orbGlowAuraMatRef = useRef()
  const orbMidGlowMatRef = useRef()
  const orbInnerHazeMatRef = useRef()

  // ── Store ────────────────────────────────────────────────────────
  const {
    hoveredOrb, setHoveredOrb,
    activePanel, setActivePanel,
    selectedOrb,
    pulsingOrbs,
    setClickPulse,
    openRitualStartTime, setOpenRitualStartTime,
    entranceTime,
    idlePulseOrbId,
    idlePulseOrbStartTime,
  } = useStore()
  const setHoveredOrbScreenPos = useStore((s) => s.setHoveredOrbScreenPos)
  const sound = useSound()

  const isSelected = activePanel?.type === 'memory' && activePanel.id === id
  const isHovered  = hoveredOrb  === id
  const isActive   = isHovered || isSelected
  const isPulsing  = id in pulsingOrbs

  const isHoverDimmed  = !!hoveredOrb && hoveredOrb !== id && !isActive && isInteractive
  const isFocusDimmed  = activePanel?.type === 'memory' && activePanel.id !== id
  const isDimmed       = isHoverDimmed || isFocusDimmed

  // Nearby hovered orb (interactive orbs only): dim slightly for spotlight (Part 5: ambient stays stable).
  const hoveredMem = hoveredOrb && memories.length ? memories.find((m) => m.id === hoveredOrb) : null
  const isNearHovered = isInteractive && !!hoveredMem && hoveredMem.id !== id && (() => {
    const [x, y, z] = position
    const [ox, oy, oz] = hoveredMem.position
    return Math.hypot(x - ox, y - oy, z - oz) < 1.5
  })()
  const nearHoveredDim = !isInteractive ? 1 : (isNearHovered ? 0.7 : 1)

  // Constellation base position (never moves)
  const basePosition = useMemo(() => new THREE.Vector3(position[0], position[1], position[2]), [position[0], position[1], position[2]])

  // Dev: verify orb position unchanged on click (must match basePosition)
  useEffect(() => {
    if (isSelected && groupRef.current && import.meta.env?.DEV) {
      const p = groupRef.current.position
      const match = Math.abs(p.x - basePosition.x) < 1e-6 &&
        Math.abs(p.y - basePosition.y) < 1e-6 &&
        Math.abs(p.z - basePosition.z) < 1e-6
      console.log(`[Orb ${id}] after click: pos=(${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}) base=(${basePosition.x},${basePosition.y},${basePosition.z}) match=${match}`)
    }
  }, [isSelected, id, basePosition])

  // Onboarding: first orb (chronologically earliest) pulses once after 2s — 3 rings + "begin here ↓" (FIX 3)
  const isOnboardingOrb = isFirstOrb
  const startHerePulseRef = useRef(null)
  const triggerStartHereRef = useRef(false)
  const startHereRingRefs = [useRef(), useRef(), useRef()]
  const startHereRingMatRefs = [useRef(), useRef(), useRef()]
  const [beginHereOpacity, setBeginHereOpacity] = useState(0)
  useEffect(() => {
    if (!isOnboardingOrb) return
    const t = setTimeout(() => {
      triggerStartHereRef.current = true
    }, 2000)
    return () => clearTimeout(t)
  }, [isOnboardingOrb])

  // Panel visibility — ritual: show at 600ms, materialize 600–900ms, formed at 900ms
  const [showPanel, setShowPanel] = useState(false)
  const [panelClosing, setPanelClosing] = useState(false)
  const [panelPhase, setPanelPhase] = useState(null) // 'materialize' | 'formed'
  useEffect(() => {
    if (isSelected) {
      setPanelClosing(false)
      panelShownRef.current = false
      panelPhaseRef.current = null
    } else if (showPanel) {
      setPanelClosing(true)
      const timer = setTimeout(() => {
        setShowPanel(false)
        setPanelClosing(false)
        setPanelPhase(null)
        panelShownRef.current = false
        panelPhaseRef.current = null
      }, 260)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected])

  // Panel offset in the direction FROM the orb TOWARD the scene origin,
  // so it always stays in the "open" space between the orb and screen centre.
  const panelSide   = position[0] >= 0 ? 'left' : 'right'
  const dirSign     = panelSide === 'right' ? 1 : -1
  const panelOffX   = dirSign * (RADIUS + 0.55)
  // Slight vertical nudge toward centre (e.g. top-left orb → panel shifts down-right)
  const panelOffY   = Math.abs(position[1]) > 0.6
    ? -Math.sign(position[1]) * RADIUS * 0.55
    : 0

  // ── Intro / pulse bookkeeping ────────────────────────────────────
  const pulseStartRef = useRef(null)
  const wasPulsingRef = useRef(false)
  const PULSE_DUR     = isCore ? 4.5 : 7.0

  // ── Memos ────────────────────────────────────────────────────────
  const seed      = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbColor  = useMemo(() => new THREE.Color(orbGlow), [orbGlow])
  const innerLightColor = useMemo(() => new THREE.Color(orbInnerLight), [orbInnerLight])
  const coreColor = useMemo(() => new THREE.Color(orbCore), [orbCore])
  // Full saturation for bright core (distinct per palette)
  const coreBrightColor = useMemo(() => new THREE.Color(orbInnerLight), [orbInnerLight])
  // Forest palette: use glow as primary (no ethereal remap)
  const etherealColor = useMemo(() => new THREE.Color(orbGlow), [orbGlow])
  // Idle life: per-orb micro float speed and subtle Y rotation (0.001–0.003 rad/s)
  const floatSpeed = useMemo(() => 0.12 + (seed / (Math.PI * 2)) * 0.08, [seed])
  const rotSpeedY  = useMemo(() => 0.001 + (seed / (Math.PI * 2)) * 0.002, [seed])
  const glowFreq   = useMemo(() => 0.25 + (seed / (Math.PI * 2)) * 0.12, [seed])

  // Always start with the orb's own colour — material colour is flipped
  // to #ffffff imperatively after the texture/video actually loads, so the
  // map's true colours are reproduced. This prevents the "silver glass ball"
  // look that occurred when baseColor was unconditionally white.
  const baseColor = useMemo(() => new THREE.Color(color), [color])

  // shortTitle for hover whisper: 2–3 words max (FIX 2d)
  const shortTitle = useMemo(() => {
    if (labelShort && !labelShort.includes(' · ')) return labelShort
    const words = (title || '').split(/\s+/).filter(Boolean)
    return words.slice(0, 3).join(' ') || labelShort || title || ''
  }, [title, labelShort])

  const dust = useMemo(() => {
    const count = isCore ? 15 : 12
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = RADIUS * (1.2 + Math.random() * 0.8)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return { count, positions }
  }, [RADIUS, isCore])

  // Center orb: 10 particles in slow orbit (radius RADIUS*1.5)
  const orbitParticles = useMemo(() => {
    if (!isRoot) return []
    const count = 10
    const r = RADIUS * 1.5
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return [r * Math.cos(angle), 0, r * Math.sin(angle)]
    })
  }, [isRoot, RADIUS])

  // Radial gradient texture for glow sprite (light from inside orb, no rings)
  const auraTex = useMemo(() => {
    const SIZE = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIZE
    const ctx  = canvas.getContext('2d')
    const half = SIZE / 2
    const c    = new THREE.Color(color)
    const rv   = Math.round(c.r * 255)
    const gv   = Math.round(c.g * 255)
    const bv   = Math.round(c.b * 255)
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
    grad.addColorStop(0.00, 'rgba(255,255,255,0.95)')
    grad.addColorStop(0.20, 'rgba(' + rv + ',' + gv + ',' + bv + ',0.80)')
    grad.addColorStop(0.55, 'rgba(' + rv + ',' + gv + ',' + bv + ',0.25)')
    grad.addColorStop(1.00, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, SIZE, SIZE)
    return new THREE.CanvasTexture(canvas)
  }, [color])

  // Soft outer glow (always visible): radial gradient, ethereal color, 2× orb diameter, opacity 0.15
  const outerGlowTex = useMemo(() => {
    const SIZE = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIZE
    const ctx = canvas.getContext('2d')
    const half = SIZE / 2
    const c = etherealColor
    const rv = Math.round(c.r * 255)
    const gv = Math.round(c.g * 255)
    const bv = Math.round(c.b * 255)
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
    grad.addColorStop(0, `rgba(${rv},${gv},${bv},0.4)`)
    grad.addColorStop(0.4, `rgba(${rv},${gv},${bv},0.15)`)
    grad.addColorStop(0.7, `rgba(${rv},${gv},${bv},0.04)`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, SIZE, SIZE)
    return new THREE.CanvasTexture(canvas)
  }, [etherealColor])

  // Soft bloom ring texture (faint halo, orb-colored burst for shell crack)
  const bloomRingTex = useMemo(() => {
    const SIZE = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIZE
    const ctx  = canvas.getContext('2d')
    const half = SIZE / 2
    const c = new THREE.Color(color)
    const rv = Math.round(c.r * 255)
    const gv = Math.round(c.g * 255)
    const bv = Math.round(c.b * 255)
    const grad = ctx.createRadialGradient(half, half, half * 0.3, half, half, half)
    grad.addColorStop(0, 'rgba(255,255,255,0.15)')
    grad.addColorStop(0.4, `rgba(${rv},${gv},${bv},0.12)`)
    grad.addColorStop(0.7, `rgba(${rv},${gv},${bv},0.05)`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, SIZE, SIZE)
    return new THREE.CanvasTexture(canvas)
  }, [color])

  // Light seam texture — thin vertical streak (relic unlock flash)
  const seamTex = useMemo(() => {
    const W = 8
    const H = 64
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    const g = ctx.createLinearGradient(0, 0, W, 0)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.35, 'rgba(0,255,255,0.25)')
    g.addColorStop(0.5, 'rgba(255,255,255,0.4)')
    g.addColorStop(0.65, 'rgba(0,255,255,0.25)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    return new THREE.CanvasTexture(canvas)
  }, [])

  const hasMedia = !!(memory.videoSrc || /\.(png|jpe?g|webp)$/i.test(memory.image || ''))

  // ── Video texture ───────────────────────────────────────────────
  const [mediaTex, setMediaTex] = useState(null)
  const videoReady = !!mediaTex

  // ── Image texture for photo orbs (e.g. belong.png) — visible through glass ──
  const [imageTex, setImageTex] = useState(null)
  const imageTexRef = useRef(null)
  const isPhotoOrb = /\.(png|jpe?g|webp)$/i.test(memory.image || '')
  useEffect(() => {
    if (!memory.image || !isPhotoOrb) return
    const loader = new THREE.TextureLoader()
    loader.load(
      memory.image,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        if (memory.isRoot) {
          tex.wrapS = THREE.ClampToEdgeWrapping
          tex.wrapT = THREE.ClampToEdgeWrapping
          tex.repeat.set(1, 1)
          tex.offset.set(0.1, 0.2)
        }
        imageTexRef.current = tex
        setImageTex(tex)
      },
      undefined,
      () => setImageTex(null)
    )
    return () => {
      if (imageTexRef.current) {
        imageTexRef.current.dispose()
        imageTexRef.current = null
      }
      setImageTex(null)
    }
  }, [memory.image, isPhotoOrb])

  const hasImageTexture = !!imageTex
  // Prefer video when available so ROOT orb shows playing video, not static image
  const bodyTexture = (memory.videoSrc && mediaTex) ? mediaTex : (hasImageTexture ? imageTex : mediaTex)

  // Circular alpha for "I Earned My Place" orb flat portrait (create after mount)
  const [circleAlphaTex, setCircleAlphaTex] = useState(null)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const r = size / 2
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(r, r, r - 1, 0, Math.PI * 2)
    ctx.fill()
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    setCircleAlphaTex(tex)
    return () => {
      tex.dispose()
      setCircleAlphaTex(null)
    }
  }, [])

  useEffect(() => {
    if (!memory.videoSrc || typeof document === 'undefined') return

    const videoUrl = getVideoUrl(memory.videoSrc)
    const video = document.createElement('video')
    // Same-origin paths: avoid crossOrigin so static files load without CORS
    const isSameOrigin = videoUrl.startsWith('/') || (typeof window !== 'undefined' && videoUrl.startsWith(window.location.origin))
    if (!isSameOrigin) video.crossOrigin = 'anonymous'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.preload = 'auto'
    video.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;top:-9999px'
    document.body.appendChild(video)
    videoRef.current = video

    // Set src after append so it loads in document context; then trigger load
    video.src = videoUrl
    video.load()

    let built = false
    let texRef = null
    const buildTex = () => {
      if (built) return
      built = true
      const tex = new THREE.VideoTexture(video)
      texRef = tex
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.needsUpdate = true
      tex.format = THREE.RGBAFormat
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.center.set(0.5, 0.5)
      tex.rotation = 0
      // Center-crop: show center of video so it fills the circle without warp
      const w = video.videoWidth || video.width || 1
      const h = video.videoHeight || video.height || 1
      if (w > 0 && h > 0) {
        const r = w / h
        if (r >= 1) {
          tex.repeat.set(1 / r, 1)
          tex.offset.set((1 - 1 / r) / 2, 0)
        } else {
          tex.repeat.set(1, r)
          tex.offset.set(0, (1 - r) / 2)
        }
      } else {
        tex.repeat.set(1, 1)
        tex.offset.set(0, 0)
        video.addEventListener('loadedmetadata', onMeta, { once: true })
      }
      setMediaTex(tex)
    }
    const onMeta = () => {
      if (texRef && video.videoWidth > 0 && video.videoHeight > 0) {
        const w = video.videoWidth
        const h = video.videoHeight
        const r = w / h
        if (r >= 1) {
          texRef.repeat.set(1 / r, 1)
          texRef.offset.set((1 - 1 / r) / 2, 0)
        } else {
          texRef.repeat.set(1, r)
          texRef.offset.set(0, (1 - r) / 2)
        }
      }
    }

    video.addEventListener('playing', buildTex, { once: true })
    video.addEventListener('canplay', () => {
      video.play().catch(() => {})
      setTimeout(buildTex, 150)
    }, { once: true })
    video.addEventListener('loadeddata', () => setTimeout(buildTex, 100), { once: true })
    video.addEventListener('error', (e) => {
      built = true
      setMediaTex(null)
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[MemoryOrb] Video failed to load:', memory.videoSrc, video.error?.message || e)
      }
    }, { once: true })
    video.play().catch(() => {})

    return () => {
      built = true
      if (texRef) {
        texRef.dispose()
        texRef = null
      }
      setMediaTex(null)
      videoRef.current = null
      video.pause()
      video.removeAttribute('src')
      video.load()
      try { document.body.removeChild(video) } catch {}
    }
  }, [memory.videoSrc])

  // Once the texture is ready, switch body material colour to white so
  // video/photo colours render correctly.
  useEffect(() => {
    if (mediaTex && bodyMat.current) {
      bodyMat.current.color.set('#ffffff')
      bodyMat.current.needsUpdate = true
    }
  }, [mediaTex])

  // ── Animation loop ──────────────────────────────────────────────
  useFrame((state, delta) => {
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    tRef.current = t
    if (!groupRef.current) return

    // Start-here pulse (FIX 3): trigger once after 2s on first orb
    if (triggerStartHereRef.current && isOnboardingOrb) {
      startHerePulseRef.current = t
      onboardingStartRef.current = t
      triggerStartHereRef.current = false
    }
    const pulseStart = startHerePulseRef.current
    if (pulseStart != null && isOnboardingOrb) {
      const elapsed = t - pulseStart
      for (let i = 0; i < 3; i++) {
        const ringStart = pulseStart + i * 0.3
        const el = t - ringStart
        const mesh = startHereRingRefs[i].current
        const mat = startHereRingMatRefs[i].current
        if (mesh && mat) {
          if (el < 0) {
            mesh.visible = false
          } else if (el < 1.2) {
            mesh.visible = true
            const p = el / 1.2
            const scale = 1 + p * 2
            mesh.scale.setScalar(scale)
            mat.opacity = 0.6 * (1 - p)
          } else {
            mesh.visible = false
          }
        }
      }
      if (elapsed >= 0 && elapsed < 0.5) setBeginHereOpacity((elapsed / 0.5) * 0.5)
      else if (elapsed >= 0.5 && elapsed < 2.5) setBeginHereOpacity(0.5)
      else if (elapsed >= 2.5 && elapsed < 3) setBeginHereOpacity(0.5 * (1 - (elapsed - 2.5) / 0.5))
      else if (elapsed >= 3) setBeginHereOpacity(0)
    }

    // Gentle floating sway: base position + tiny sine/cosine offset (barely perceptible, dreamlike).
    const swayX = Math.sin(t * 0.3 + index * 1.5) * 0.03
    const swayY = Math.cos(t * 0.4 + index * 0.8) * 0.02
    // No drift of other orbs toward/away from hovered orb — one-orb-one-response; rest stay stable.
    groupRef.current.position.x = basePosition.x + swayX
    groupRef.current.position.y = basePosition.y + swayY
    groupRef.current.position.z = basePosition.z

    // Report screen position when this orb is hovered (for glow overlay)
    if (isHovered && groupRef.current && setHoveredOrbScreenPos) {
      groupRef.current.getWorldPosition(videoWorldPosRef.current)
      const ndc = videoWorldPosRef.current.clone().project(state.camera)
      const sx = (ndc.x + 1) / 2 * size.width
      const sy = (1 - ndc.y) / 2 * size.height
      setHoveredOrbScreenPos([sx, sy])
    }

    if (mediaTex && videoRef.current && videoRef.current.readyState >= 2) {
      mediaTex.needsUpdate = true
    }
    // Every orb with a video shows it by default: autoplay, no hover required.
    if (videoRef.current && memory.videoSrc) {
      const cam = state.camera
      groupRef.current.getWorldPosition(videoWorldPosRef.current)
      const dist = cam.position.distanceTo(videoWorldPosRef.current)
      const shouldPlay = true
      if (shouldPlay && videoRef.current.paused) videoRef.current.play().catch(() => {})
    }

    // Entrance: T+2s + entranceOrder*0.1 (stagger 100ms), duration 0.4s. Scale 0.7→1, opacity 0→1.
    // Force complete (1) so orbs are always visible regardless of intro state.
    const entranceDelay = 2 + entranceOrder * 0.1
    const entranceDur = 0.4
    const entranceRaw = Math.max(0, Math.min(1, (entranceTime - entranceDelay) / entranceDur))
    const entranceEase = 1 - Math.pow(1 - entranceRaw, 2)
    const entranceScale = 0.7 + 0.3 * entranceEase
    const entranceOpacity = entranceEase
    const entranceComplete = true // skip intro: orbs and tendrils always visible
    const ORB_BASE_OPACITY = 0.85 // FIX 6: slightly reduce orb base for hierarchy
    const entranceScaleFinal = entranceComplete ? 1 : entranceScale
    const entranceOpacityFinal = entranceComplete ? ORB_BASE_OPACITY : entranceOpacity * ORB_BASE_OPACITY
    const visualScaleMult = visualTier === 'hero' ? 1.22 : visualTier === 'secondary' ? 0.86 : 1
    const ambientScaleMult = orbType === 'ambient' ? 0.62 : 1
    const ambientOpacityMult = orbType === 'ambient' ? 0.32 : 1
    const ambientGlowMult = orbType === 'ambient' ? 0.35 : 1
    const secondaryScaleMult = isPrimary ? 1 : 0.72
    const secondaryOpacityMult = (isPrimary ? 1 : 0.56) * ambientOpacityMult
    const visualGlowMult = visualTier === 'hero' ? 1.12 : visualTier === 'secondary' ? 0.75 : 1
    const secondaryGlowMult = (isPrimary ? 1 : 0.55) * visualGlowMult * ambientGlowMult
    const effectiveOpacityFinal = entranceOpacityFinal * secondaryOpacityMult

    // Ritual: set openRitualStartTime once when this orb becomes selected
    if (isSelected) {
      if (!ritualStartSetRef.current) {
        ritualStartRef.current = t
        setOpenRitualStartTime(t)
        ritualStartSetRef.current = true
      }
      const ritualElapsed = ritualStartRef.current != null ? t - ritualStartRef.current : 0
      // Step 2 (150ms): shell crack — trigger bloom ring burst
      if (ritualElapsed >= 0.15 && !shellCrackDoneRef.current) {
        bloomRingStartRef.current = t
        shellCrackDoneRef.current = true
      }
      // Step 4–5: show panel at 600ms, formed at 900ms
      if (ritualElapsed >= 0.6 && !panelShownRef.current) {
        setShowPanel(true)
        setPanelPhase('materialize')
        panelShownRef.current = true
        panelPhaseRef.current = 'materialize'
      }
      if (ritualElapsed >= 0.9 && panelPhaseRef.current !== 'formed') {
        setPanelPhase('formed')
        panelPhaseRef.current = 'formed'
      }
    } else {
      ritualStartSetRef.current = false
      ritualStartRef.current = null
      shellCrackDoneRef.current = false
      prevWasSelectedRef.current = false
    }
    if (isSelected) prevWasSelectedRef.current = true

    // Pulse event
    if (isPulsing && !wasPulsingRef.current) pulseStartRef.current = t
    wasPulsingRef.current = isPulsing
    let pulseFactor = 0
    if (pulseStartRef.current !== null) {
      const pe = t - pulseStartRef.current
      if (pe < PULSE_DUR) pulseFactor = Math.sin((pe / PULSE_DUR) * Math.PI)
      else if (!isPulsing) pulseStartRef.current = null
    }

    // Position/rotation: idle life above; scale/emissive/opacity only below.

    // Breathing glow: crystalline pulse — 0.8 Hz memory / 0.4 Hz center, phase index*1.3
    const phaseOffset = index * 1.3
    const breathTimeMult = isHovered ? 1.3 : 1.0
    const breathMin = isHovered ? 0.7 : 0.5
    const breathMax = isHovered ? 1.0 : 1.0
    const sineRaw = Math.sin(t * BREATHE_ANGULAR * breathTimeMult + phaseOffset) * 0.5 + 0.5
    const organic = Math.pow(sineRaw, 1.5)
    const breathTarget = breathMin + organic * (breathMax - breathMin)
    if (breathRef.current === undefined) breathRef.current = breathTarget
    breathRef.current = THREE.MathUtils.lerp(breathRef.current, breathTarget, Math.min(1, delta * 4))
    const breathFactor = breathRef.current

    // Focus dim: keep selected orb visibly present (clarity-first).
    const dimLerp = Math.min(1, delta * 2.0)
    const focusDimTarget = isSelected ? 0.85 : (isFocusDimmed ? 0.55 : 1)
    if (dimMultiplierRef.current === undefined) dimMultiplierRef.current = focusDimTarget
    dimMultiplierRef.current = THREE.MathUtils.lerp(dimMultiplierRef.current, focusDimTarget, dimLerp)
    const dimMultiplier = dimMultiplierRef.current * nearHoveredDim

    // Hover response: smooth 0→1 over 400ms when hovered, 1→0 when not (world response, not UI pop)
    const hoverTarget = isHovered ? 1 : 0
    const hoverLerp = Math.min(1, delta / 0.4)
    hoverFactorRef.current = THREE.MathUtils.lerp(hoverFactorRef.current, hoverTarget, hoverLerp)
    const hoverFactor = hoverFactorRef.current

    // Replacement orb: subtle breathing glow (0.05–0.15, hover up to 0.25) + point light + hover ring
    const replacementBreathTarget = isHovered ? 0.25 : (0.1 + Math.sin(t * 0.8 + index * 1.3) * 0.05)
    replacementBreathRef.current = THREE.MathUtils.lerp(
      replacementBreathRef.current,
      Math.min(0.3, replacementBreathTarget),
      Math.min(1, delta * 4)
    )
    if (replacementBodyMatRef.current) {
      replacementBodyMatRef.current.emissiveIntensity = replacementBreathRef.current
    }
    if (focusLightRef.current) {
      const lightTarget = isHovered ? 0.4 : 0.15
      const intensityTgt = THREE.MathUtils.lerp(
        focusLightRef.current.intensity,
        Math.min(0.4, lightTarget),
        Math.min(1, delta * 5)
      )
      focusLightRef.current.intensity = Math.min(0.45, intensityTgt)
      focusLightRef.current.distance = 2.0
    }
    const ringOpacityTarget = isHovered ? 0.4 : 0
    hoverRingOpacityRef.current = THREE.MathUtils.lerp(
      hoverRingOpacityRef.current,
      ringOpacityTarget,
      Math.min(1, delta * 4)
    )
    if (hoverRingRef.current && hoverRingMatRef.current) {
      hoverRingRef.current.visible = hoverRingOpacityRef.current > 0.01
      hoverRingMatRef.current.opacity = hoverRingOpacityRef.current
      hoverRingRotationRef.current += delta * 0.5
      hoverRingRef.current.rotation.z = hoverRingRotationRef.current
      const ringScalePulse = 1.0 + 0.05 * (0.5 + 0.5 * Math.sin(t * 2))
      hoverRingRef.current.scale.setScalar(ringScalePulse)
    }

    // Aura glow: initial 0.6/0 → 2.2/0.45 over 500ms, then fade to 0.15; subtle rotation over time
    if (auraRef.current && auraMatRef.current) {
      if (isSelected && auraStartRef.current !== null) {
        const aa    = t - auraStartRef.current
        const BLOOM = 0.50
        if (aa < BLOOM) {
          const p     = aa / BLOOM
          const eased = 1 - (1 - p) * (1 - p)
          auraRef.current.scale.setScalar(0.6 + eased * 1.6)
          auraMatRef.current.opacity = eased * 0.35
        } else {
          auraRef.current.scale.setScalar(2.2)
          auraMatRef.current.opacity = THREE.MathUtils.lerp(auraMatRef.current.opacity, 0.12, 0.02)
        }
        auraRef.current.rotation.z = t * 0.04
      } else if (!isSelected) {
        auraMatRef.current.opacity = THREE.MathUtils.lerp(auraMatRef.current.opacity, 0, 0.06)
        auraRef.current.scale.setScalar(THREE.MathUtils.lerp(auraRef.current.scale.x, 0.6, 0.06))
        auraRef.current.rotation.z = t * 0.04
        if (auraMatRef.current.opacity < 0.008) {
          auraMatRef.current.opacity = 0
          auraRef.current.scale.setScalar(0.6)
          auraStartRef.current = null
        }
      }
    }
    // Hover aura (billboard sprite): 2× → 3× diameter, 0.05 → 0.25 opacity, warmer tint on hover
    if (outerGlowRef.current && outerGlowMatRef.current) {
      const targetScale = isHovered ? (RADIUS * 6) : (RADIUS * 4)
      const lerpK = isHovered ? Math.min(1, delta * 5) : Math.min(1, delta * 3)
      outerGlowRef.current.scale.x = THREE.MathUtils.lerp(outerGlowRef.current.scale.x, targetScale, lerpK)
      outerGlowRef.current.scale.y = THREE.MathUtils.lerp(outerGlowRef.current.scale.y, targetScale, lerpK)
      outerGlowRef.current.scale.z = 1

      const baseOpacity = isHovered ? 0.25 : 0.05
      outerGlowMatRef.current.opacity = THREE.MathUtils.lerp(
        outerGlowMatRef.current.opacity,
        baseOpacity * dimMultiplier * (isDimmed ? 0.6 : 1) * effectiveOpacityFinal,
        lerpK
      )

      // Warm shift: mix 20% white into orb color on hover
      hoverAuraColorRef.current.copy(orbColor)
      if (isHovered) hoverAuraColorRef.current.lerp(whiteRef.current, 0.2)
      outerGlowMatRef.current.color.copy(hoverAuraColorRef.current)
    }

    // Soft bloom ring: scale 1→1.8 over 400ms, opacity max 0.2, fade out (no hard ripple)
    if (bloomRingRef.current && bloomRingMatRef.current && bloomRingStartRef.current !== null) {
      const br = t - bloomRingStartRef.current
      const DUR = 0.40
      if (br < DUR) {
        const p = br / DUR
        const scaleP = 1 + 0.8 * p
        bloomRingRef.current.scale.setScalar(scaleP)
        bloomRingMatRef.current.opacity = 0.2 * (1 - p * p)
      } else {
        bloomRingMatRef.current.opacity = 0
        bloomRingRef.current.scale.setScalar(0.001)
        bloomRingStartRef.current = null
      }
    }

    // Light seam: thin vertical streak flash 150–250ms (relic activation)
    if (seamRef.current && seamMatRef.current && seamStartRef.current !== null) {
      const ss = t - seamStartRef.current
      const SEAM_DUR = 0.22
      if (ss < SEAM_DUR) {
        seamMatRef.current.opacity = 0.35 * (1 - ss / SEAM_DUR)
      } else {
        seamMatRef.current.opacity = 0
        seamStartRef.current = null
      }
    }

    // Scale — only the clicked orb grows; no scale-up on hover (organic response is emissive/light only)
    const breathe   = 0.97 + (Math.sin(t * BREATHE_SPEED + seed) * 0.5 + 0.5) * 0.06
    const hoverMul  = isSelected ? 1.20 : 1.0
    const pulseMul  = 1 + pulseFactor * (isCore ? 0.28 : 0.18)
    let onboardingMul = 1
    if (isOnboardingOrb && onboardingStartRef.current !== null && onboardingStartRef.current !== -1) {
      if (onboardingStartRef.current === true) onboardingStartRef.current = t
      const oel = t - onboardingStartRef.current
      if (oel < 0.4) onboardingMul = 1 + 0.2 * (oel / 0.4)
      else if (oel < 0.8) onboardingMul = 1.2 - 0.2 * ((oel - 0.4) / 0.4)
      else {
        onboardingMul = 1
        onboardingStartRef.current = -1
      }
    }
    // Hover scale pulse: 1.0 → 1.04 → 1.0 over 0.5s (singular focal response, no extra “orb” feel)
    if (isHovered && hoverPulseStartRef.current === null) hoverPulseStartRef.current = t
    if (!isHovered) hoverPulseStartRef.current = null

    const hoverScaleTgt = isHovered ? 1.15 : 1
    const scaleLerpK = isHovered ? Math.min(1, delta / 0.25) : Math.min(1, delta / 0.3)
    hoverScaleRef.current = THREE.MathUtils.lerp(hoverScaleRef.current, hoverScaleTgt, scaleLerpK * 4)
    const idlePulseMult = 1 + 0.015 * (1 + Math.sin(t * (Math.PI * 2 / 4)))
    let target = entranceScaleFinal * breathe * hoverMul * pulseMul * onboardingMul * hoverScaleRef.current * idlePulseMult * secondaryScaleMult * visualScaleMult * ambientScaleMult
    const scaleLerp = isSelected ? 0.14 : 0.06
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, target, scaleLerp)
    )

    // Halo — other orbs dim to 40%; keep opacity low to avoid bloom washout
    if (haloMat.current) {
      const baseOp = (hasMedia && videoReady) ? 0.04 : 0.05
      let tgt = isSelected ? baseOp * 1.5
               : baseOp * dimMultiplier * (isHoverDimmed ? 0.45 : isHovered ? 1.3 : 1)
      if (!isSelected) tgt *= 1 + hoverFactor * 0.2
      tgt *= secondaryGlowMult
      tgt *= effectiveOpacityFinal
      haloMat.current.opacity = THREE.MathUtils.lerp(haloMat.current.opacity, tgt, dimLerp)
    }

    // Fresnel rim
    if (rimMat.current) {
      const rimBase = (hasMedia && videoReady) ? 0.03 : 0.04
      let rimTgt = isSelected ? rimBase * 1.5
                  : rimBase * dimMultiplier * (isHoverDimmed ? 0.35 : isHovered ? 1.5 : 1)
      if (!isSelected) rimTgt *= 1 + hoverFactor * 0.2
      rimTgt *= secondaryGlowMult
      rimTgt *= effectiveOpacityFinal
      rimMat.current.opacity = THREE.MathUtils.lerp(rimMat.current.opacity, rimTgt, dimLerp)
    }

    // Body — crystalline glass shell: hover makes shell clearer + adds edge brightening
    if (bodyMat.current) {
      const shellOpacity = (isHovered ? 0.15 : 0.3) + (breathFactor - 0.5) * 0.04
      if (bodyMat.current.clearcoat !== undefined) {
        const ccTgt = isHovered ? 0.8 : 0.3
        bodyMat.current.clearcoat = THREE.MathUtils.lerp(bodyMat.current.clearcoat, ccTgt, dimLerp)
      }
      if (memory.videoSrc && mediaTex && videoReady) {
        // Video orbs: outer shell is clear glass — more transparent when hovered so video inside is clearer
        const shellOpacityTgt = isHovered ? 0.15 : 0.3
        const opTgt = (isFocusDimmed ? 0.4 : 1) * dimMultiplier * shellOpacityTgt
        bodyMat.current.opacity = THREE.MathUtils.lerp(bodyMat.current.opacity, opTgt * effectiveOpacityFinal, dimLerp)
        if (isRoot && bodyMat.current.emissive) {
          const shift = Math.sin(t * 0.4) * 0.5 + 0.5
          bodyMat.current.emissive.setRGB(
            0.4 + shift * 0.2,
            0.65 + shift * 0.25,
            0.95 + shift * 0.05
          )
        }
      } else if (mediaTex && videoReady) {
        const opTgt = (isFocusDimmed ? 0.4 : 1) * dimMultiplier
        bodyMat.current.opacity = THREE.MathUtils.lerp(bodyMat.current.opacity, opTgt * effectiveOpacityFinal, dimLerp)
        if (isRoot && bodyMat.current.emissive) {
          const shift = Math.sin(t * 0.4) * 0.5 + 0.5
          bodyMat.current.emissive.setRGB(
            0.4 + shift * 0.2,
            0.65 + shift * 0.25,
            0.95 + shift * 0.05
          )
        }
      } else if (coreFlashRef.current !== null) {
        const sa    = t - coreFlashRef.current
        const RAMP  = 0.25
        const SETTLE = 0.60
        if (sa < RAMP) {
          const p = sa / RAMP
          bodyMat.current.emissiveIntensity = EM_BASE + p * p * (0.15 - EM_BASE)
        } else if (sa < RAMP + SETTLE) {
          const p = (sa - RAMP) / SETTLE
          const easeOut = 1 - (1 - p) * (1 - p)
          bodyMat.current.emissiveIntensity = 0.15 - easeOut * (0.15 - 0.12)
        } else {
          bodyMat.current.emissiveIntensity = THREE.MathUtils.lerp(
            bodyMat.current.emissiveIntensity, 0.12, 0.06
          )
          if (Math.abs(bodyMat.current.emissiveIntensity - 0.12) < 0.02) coreFlashRef.current = null
        }
        bodyMat.current.opacity = THREE.MathUtils.lerp(bodyMat.current.opacity, shellOpacity * effectiveOpacityFinal, 0.05)
      } else {
        const pulse    = Math.sin(t * PULSE_SPEED) * 0.5 + 0.5
        const emIdle   = EM_BASE + pulse * EM_BASE * 0.25
        const glowFluct = Math.sin(t * glowFreq) * 0.1
        const gaveLight = isSelected && panelPhaseRef.current === 'formed'
        const emTgt   = isFocusDimmed ? breathFactor * dimMultiplier * EM_BASE * (1 + hoverFactor * 0.2)
                      : isHoverDimmed  ? EM_BASE * 0.25
                      : isSelected     ? (gaveLight ? 0.15 : 0.15)
                      :                  breathFactor * dimMultiplier * (1 + hoverFactor * 0.2)
        bodyMat.current.emissiveIntensity = Math.min(0.15, THREE.MathUtils.lerp(
          bodyMat.current.emissiveIntensity, emTgt, dimLerp
        ))
        if (!bodyTexture) {
          bodyMat.current.opacity = THREE.MathUtils.lerp(bodyMat.current.opacity, shellOpacity * dimMultiplier * effectiveOpacityFinal, dimLerp)
        }
      }
    }

    // Inner video sphere: no emissive — video provides its own brightness (set once on material)

    // Dust — tiny sparkles: slow orbit (4–8s), gentle opacity pulse, hover brightens
    if (dustRef.current) {
      const orbitSpeed = (Math.PI * 2 / 6) * (isHovered ? 1.5 : 1) * (0.9 + (seed / (Math.PI * 2)) * 0.2)
      dustRef.current.rotation.y = t * orbitSpeed + seed
      dustRef.current.rotation.z = Math.sin(t * 0.22 + seed) * 0.25
      const dustScaleTgt = isHovered ? 1.2 : 1.0
      const lerpK = isHovered ? Math.min(1, delta * 5) : Math.min(1, delta * 3)
      dustRef.current.scale.setScalar(THREE.MathUtils.lerp(dustRef.current.scale.x, dustScaleTgt, lerpK))
    }
    if (dustMat.current) {
      const opacityOsc = 0.06 * Math.sin(t * 2.1)
      const base = 0.3 + opacityOsc
      const hoverTgt = 0.6 + opacityOsc
      const tgt  = isDimmed ? base * 0.4 * dimMultiplier
                 : isHovered ? hoverTgt * dimMultiplier
                 : base * dimMultiplier
      dustMat.current.opacity = THREE.MathUtils.lerp(dustMat.current.opacity, Math.min(1, tgt * effectiveOpacityFinal), dimLerp)
    }

    // Point lights — capped to prevent scene washout: max intensity 0.2, distance 1.5
    if (pointRef.current) {
      const intensityTgt = Math.min(0.2, (isHovered ? 0.18 : 0.12) * (isFocusDimmed || isDimmed ? dimMultiplier : 1))
      pointRef.current.intensity = THREE.MathUtils.lerp(pointRef.current.intensity, intensityTgt, dimLerp)
      pointRef.current.distance = 1.5
    }
    if (corePtRef.current) {
      const breathIntensity = Math.min(0.2, isRoot ? 0.18 : POINT_INTENSITY_MIN + breathFactor * (POINT_INTENSITY_MAX - POINT_INTENSITY_MIN))
      const baseTgt = breathIntensity * (isSelected ? 1.1 : isHovered ? 1.05 : 1.0) * (isFocusDimmed || isDimmed ? dimMultiplier : 1)
      corePtRef.current.intensity = THREE.MathUtils.lerp(corePtRef.current.intensity, Math.min(0.2, baseTgt), dimLerp)
      corePtRef.current.distance = 1.5
    }

    // Center orb: slow orbit of particles
    if (orbitParticlesRef.current && isRoot) {
      orbitParticlesRef.current.rotation.y = t * 0.15
    }

    // ── Memory immersion: dim other orbs, brighten selected (lerp delta*2, ~1s)
    // Only override light/emissive when a panel state is active; otherwise breathing+hover block controls them.
    const memLerp = Math.min(1, delta * 2.0)
    if (isSelected || isFocusDimmed) {
      if (focusLightRef.current) {
        const lightTgt = isSelected ? 0.3 : 0.15
        focusLightRef.current.intensity = THREE.MathUtils.lerp(focusLightRef.current.intensity, Math.min(0.4, lightTgt), memLerp)
        focusLightRef.current.distance = 2.0
      }
      if (replacementBodyMatRef.current) {
        const emTgt = isSelected ? 0.3 : 0.08
        const opTgt = isSelected ? 0.8 : 0.08
        replacementBodyMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          replacementBodyMatRef.current.emissiveIntensity,
          Math.min(0.3, emTgt),
          memLerp
        )
        replacementBodyMatRef.current.opacity = THREE.MathUtils.lerp(
          replacementBodyMatRef.current.opacity, opTgt, memLerp
        )
      }
    } else {
      // No panel open: restore full opacity so orbs are always visible
      if (replacementBodyMatRef.current) {
        replacementBodyMatRef.current.opacity = THREE.MathUtils.lerp(
          replacementBodyMatRef.current.opacity, 0.85, memLerp
        )
      }
    }
    if (replacementGlassMatRef.current) {
      replacementGlassMatRef.current.opacity = 0.06
      // Clearcoat: 0.5 → 1.0 on hover (lerp)
      const clearcoatTgt = isHovered ? 1.0 : 0.5
      replacementGlassMatRef.current.clearcoat = THREE.MathUtils.lerp(
        replacementGlassMatRef.current.clearcoat,
        clearcoatTgt,
        Math.min(1, delta * 5)
      )
    }
    if (replacementVideoMatRef.current) {
      const videoOpTgt = isFocusDimmed ? 0.08 : 1
      replacementVideoMatRef.current.opacity = THREE.MathUtils.lerp(
        replacementVideoMatRef.current.opacity, videoOpTgt, memLerp
      )
      if (replacementVideoMatRef.current.emissiveIntensity !== undefined) {
        const videoEmTgt = isHovered ? 0.1 : 0
        replacementVideoMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          replacementVideoMatRef.current.emissiveIntensity,
          videoEmTgt,
          Math.min(1, delta * 5)
        )
      }
    }
    // Inner glow layer: 0.08 → 0.2 on hover (lerp delta*5), else breathing 0.02–0.08
    if (replacementGlowMatRef.current) {
      const glowBase = 0.05 + Math.sin(t * 0.8 + index * 1.3) * 0.03
      const glowTgt = isHovered ? 0.2 : THREE.MathUtils.clamp(glowBase, 0.02, 0.08)
      const glowVal = THREE.MathUtils.lerp(
        replacementGlowMatRef.current.opacity,
        glowTgt,
        Math.min(1, delta * 5)
      )
      replacementGlowMatRef.current.opacity = THREE.MathUtils.clamp(glowVal, 0.02, 0.25)
    }
    // ── Orb materials + point light: bioluminescent (non-video) or video shell ──
    const isVideoOrb = !!(memory.videoSrc && mediaTex)
    const hoverLerpSpeed = isHovered ? delta / 0.25 : delta / 0.4
    const pointLightTgt = isHovered ? 1.5 : 0.8
    const dimMult = isHoverDimmed ? 0.4 : 1
    if (orbPointLightRef.current) {
      orbPointLightRef.current.intensity = THREE.MathUtils.lerp(
        orbPointLightRef.current.intensity,
        pointLightTgt * dimMult,
        Math.min(1, hoverLerpSpeed * 4)
      )
      orbPointLightRef.current.distance = 3
      orbPointLightRef.current.color.set(memory.orbGlow || '#67e8f9')
    }
    if (isVideoOrb) {
      const shellEmTgt = isHovered ? 0.08 : 0.05
      const videoPlaneEmTgt = isHovered ? 1.8 : 0.7
      if (orbShellMatRef.current) {
        orbShellMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          orbShellMatRef.current.emissiveIntensity,
          shellEmTgt * dimMult,
          Math.min(1, hoverLerpSpeed * 4)
        )
      }
      if (orbVideoPlaneMatRef.current) {
        orbVideoPlaneMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          orbVideoPlaneMatRef.current.emissiveIntensity,
          videoPlaneEmTgt * dimMult,
          Math.min(1, hoverLerpSpeed * 4)
        )
      }
      const glowAuraOpTgt = isHovered ? 0.35 : 0.15
      if (orbGlowAuraMatRef.current) {
        orbGlowAuraMatRef.current.opacity = THREE.MathUtils.lerp(
          orbGlowAuraMatRef.current.opacity,
          glowAuraOpTgt * dimMult,
          Math.min(1, hoverLerpSpeed * 4)
        )
      }
    } else {
      // Non-video: core and aura opacity targets (emissive body is driven by JSX)
      const coreOpTgt = isHovered ? 1 : 0.85
      const auraOpTgt = isHovered ? 0.35 : 0.15
      if (orbInnerHazeMatRef.current) {
        orbInnerHazeMatRef.current.opacity = THREE.MathUtils.lerp(
          orbInnerHazeMatRef.current.opacity,
          coreOpTgt * dimMult,
          Math.min(1, hoverLerpSpeed * 4)
        )
        if (isHovered) {
          orbInnerHazeMatRef.current.color.setHex(0xffffff)
        } else {
          orbInnerHazeMatRef.current.color.set(memory.orbInnerLight || '#ffffff')
        }
      }
      if (orbAuraMatRef.current) {
        orbAuraMatRef.current.opacity = THREE.MathUtils.lerp(
          orbAuraMatRef.current.opacity,
          auraOpTgt * dimMult,
          Math.min(1, hoverLerpSpeed * 4)
        )
      }
      const shellEmTgt = isHovered ? 1.8 : 0.7
      if (orbShellMatRef.current) {
        orbShellMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          orbShellMatRef.current.emissiveIntensity,
          shellEmTgt * dimMult,
          Math.min(1, hoverLerpSpeed * 4)
        )
      }
      // Aura scale fixed at 1.2
    }

    // Idle orb pulse (world breathing): one random orb pulses — video shell only (non-video has no emissive)
    const isIdlePulse = id === idlePulseOrbId && idlePulseOrbStartTime != null && !isHovered
    if (isIdlePulse && idlePulseOrbStartTime != null && isVideoOrb) {
      const el = t - idlePulseOrbStartTime
      if (el < 1.2) {
        const p = el / 1.2
        const mult = p < 0.5 ? 1 + 1.5 * (p * 2) : 2.5 - 1.5 * ((p - 0.5) * 2)
        if (orbShellMatRef.current) {
          orbShellMatRef.current.emissiveIntensity = 0.05 * mult
        }
      }
    }

    // Ripple ring on hover: single ring, opacity 0.6 → 0, scale 1 → 1.8, 800ms, orb color
    if (rippleRingRef.current && rippleRingMatRef.current) {
      if (isHovered) {
        if (rippleProgressRef.current === 0) rippleRingRef.current.visible = true
        rippleProgressRef.current = Math.min(1, rippleProgressRef.current + delta / 0.8)
        const p = rippleProgressRef.current
        const ease = 1 - Math.pow(1 - p, 2)
        rippleRingRef.current.scale.setScalar(1 + ease * 0.8)
        rippleRingMatRef.current.opacity = 0.6 * (1 - ease)
        if (p >= 1) rippleRingRef.current.visible = false
      } else {
        rippleProgressRef.current = 0
        rippleRingRef.current.visible = false
        rippleRingRef.current.scale.setScalar(1)
        rippleRingMatRef.current.opacity = THREE.MathUtils.lerp(rippleRingMatRef.current.opacity, 0, Math.min(1, delta * 5))
      }
    }
    // Hover label opacity: lerp over ~300ms
    const hoverLabelMax = !isInteractive ? 0 : (visualTier === 'secondary' ? 0.6 : 1)
    const hoverLabelTgt = isHovered && !isSelected ? hoverLabelMax : 0
    setHoverLabelOpacity((prev) =>
      THREE.MathUtils.lerp(prev, hoverLabelTgt, Math.min(1, delta * 4))
    )
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (!isInteractive) return
    if (isSelected) {
      // On mobile, a tap fires pointerdown then a synthetic click; avoid closing immediately after open.
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      if (now - lastOpenTimeRef.current < 500) return
      setActivePanel(null)
    } else {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      if (now - lastOpenTimeRef.current < 400) return
      lastOpenTimeRef.current = now
      const wp = new THREE.Vector3()
      groupRef.current.getWorldPosition(wp)
      const projected = wp.clone().project(camera)
      const screenX = (projected.x + 1) / 2 * size.width
      const screenY = -(projected.y - 1) / 2 * size.height
      const panelRadius = Math.min(size.width * 0.22, 200)
      const clampedX = Math.max(panelRadius, Math.min(size.width - panelRadius, screenX))
      const clampedY = Math.max(panelRadius + 60, Math.min(size.height - panelRadius, screenY))
      setActivePanel({
        type: 'memory',
        id,
        worldPos: [wp.x, wp.y, wp.z],
        screenPos: [clampedX, clampedY],
      })
      if (import.meta.env?.DEV) {
        const mobile = useStore.getState().isMobile
        console.log(`[Orb] opening panel ${id} mobile=${mobile}`)
      }
      sound?.play('orbOpen')
      setClickPulse({ position: [wp.x, wp.y, wp.z], color, radius: RADIUS })
      coreFlashRef.current = tRef.current
      auraStartRef.current = tRef.current
      // Shell crack (step 2) is triggered at 150ms in useFrame
      seamStartRef.current = tRef.current
    }
  }
  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (!isInteractive) return
    // On touch devices, open on pointerdown so we don't rely on delayed click; handleClick does the rest.
    if (!isSelected) handleClick(e)
  }
  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (!isInteractive) return
    sound?.play('orbHover')
    setHoveredOrb(id)
    document.body.style.cursor = (activePanel?.type === 'memory' && activePanel.id !== id) ? 'crosshair' : 'pointer'
  }
  const handlePointerOut  = () => {
    if (!isInteractive) return
    setHoveredOrb(null)
    setHoveredOrbScreenPos(null)
    document.body.style.cursor = ''
  }

  return (
    <group position={basePosition} ref={groupRef}>

      {/* Accessibility: focusable button for keyboard/screen reader */}
      <Html center position={[0, 0, 0]} zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <button
          type="button"
          aria-label={`Memory: ${title}`}
          className="sr-only"
          style={{
            position: 'absolute',
            width: '48px',
            height: '48px',
            margin: '-24px 0 0 -24px',
            opacity: 0,
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleClick(e)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick(e)
            }
          }}
        />
      </Html>

      {/* ── TEMPORARY RESET: all original orb meshes/lights commented out — replaced with single meshBasicMaterial sphere below ── */}
      {false && (
        <>
      {/* ── Per-orb point light (crystalline: distance 2, decay 2, breathing 0.2–0.5) ──────────────────────────────────── */}
      <pointLight
        ref={pointRef}
        position={[0, 0, 0]}
        color={etherealColor}
        intensity={0.2}
        distance={POINT_DISTANCE}
        decay={POINT_DECAY}
      />
      {isCore && (
        <pointLight
          ref={corePtRef}
          position={[0, 0, 0]}
          color={etherealColor}
          intensity={0.2}
          distance={POINT_DISTANCE}
          decay={POINT_DECAY}
        />
      )}

      {/* ── Outer halo (skip for root — no hard frame, only soft glow) ───── */}
      {!isRoot && (
      <Sphere args={[RADIUS * 1.22, 32, 32]} renderOrder={0}>
        <meshStandardMaterial
          ref={haloMat}
          color={etherealColor}
          transparent
          opacity={hasMedia ? 0.04 : 0.05}
          roughness={1}
          metalness={0}
          depthWrite={false}
        />
      </Sphere>
      )}

      {/* ── Fresnel rim (skip for root — no border/ring) ─────────────────── */}
      {!isRoot && (
      <Sphere args={[RADIUS * 1.10, 32, 32]} renderOrder={0}>
        <meshStandardMaterial
          ref={rimMat}
          color={etherealColor}
          emissive={etherealColor}
          emissiveIntensity={0.15}
          transparent
          opacity={hasMedia ? 0.03 : 0.04}
          roughness={0}
          metalness={0}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </Sphere>
      )}

      {/* ── Glass / photo body — when video: clear outer shell + inner video sphere (root: flat circle only) ────────────────────────────────────── */}
      {memory.videoSrc && mediaTex ? (
        isRoot && circleAlphaTex ? (
          <>
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
              <mesh renderOrder={1.4} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry args={[RADIUS * 1.95, RADIUS * 1.95]} />
                <meshBasicMaterial
                  map={mediaTex}
                  alphaMap={circleAlphaTex}
                  color="#ffffff"
                  transparent
                  opacity={1}
                  depthWrite={false}
                  toneMapped={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </Billboard>
          </>
        ) : (
        <>
          <Sphere
            args={[RADIUS * 0.7, 48, 48]}
            renderOrder={1.5}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <meshBasicMaterial
              ref={videoInnerMat}
              map={mediaTex}
              toneMapped={false}
              transparent={false}
              opacity={1}
              depthWrite={true}
              side={THREE.FrontSide}
            />
          </Sphere>
        </>
        )
      ) : bodyTexture ? (
        isRoot && circleAlphaTex ? (
          <>
            <Sphere
              args={[RADIUS, 64, 64]}
              renderOrder={1}
              onClick={handleClick}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <meshPhysicalMaterial
                ref={bodyMat}
                color="#ffffff"
                emissive={etherealColor}
                emissiveIntensity={0.03}
                transmission={0.4}
                transparent
                opacity={0.12}
                roughness={0.06}
                metalness={0}
                thickness={0.6}
                ior={1.4}
                envMapIntensity={0.4}
                depthWrite={false}
              />
            </Sphere>
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
              <mesh renderOrder={1.4} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry args={[RADIUS * 1.95, RADIUS * 1.95]} />
                <meshBasicMaterial
                  map={bodyTexture}
                  alphaMap={circleAlphaTex}
                  color="#ffffff"
                  transparent
                  opacity={1}
                  depthWrite={false}
                  toneMapped={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </Billboard>
          </>
        ) : (
        <Sphere
          args={[RADIUS, 64, 64]}
          renderOrder={1}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {bodyTexture === imageTex ? (
            <meshPhysicalMaterial
              ref={bodyMat}
              map={imageTex}
              color="#ffffff"
              emissive={isRoot ? etherealColor : orbColor}
              emissiveIntensity={0.06}
              transmission={0.4}
              transparent
              opacity={1}
              roughness={0.08}
              metalness={0}
              thickness={0.8}
              ior={1.35}
              envMapIntensity={isRoot ? 0.4 : 0.5}
              clearcoat={isRoot ? 0.5 : 0.3}
              clearcoatRoughness={0.1}
              depthWrite={false}
            />
          ) : isRoot ? (
            <meshPhysicalMaterial
              ref={bodyMat}
              map={mediaTex}
              color="#ffffff"
              emissive={etherealColor}
              emissiveIntensity={0.05}
              transmission={0.4}
              transparent
              opacity={1}
              roughness={0.06}
              metalness={0}
              thickness={0.6}
              ior={1.4}
              envMapIntensity={0.4}
              depthWrite={false}
            />
          ) : (
            <meshStandardMaterial
              ref={bodyMat}
              map={mediaTex}
              color="#ffffff"
              emissive={isRoot ? etherealColor : orbColor}
              emissiveIntensity={0.05}
              roughness={0.35}
              metalness={0.08}
              envMapIntensity={0.4}
              transparent
              opacity={1}
              depthWrite={true}
              toneMapped={false}
            />
          )}
        </Sphere>
        )
      ) : (
        <Sphere
          args={[RADIUS, 64, 64]}
          renderOrder={1}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshPhysicalMaterial
            ref={bodyMat}
            color={etherealColor}
            emissive={etherealColor}
            emissiveIntensity={EM_BASE}
            transmission={0.4}
            transparent
            opacity={0.2}
            roughness={0.1}
            metalness={0}
            thickness={0.5}
            ior={1.5}
            envMapIntensity={0.3}
            depthWrite={false}
          />
        </Sphere>
      )}

      {/* ── Local dust cloud: tiny sparkles (white-blue, additive) ──────────────────────────────────────── */}
      <points ref={dustRef} renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMat}
          size={isCore ? 0.012 : 0.01}
          color="#C8DCFF"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.NormalBlending}
          sizeAttenuation
        />
      </points>

      {/* ── Center orb: slow-orbiting sparkles (tiny, same style as dust) ───────────────────────────── */}
      {isRoot && orbitParticles.length > 0 && (
        <group ref={orbitParticlesRef} renderOrder={2.2}>
          {orbitParticles.map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshBasicMaterial
                color="#C8DCFF"
                transparent
                opacity={0.28}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </mesh>
          ))}
        </group>
      )}
        </>
      )}

      {/* ── VIDEO ORB: nuclear — video sphere + ultra-thin shell only. NON-VIDEO: 3-layer crystal ── */}
      <pointLight
        ref={orbPointLightRef}
        position={[0, 0, 0]}
        color={orbColor}
        intensity={0.8}
        distance={3}
        decay={2}
      />

      {memory.videoSrc && mediaTex ? (
        /* Video orb: flat circular portrait (center-cropped) + shell for all orbs. No sphere warp. */
        <>
          {circleAlphaTex ? (
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
              <mesh renderOrder={3} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry args={[RADIUS * 1.95, RADIUS * 1.95]} />
                <meshStandardMaterial
                  ref={orbVideoPlaneMatRef}
                  map={mediaTex}
                  emissiveMap={mediaTex}
                  emissive="#ffffff"
                  emissiveIntensity={0.7}
                  alphaMap={circleAlphaTex}
                  color="#ffffff"
                  transparent
                  opacity={1}
                  depthWrite={false}
                  toneMapped={false}
                  side={THREE.DoubleSide}
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>
            </Billboard>
          ) : null}
          <mesh
            ref={orbMeshRef}
            renderOrder={2}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <sphereGeometry args={[RADIUS, 64, 64]} />
            <meshStandardMaterial
              ref={orbShellMatRef}
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.05}
              roughness={0.3}
              metalness={0.1}
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>
          {/* Glow aura: subtle outer sphere, radius 1.2, additive */}
          <mesh ref={orbGlowAuraRef} renderOrder={0} scale={1.2}>
            <sphereGeometry args={[RADIUS, 16, 16]} />
            <meshBasicMaterial
              ref={orbGlowAuraMatRef}
              color={memory.orbGlow || '#ffffff'}
              transparent
              opacity={0.15}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      ) : (
        /* Non-video orb: emissive body + core + aura (nuclear fix — colors from memory.orbGlow / orbInnerLight) */
        <>
          {/* AURA: outer glow — radius 1.2, opacity 0.15 base / 0.35 hover */}
          <mesh ref={orbAuraRef} renderOrder={0} scale={1.2}>
            <sphereGeometry args={[RADIUS, 16, 16]} />
            <meshBasicMaterial
              ref={orbAuraMatRef}
              color={memory.orbGlow || '#67e8f9'}
              transparent
              opacity={isHovered ? 0.35 : 0.15}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* BODY: emissive shell — base 0.7, hover 1.8 */}
          <mesh
            ref={orbMeshRef}
            renderOrder={1}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <sphereGeometry args={[RADIUS, 64, 64]} />
            <meshStandardMaterial
              ref={orbShellMatRef}
              color={memory.orbGlow || '#67e8f9'}
              emissive={memory.orbGlow || '#67e8f9'}
              emissiveIntensity={isHovered ? 1.8 : 0.7}
              transparent
              opacity={0.5}
              roughness={0.3}
              metalness={0.1}
              depthWrite={false}
            />
          </mesh>
          {/* CORE: bright center */}
          <mesh renderOrder={2}>
            <sphereGeometry args={[RADIUS * 0.3, 16, 16]} />
            <meshBasicMaterial
              ref={orbInnerHazeMatRef}
              color={memory.orbInnerLight || '#ffffff'}
              transparent
              opacity={isHovered ? 1.0 : 0.85}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}

      {/* ── Hover ripple ring: single ring, scale 1→1.8, opacity 0.6→0, 800ms ── */}
      <mesh ref={rippleRingRef} visible={false} renderOrder={4}>
        <ringGeometry args={[RADIUS, RADIUS * 1.02, 32]} />
        <meshBasicMaterial
          ref={rippleRingMatRef}
          color={orbColor}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Onboarding pulse removed (clarity-first landing) */}

      {/* ── Hover label: orb title above (minimal, never clipped) ── */}
      <Html
        position={[0, RADIUS + 0.12, 0]}
        center
        distanceFactor={8}
        zIndexRange={[20, 0]}
        style={{
          pointerEvents: 'none',
          opacity: hoverLabelOpacity,
          transform: hoverLabelOpacity > 0 ? 'translateY(0)' : 'translateY(4px)',
          transition: hoverLabelOpacity >= 0.5
            ? 'opacity 200ms ease-out, transform 200ms ease-out'
            : 'opacity 150ms ease-in, transform 150ms ease-in',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(0,200,255,0.8)',
          }}
        >
          {title}
        </div>
      </Html>

      {/* Glow sprites removed — were causing massive white halos; can add subtle glow back later */}

    </group>
  )
}

export default function MemoryOrb({ memory, index, entranceOrder, isFirstOrb, memories }) {
  return (
    <OrbInner
      memory={memory}
      index={index}
      entranceOrder={entranceOrder ?? index}
      isFirstOrb={!!isFirstOrb}
      memories={memories ?? []}
    />
  )
}
