/**
 * TycheMascot — glowing cyan cat spirit companion (bottom-right).
 * Uses data-part attributes for GSAP targets (avoids CSS module hash mismatch).
 * Idle: bob, glow pulse, micro-gestures (ear twitch, blink, tail swish), cursor tracking.
 * Reactive: perk up + glow tint when orb selected; bounce when new chat message.
 * Click: opens Ask the Tree chat (setActivePanel({ type: 'chat' })).
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import useStore from '../../hooks/useStore'
import { useChatGPT } from '../../hooks/useChatGPT'
import { MEMORIES } from '../../data/memories'
import styles from './TycheMascot.module.css'

const CYAN_GLOW = '#22d3ee'
const AURA_OPACITY_MIN = 0.4
const AURA_OPACITY_MAX = 0.8
const BOB_AMP = 3
const BOB_DUR = 1.5
const CURSOR_MAX_DEG = 15
const MICRO_GESTURE_INTERVAL_MIN = 8000
const MICRO_GESTURE_INTERVAL_MAX = 12000

function CatSvg({ glowColor = CYAN_GLOW }) {
  return (
    <svg
      className={styles.catSvg}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Tail — group for swish transform */}
      <g data-part="tail" className={styles.tail} transform="translate(58, 42)">
        <path
          d="M0 0 Q 14  -8 18 4 Q 20 12 12 16 Q 6 18 0 14 Z"
          fill={glowColor}
          opacity="0.9"
          style={{ transformOrigin: '0 8px' }}
        />
      </g>
      {/* Body/back */}
      <ellipse cx="42" cy="48" rx="22" ry="16" fill={glowColor} opacity="0.85" />
      {/* Head */}
      <circle cx="28" cy="32" r="18" fill={glowColor} opacity="0.9" />
      {/* Left ear */}
      <path
        data-part="ear-left"
        d="M14 20 L20 4 L26 20 Z"
        fill={glowColor}
        opacity="0.95"
        style={{ transformOrigin: '20px 20px' }}
      />
      {/* Right ear */}
      <path
        data-part="ear-right"
        d="M30 20 L36 4 L42 20 Z"
        fill={glowColor}
        opacity="0.95"
        style={{ transformOrigin: '36px 20px' }}
      />
      {/* Left eye */}
      <ellipse
        data-part="eye-left"
        cx="22"
        cy="30"
        rx="3"
        ry="4"
        fill="rgba(0,20,30,0.85)"
        style={{ transformOrigin: '22px 30px' }}
      />
      {/* Right eye */}
      <ellipse
        data-part="eye-right"
        cx="34"
        cy="30"
        rx="3"
        ry="4"
        fill="rgba(0,20,30,0.85)"
        style={{ transformOrigin: '34px 30px' }}
      />
    </svg>
  )
}

