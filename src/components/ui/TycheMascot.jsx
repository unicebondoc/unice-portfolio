import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import useStore from '../../hooks/useStore'
import { MEMORIES } from '../../data/memories'
import { useSound } from '../../context/SoundManager'
import styles from './TycheMascot.module.css'

function CatSvg() {
  return (
    <svg
      className={styles.catSvg}
      viewBox="0 0 62 78"
      width="52"
      height="66"
      fill="none"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="catGrad" cx="24" cy="35" r="22" fx="24" fy="35">
          <stop offset="0%" stopColor="rgba(0, 100, 140, 0.92)" />
          <stop offset="55%" stopColor="rgba(0, 200, 230, 0.94)" />
          <stop offset="100%" stopColor="rgba(0, 255, 255, 0.96)" />
        </radialGradient>
      </defs>

      <g className={styles.headGroup}>
        {/* Left ear */}
        <path className={styles.earLeft} d="M14 20 L10 4 L20 14 Z" fill="url(#catGrad)" />
        {/* Right ear */}
        <path className={styles.earRight} d="M34 20 L38 4 L28 14 Z" fill="url(#catGrad)" />
        {/* Head */}
        <circle cx="24" cy="23" r="13" fill="url(#catGrad)" />
        {/* Eyes */}
        <ellipse className={styles.eyeLeft} cx="19.5" cy="22" rx="1.95" ry="1.8" fill="#05101e" />
        <ellipse className={styles.eyeRight} cx="28.5" cy="22" rx="1.95" ry="1.8" fill="#05101e" />
        {/* Nose */}
        <polygon points="24,26 22,29 26,29" fill="#05101e" />
      </g>

      {/* Body */}
      <ellipse cx="24" cy="41" rx="13" ry="12" fill="url(#catGrad)" />

      {/* Tail (pivot at base) */}
      <g
        className={styles.tailGroup}
        transform="translate(34, 46)"
        style={{ transformOrigin: '0 0', transformBox: 'view-box' }}
      >
        <path
          d="M -1.7 0 C 3 1.5, 9 9, 11.5 17 C 14 21, 20 19, 24 12 C 22 16, 17 20, 14.5 17 C 13 10, 6 2, 1.7 0 Z"
          fill="url(#catGrad)"
        />
      </g>
    </svg>
  )
}

function pickMemById(id) {
  return MEMORIES.find((m) => m.id === id) ?? null
}

