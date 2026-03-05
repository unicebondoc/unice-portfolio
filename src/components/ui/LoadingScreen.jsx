import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

function makeParticles(count) {
  return Array.from({ length: count }, (_, i) => ({ id: i }))
}

export default function LoadingScreen({
  show,
  progress = 0,
  minDurationMs = 2500,
  whisperAfterMs = 6000,
  onExited,
}) {
  const rootRef = useRef(null)
  const particlesWrapRef = useRef(null)
  const progressPathRef = useRef(null)
  const labelRef = useRef(null)
  const whisperRef = useRef(null)
  const startRef = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now())
  const [internalShow, setInternalShow] = useState(show)
  const [whisperVisible, setWhisperVisible] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)

  const particles = useMemo(() => makeParticles(42), [])
  const particleRefs = useRef([])
  particleRefs.current = []

  const normalized = clamp01(progress)

  // Mount/unmount guard so exit animation always plays.
  useEffect(() => {
    if (show) setInternalShow(true)
  }, [show])

  // Minimum display time: start timer on mount (and whenever we show again).
  useEffect(() => {
    if (!internalShow) return
    setMinElapsed(false)
    startRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const t = setTimeout(() => setMinElapsed(true), minDurationMs)
    return () => clearTimeout(t)
  }, [internalShow, minDurationMs])

  useEffect(() => {
    if (!show && internalShow) {
      if (!minElapsed) return
      const t = setTimeout(() => setInternalShow(false), 0)
      return () => clearTimeout(t)
    }
  }, [show, internalShow, minElapsed])

  // Whisper fallback if load is slow.
  useEffect(() => {
    if (!internalShow) return
    const t = setTimeout(() => setWhisperVisible(true), whisperAfterMs)
    return () => clearTimeout(t)
  }, [internalShow, whisperAfterMs])

  useLayoutEffect(() => {
    if (!internalShow) return
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      // Whisper text: slow 2s fade-in, low opacity, sacred feel
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, letterSpacing: '0.5em' },
          { opacity: 0.55, letterSpacing: '0.42em', duration: 2, ease: 'power2.out', delay: 0.2 }
        )
      }

      // Particles: start centered, then gently drift outward like waking fireflies
      const w = window.innerWidth
      const h = window.innerHeight
      particleRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { x: w / 2, y: h / 2, scale: i === 0 ? 1.6 : 1, opacity: i === 0 ? 1 : 0 })
        const angle = (i / particleRefs.current.length) * Math.PI * 2 + Math.random() * 0.6
        const radius = 24 + Math.random() * 140
        const tx = w / 2 + Math.cos(angle) * radius
        const ty = h / 2 + Math.sin(angle) * radius
        gsap.to(el, {
          x: tx,
          y: ty,
          duration: 2.8 + Math.random() * 1.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 0.1 + i * 0.01,
        })
      })
    }, root)
    return () => ctx.revert()
  }, [internalShow])

  // Organic progress tendril (SVG stroke draw).
  useLayoutEffect(() => {
    if (!internalShow) return
    const p = progressPathRef.current
    if (!p) return
    const len = p.getTotalLength()
    p.style.strokeDasharray = String(len)
    p.style.strokeDashoffset = String(len)
  }, [internalShow])

  useEffect(() => {
    if (!internalShow) return
    const p = progressPathRef.current
    if (!p) return
    const len = p.getTotalLength()
    gsap.to(p, {
      strokeDashoffset: (1 - normalized) * len,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    })

    // Reveal more particles as progress advances (soft, non-linear).
    const revealCount = Math.floor(1 + normalized * (particles.length - 1))
    particleRefs.current.forEach((el, i) => {
      if (!el) return
      const shouldShow = i < revealCount
      gsap.to(el, {
        opacity: shouldShow ? (i === 0 ? 1 : 0.75) : 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      })
    })
  }, [normalized, internalShow, particles.length])

  // Exit: particles rush outward to edges.
  useEffect(() => {
    if (!internalShow) return
    if (show) return
    const w = window.innerWidth
    const h = window.innerHeight
    particleRefs.current.forEach((el, i) => {
      if (!el) return
      const side = i % 4
      const tx = side === 0 ? -60 : side === 1 ? w + 60 : w / 2 + (Math.random() - 0.5) * w
      const ty = side === 2 ? -60 : side === 3 ? h + 60 : h / 2 + (Math.random() - 0.5) * h
      gsap.to(el, {
        x: tx,
        y: ty,
        scale: 0.6,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.in',
        overwrite: true,
        delay: i * 0.002,
      })
    })
    if (labelRef.current) {
      gsap.to(labelRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
    }
    if (whisperRef.current) {
      gsap.to(whisperRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
    }
  }, [show, internalShow])

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (onExited) onExited()
      }}
    >
      {internalShow && (
        <motion.div
          ref={rootRef}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: '#000',
            overflow: 'hidden',
            pointerEvents: 'all',
          }}
        >
          {/* Particles */}
          <div ref={particlesWrapRef} style={{ position: 'absolute', inset: 0 }}>
            {particles.map((p, idx) => (
              <div
                key={p.id}
                ref={(el) => { if (el) particleRefs.current[idx] = el }}
                style={{
                  position: 'absolute',
                  width: idx === 0 ? 8 : 4,
                  height: idx === 0 ? 8 : 4,
                  borderRadius: '50%',
                  background: idx === 0
                    ? 'radial-gradient(circle at 40% 40%, #00f0ff 0%, rgba(0, 10, 20, 0) 70%)'
                    : 'rgba(200, 240, 255, 0.22)',
                  boxShadow: idx === 0
                    ? '0 0 26px rgba(0,240,255,0.55), 0 0 50px rgba(168,85,247,0.18)'
                    : '0 0 10px rgba(0,240,255,0.12)',
                  willChange: 'transform, opacity',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>

          {/* Center label */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              ref={labelRef}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 9,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                opacity: 0,
                whiteSpace: 'nowrap',
              }}
            >
              the grove awakens...
            </div>
            <div
              ref={whisperRef}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: 8,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(192,132,252,0.5)',
                opacity: whisperVisible ? 0.6 : 0,
                transition: 'opacity 2s ease-out',
                marginTop: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {whisperVisible ? 'patience... the spirits are gathering...' : ''}
            </div>
          </div>

          {/* Organic progress tendril */}
          <svg
            width="100%"
            height="60"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
          >
            <path
              ref={progressPathRef}
              d="M0,40 C120,30 220,52 340,40 C470,28 560,52 690,38 C820,24 900,44 1000,34"
              fill="none"
              stroke="rgba(0,240,255,0.55)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.25)) drop-shadow(0 0 22px rgba(168,85,247,0.12))',
              }}
            />
            <path
              d="M0,40 C120,30 220,52 340,40 C470,28 560,52 690,38 C820,24 900,44 1000,34"
              fill="none"
              stroke="rgba(192,132,252,0.18)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
              style={{
                filter: 'blur(2px)',
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