export default function TycheMascot({ label = '' }) {
  const rootRef = useRef(null)
  const auraRef = useRef(null)
  const catWrapRef = useRef(null)
  const prevMessagesLenRef = useRef(0)
  const [hovered, setHovered] = useState(false)

  const loadingExited = useStore((s) => s.loadingExited)
  const selectedOrb = useStore((s) => s.selectedOrb)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const { messages } = useChatGPT()
  const activePanel = useStore((s) => s.activePanel)

  // ── Click: toggle chat (open if closed, close if open) ─────────────
  const handleClick = () => {
    if (activePanel?.type === 'chat') {
      setActivePanel(null)
    } else {
      setActivePanel({ type: 'chat' })
    }
  }

  // ── Idle: bob, glow pulse, cursor tracking, micro-gestures ────────
  useEffect(() => {
    if (!loadingExited || !rootRef.current || !catWrapRef.current || !auraRef.current || reducedMotion) return

    const root = rootRef.current
    const catWrap = catWrapRef.current
    const aura = auraRef.current

    // Bob: sinusoidal float
    const bobTween = gsap.to(catWrap, {
      y: BOB_AMP,
      duration: BOB_DUR / 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Glow pulse on aura
    const auraTween = gsap.to(aura, {
      opacity: AURA_OPACITY_MAX,
      duration: 1.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Cursor tracking: gentle rotation toward mouse (max ±15deg)
    let raf = null
    const cursorTarget = { x: 0, y: 0 }
    const cursorCurrent = { x: 0, y: 0 }
    const onMove = (e) => {
      const rect = root.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      cursorTarget.x = Math.max(-1, Math.min(1, dx / 80)) * CURSOR_MAX_DEG
      cursorTarget.y = Math.max(-1, Math.min(1, -dy / 80)) * CURSOR_MAX_DEG
      if (!raf) {
        raf = requestAnimationFrame(function tick() {
          raf = null
          cursorCurrent.x += (cursorTarget.x - cursorCurrent.x) * 0.08
          cursorCurrent.y += (cursorTarget.y - cursorCurrent.y) * 0.08
          gsap.set(catWrap, { rotationZ: cursorCurrent.x, rotationY: cursorCurrent.y })
          if (Math.abs(cursorTarget.x - cursorCurrent.x) > 0.01 || Math.abs(cursorTarget.y - cursorCurrent.y) > 0.01) {
            raf = requestAnimationFrame(tick)
          }
        })
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Micro-gestures every 8–12s: query by data-part (no class names)
    const scheduleMicroGesture = () => {
      const delay = MICRO_GESTURE_INTERVAL_MIN + Math.random() * (MICRO_GESTURE_INTERVAL_MAX - MICRO_GESTURE_INTERVAL_MIN)
      const t = setTimeout(() => {
        const earL = root.querySelector('[data-part="ear-left"]')
        const earR = root.querySelector('[data-part="ear-right"]')
        const eyeL = root.querySelector('[data-part="eye-left"]')
        const eyeR = root.querySelector('[data-part="eye-right"]')
        const tail = root.querySelector('[data-part="tail"]')

        const which = Math.floor(Math.random() * 3)
        if (which === 0 && earL && earR) {
          gsap.fromTo(earL, { rotation: 0 }, { rotation: -12, duration: 0.06, yoyo: true, repeat: 1 })
          gsap.fromTo(earR, { rotation: 0 }, { rotation: 12, duration: 0.06, yoyo: true, repeat: 1 })
        } else if (which === 1 && eyeL && eyeR) {
          gsap.to([eyeL, eyeR], { scaleY: 0.15, duration: 0.04, yoyo: true, repeat: 1 })
        } else if (which === 2 && tail) {
          gsap.fromTo(tail, { rotation: 0 }, { rotation: 25, duration: 0.12, ease: 'sine.inOut', yoyo: true, repeat: 1 })
        }
        scheduleMicroGesture()
      }, delay)
      return () => clearTimeout(t)
    }
    const cancelMicro = scheduleMicroGesture()

    return () => {
      bobTween.kill()
      auraTween.kill()
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
      cancelMicro()
    }
  }, [loadingExited, reducedMotion])

  // ── Hover: scale 1.1, glow up ──────────────────────────────────────
  useEffect(() => {
    if (!catWrapRef.current || !auraRef.current) return
    const catWrap = catWrapRef.current
    const aura = auraRef.current
    if (hovered) {
      gsap.to(catWrap, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
      gsap.to(aura, { opacity: AURA_OPACITY_MAX + 0.1, duration: 0.2 })
    } else {
      gsap.to(catWrap, { scale: 1, duration: 0.25, ease: 'power2.out' })
      gsap.to(aura, { opacity: (AURA_OPACITY_MIN + AURA_OPACITY_MAX) / 2, duration: 0.25 })
    }
  }, [hovered])

  // ── Reactive: orb selected → perk up + glow tint ───────────────────
  const prevOrbRef = useRef(null)
  useEffect(() => {
    if (!loadingExited || !catWrapRef.current || !auraRef.current || reducedMotion) return
    if (selectedOrb === prevOrbRef.current) return
    prevOrbRef.current = selectedOrb
    if (!selectedOrb) return

    const catWrap = catWrapRef.current
    const aura = auraRef.current
    const memory = selectedOrb ? MEMORIES.find((m) => m.id === selectedOrb) : null
    const orbColor = memory?.color ?? memory?.glowColor ?? CYAN_GLOW

    // Perk up: scale 1 → 1.15 → 1 over 0.4s
    gsap.fromTo(catWrap, { scale: 1 }, { scale: 1.15, duration: 0.2, ease: 'power2.out' })
    gsap.to(catWrap, { scale: 1, duration: 0.2, delay: 0.2, ease: 'power2.in' })

    // Glow tint to orb color then back to cyan over 2s (aura only)
    if (orbColor && orbColor !== CYAN_GLOW) {
      aura.style.filter = `drop-shadow(0 0 24px ${orbColor})`
      gsap.to(aura, {
        opacity: AURA_OPACITY_MAX,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.delayedCall(2, () => {
        if (aura) aura.style.filter = ''
        gsap.to(aura, { opacity: (AURA_OPACITY_MIN + AURA_OPACITY_MAX) / 2, duration: 0.5 })
      })
    }
  }, [selectedOrb, loadingExited, reducedMotion])

  // ── Reactive: new chat message → happy bounce ──────────────────────
  useEffect(() => {
    if (!loadingExited || !catWrapRef.current || reducedMotion) return
    const len = messages.length
    if (len > prevMessagesLenRef.current) {
      const last = messages[len - 1]
      if (last?.role === 'assistant') {
        gsap.fromTo(catWrapRef.current, { y: -8 }, { y: 0, duration: 0.3, ease: 'bounce.out' })
      }
    }
    prevMessagesLenRef.current = len
  }, [messages.length, loadingExited, reducedMotion])

  if (!loadingExited) return null

  /* When chat is open on mobile, hide mascot so it doesn't overlap the chat panel */
  const chatOpen = activePanel?.type === 'chat'
  if (chatOpen) return null

  return (
    <div
      ref={rootRef}
      className={styles.wrap}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      aria-label="Open chat with Tyche"
      style={{ pointerEvents: 'auto' }}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div ref={auraRef} className={styles.aura} aria-hidden />
      <div ref={catWrapRef} className={styles.catWrap}>
        <CatSvg glowColor={CYAN_GLOW} />
      </div>
    </div>
  )
}
