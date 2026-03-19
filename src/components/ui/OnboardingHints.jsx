/**
 * OnboardingHints — Forest-whisper onboarding layer.
 * Three floating hints appear on first visit, stagger in, then dissolve.
 * Any click or key press dismisses them immediately.
 * Uses localStorage so they only appear once per browser.
 */
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'cm_onboarded_v1'
const AUTO_DISMISS_MS = 7000

// All hints stacked on the right side, vertically centred as a group
const HINTS = [
  {
    id: 'orbs',
    icon: '✦',
    text: 'Click an orb',
    sub: 'explore my story',
    delay: 600,
  },
  {
    id: 'chest',
    icon: '◈',
    text: 'Open the chest',
    sub: 'see my projects',
    delay: 1100,
  },
  {
    id: 'chat',
    icon: '🐾',
    text: 'Ask Tyche',
    sub: 'chat with my cat',
    delay: 1600,
  },
]

export default function OnboardingHints() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const dismiss = useCallback(() => {
    if (!visible) return
    setFading(true)
    setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 700)
  }, [visible])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return
    // Small delay so the forest loads first
    const t = setTimeout(() => {
      setVisible(true)
      setMounted(true)
    }, 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    const auto = setTimeout(dismiss, AUTO_DISMISS_MS)
    const onKey = () => dismiss()
    const onClick = () => dismiss()
    window.addEventListener('keydown', onKey, { once: true })
    window.addEventListener('click', onClick, { once: true })
    return () => {
      clearTimeout(auto)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [visible, dismiss])

  if (!mounted) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        pointerEvents: 'none',
      }}
    >
      {/* Vignette pulse — very subtle, just draws eyes inward */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.28) 100%)',
          opacity: visible && !fading ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Right-side hint column — centred vertically */}
      <div
        style={{
          position: 'absolute',
          right: '3vw',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 18,
          pointerEvents: 'none',
        }}
      >
        {HINTS.map((h) => (
          <HintCard
            key={h.id}
            hint={h}
            visible={visible}
            fading={fading}
          />
        ))}
      </div>

      {/* Skip whisper — bottom center */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(200,220,255,0.35)',
          opacity: visible && !fading ? 1 : 0,
          transition: `opacity ${fading ? '0.5s' : '1s'} ease ${fading ? '0s' : '2.4s'}`,
          pointerEvents: 'none',
        }}
      >
        click anywhere to explore
      </div>
    </div>
  )
}

function HintCard({ hint, visible, fading }) {
  const [localIn, setLocalIn] = useState(false)

  useEffect(() => {
    if (!visible) { setLocalIn(false); return }
    const t = setTimeout(() => setLocalIn(true), hint.delay)
    return () => clearTimeout(t)
  }, [visible, hint.delay])

  const show = localIn && !fading

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        opacity: show ? 1 : 0,
        transform: show ? 'translateX(0)' : 'translateX(18px)',
        transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.3,0.64,1)',
        pointerEvents: 'none',
        filter: show ? 'drop-shadow(0 0 12px rgba(100,200,255,0.3))' : 'none',
      }}
    >
      {/* Text pill */}
      <div
        style={{
          background: 'rgba(8,20,45,0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(100,200,255,0.18)',
          borderRadius: 10,
          padding: '7px 14px 8px',
          textAlign: 'right',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        }}
      >
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'rgba(210,235,255,0.95)',
          margin: 0, lineHeight: 1.3,
        }}>
          {hint.text}
        </p>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9, letterSpacing: '0.14em',
          color: 'rgba(140,190,240,0.55)',
          margin: '2px 0 0', textTransform: 'uppercase',
        }}>
          {hint.sub}
        </p>
      </div>

      {/* Icon ring */}
      <div
        style={{
          flexShrink: 0,
          width: 36, height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(100,200,255,0.28)',
          background: 'rgba(8,20,45,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
          color: 'rgba(150,220,255,0.9)',
          boxShadow: '0 0 16px rgba(100,200,255,0.18), inset 0 0 6px rgba(100,200,255,0.08)',
        }}
      >
        {hint.icon}
      </div>
    </div>
  )
}
