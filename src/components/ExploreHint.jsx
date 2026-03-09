/**
 * ExploreHint — persistent subtle hint: "CLICK THE ORBS" / "TAP THE ORBS".
 * Hides after first orb interaction; once per session (sessionStorage).
 */
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'hintSeen'

export default function ExploreHint({ onSeen }) {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return
    }
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    const check = () => {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setFading(true)
        setTimeout(() => {
          setVisible(false)
          onSeen?.()
        }, 600)
      }
    }
    const interval = setInterval(check, 200)
    return () => clearInterval(interval)
  }, [visible, onSeen])

  const markSeen = () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
    setFading(true)
    setTimeout(() => {
      setVisible(false)
      onSeen?.()
    }, 600)
  }

  useEffect(() => {
    if (!visible) return
    const handler = () => markSeen()
    window.addEventListener('hint:orb-interaction', handler)
    return () => window.removeEventListener('hint:orb-interaction', handler)
  }, [visible])

  if (!visible) return null

  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || 'ontouchstart' in window)
  const hintText = isMobile
    ? '✦ TAP THE ORBS TO EXPLORE ✦'
    : '✦ CLICK THE ORBS TO EXPLORE ✦'

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 68,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        fontSize: '9px',
        letterSpacing: '4px',
        color: 'rgba(255,255,255,0.35)',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        opacity: fading ? 0 : 1,
        transition: 'opacity 600ms ease-out',
        animation: fading ? 'none' : 'hintBreathe 3s ease-in-out infinite',
      }}
    >
      {hintText}
    </div>
  )
}