export default function TycheMascot({ entranceOpacity = 1, showUnread = false }) {
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const sound = useSound()
  const hoveredOrb = useStore((s) => s.hoveredOrb)
  const selectedOrb = useStore((s) => s.selectedOrb)

  const isChatOpen = activePanel?.type === 'chat'
  const [isHover, setIsHover] = useState(false)
  const tycheWhisperShown = useStore((s) => s.tycheWhisperShown)
  const setTycheWhisperShown = useStore((s) => s.setTycheWhisperShown)
  const userHasOpenedOrb = useStore((s) => s.userHasOpenedOrb)
  const [showWhisper, setShowWhisper] = useState(false)
  const parallaxMouse = useStore((s) => s.parallaxMouse)
  const isMobile = useStore((s) => s.isMobile)

  const wrapRef = useRef(null)
  const innerRef = useRef(null)
  const auraRef = useRef(null)

  const driftXTo = useRef(null)
  const rotateTo = useRef(null)
  const glowTo = useRef(null)

  const rafRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastMoveTsRef = useRef(0)
  const baseTurnRef = useRef(0)

  // Base "interest" direction: selected orb (strong), hovered orb (subtle), chat open (toward panel).
  const interestTurn = useMemo(() => {
    if (isChatOpen) return -12
    if (selectedOrb) {
      const mem = pickMemById(selectedOrb)
      if (mem?.position) return mem.position[0] < 0 ? -15 : 15
    }
    if (hoveredOrb) {
      const mem = pickMemById(hoveredOrb)
      if (mem?.position) return mem.position[0] < 0 ? -5 : 5
    }
    return 0
  }, [selectedOrb, hoveredOrb, isChatOpen])

  // Drift slightly toward the side of the selected orb.
  const sideDrift = useMemo(() => {
    if (!selectedOrb) return 0
    const mem = pickMemById(selectedOrb)
    if (!mem?.position) return 0
    return mem.position[0] < 0 ? -10 : 10
  }, [selectedOrb])

  const toggleChat = useCallback(() => {
    if (!isChatOpen) sound?.play('tycheClick')
    setActivePanel(isChatOpen ? null : { type: 'chat' })
  }, [setActivePanel, isChatOpen, sound])

  // Set up GSAP quick setters.
  useLayoutEffect(() => {
    if (!wrapRef.current || !innerRef.current || !auraRef.current) return
    driftXTo.current = gsap.quickTo(wrapRef.current, 'x', { duration: 0.9, ease: 'power3.out' })
    rotateTo.current = gsap.quickTo(innerRef.current, 'rotation', { duration: 0.6, ease: 'power3.out' })
    glowTo.current = gsap.quickTo(auraRef.current, 'opacity', { duration: 0.6, ease: 'sine.out' })
  }, [])

  // Continuous life: bob + glow breathe.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const aura = auraRef.current
    if (!wrap || !aura) return
    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        y: -3,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
      gsap.to(aura, {
        opacity: 0.8,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  // Reactive glow when chat is open: sync-ish pulse (subtle).
  useEffect(() => {
    const aura = auraRef.current
    if (!aura) return
    if (isChatOpen) {
      const tween = gsap.to(aura, {
        opacity: 0.9,
        duration: 0.9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
      return () => tween.kill()
    }
  }, [isChatOpen])

  // Hover perk-up.
  useEffect(() => {
    const wrap = wrapRef.current
    const aura = auraRef.current
    if (!wrap || !aura) return
    gsap.to(wrap, { scale: isHover ? 1.1 : 1, duration: 0.25, ease: 'power2.out' })
    gsap.to(aura, { opacity: isHover ? 1 : 0.7, duration: 0.25, ease: 'power2.out' })
  }, [isHover])

  // Tyche's whisper: after 15s idle, once per session, if user hasn't opened an orb
  useEffect(() => {
    if (tycheWhisperShown || userHasOpenedOrb) return
    const t1 = setTimeout(() => {
      setShowWhisper(true)
    }, 15000)
    const t2 = setTimeout(() => {
      setShowWhisper(false)
      setTycheWhisperShown(true)
    }, 19000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [tycheWhisperShown, userHasOpenedOrb, setTycheWhisperShown])

  // Cursor look: rAF-throttled, gentle, capped ±15deg.
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (!wrapRef.current) return
        const rect = wrapRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = mouseRef.current.x - cx
        const dy = mouseRef.current.y - cy
        const angleRad = Math.atan2(dy, dx)
        // Map angle to gentle rotation: right = 0deg, up = -90deg
        let deg = (angleRad * 180) / Math.PI
        // Convert to "look" twist: small component based on horizontal offset
        deg = (dx / Math.max(1, rect.width)) * 30
        const clamped = Math.max(-15, Math.min(15, deg))
        // Blend cursor look with interest turn (orbs/chat).
        const blended = clamped * 0.6 + interestTurn * 0.4
        rotateTo.current?.(blended)
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [interestTurn])

  // Random micro-gestures every 8–12s: ear twitch, blink, tail swish.
  useEffect(() => {
    let cancelled = false
    let t = null

    const runGesture = () => {
      if (!wrapRef.current) return
      const root = wrapRef.current
      const earL = root.querySelector(`.${styles.earLeft}`)
      const earR = root.querySelector(`.${styles.earRight}`)
      const eyeL = root.querySelector(`.${styles.eyeLeft}`)
      const eyeR = root.querySelector(`.${styles.eyeRight}`)
      const tail = root.querySelector(`.${styles.tailGroup}`)
      const pick = Math.random()
      if (pick < 0.34 && earL && earR) {
        gsap.timeline()
          .to([earL, earR], { rotation: 10, transformOrigin: '50% 100%', duration: 0.08, ease: 'power2.out' })
          .to([earL, earR], { rotation: -6, duration: 0.1, ease: 'power2.out' })
          .to([earL, earR], { rotation: 0, duration: 0.14, ease: 'power2.out' })
      } else if (pick < 0.67 && eyeL && eyeR) {
        gsap.timeline()
          .to([eyeL, eyeR], { scaleY: 0.08, transformOrigin: 'center', duration: 0.06, ease: 'power2.out' })
          .to([eyeL, eyeR], { scaleY: 1, duration: 0.12, ease: 'power2.out' })
      } else if (tail) {
        gsap.timeline()
          .to(tail, { rotation: -22, transformOrigin: '0 0', duration: 0.18, ease: 'sine.out' })
          .to(tail, { rotation: 14, duration: 0.22, ease: 'sine.inOut' })
          .to(tail, { rotation: -15, duration: 0.18, ease: 'sine.inOut' })
      }
    }

    const schedule = () => {
      if (cancelled) return
      const delay = 8000 + Math.random() * 4000
      t = setTimeout(() => {
        runGesture()
        schedule()
      }, delay)
    }

    schedule()
    return () => {
      cancelled = true
      if (t) clearTimeout(t)
    }
  }, [])

  return (
    <div
      style={{
        transform: isMobile ? undefined : `translate(${parallaxMouse.x * 14}px, ${parallaxMouse.y * 14}px)`,
      }}
    >
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${isChatOpen ? styles.open : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Ask Tyche"
      title="Ask Tyche"
      onClick={toggleChat}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (e.key === ' ') e.preventDefault(); toggleChat() } }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ opacity: entranceOpacity }}
    >
      <div ref={auraRef} className={styles.aura} aria-hidden="true" />
      <div ref={innerRef} className={styles.inner}>
        <CatSvg />
      </div>
      {showUnread && <span className={styles.unreadDot} aria-hidden="true" />}
      {showWhisper && (
        <span
          className={styles.whisperBubble}
          role="status"
          aria-live="polite"
        >
          ✦ try touching an orb ✦
        </span>
      )}
    </div>
    </div>
  )
}

