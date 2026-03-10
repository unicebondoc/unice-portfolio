/**
 * MysticalCursor — custom cursor: inner dot (sharp cyan) + outer ring (soft, follows with lag).
 * Desktop only; hidden on touch devices.
 */
import { useEffect, useRef } from 'react'

export default function MysticalCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const moveCursor = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const animateRing = () => {
      const mouse = mouseRef.current
      const ring = ringPosRef.current
      ring.x += (mouse.x - ring.x) * 0.12
      ring.y += (mouse.y - ring.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      }
      rafRef.current = requestAnimationFrame(animateRing)
    }

    const handleMouseOver = (e) => {
      if (!ringRef.current) return
      const isClickable = e.target.closest(
        'button, a, [data-orb], input, textarea, [role="button"], [onClick], .artifact, .artifactIcon, .scrollContainer, [data-cursor-hover]'
      )
      if (isClickable) {
        ringRef.current.style.width = '48px'
        ringRef.current.style.height = '48px'
        ringRef.current.style.opacity = '0.8'
        ringRef.current.style.borderColor = 'rgba(0, 255, 220, 0.9)'
      } else {
        ringRef.current.style.width = '28px'
        ringRef.current.style.height = '28px'
        ringRef.current.style.opacity = '0.5'
        ringRef.current.style.borderColor = 'rgba(0, 220, 255, 0.6)'
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    rafRef.current = requestAnimationFrame(animateRing)

    document.body.classList.add('mystical-cursor-active')

    return () => {
      document.body.classList.remove('mystical-cursor-active')
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 220, 255, 0.6)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 2147483647,
          top: '-14px',
          left: '-14px',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease, border-color 0.2s ease',
          opacity: 0.5,
          boxShadow: '0 0 8px rgba(0, 220, 255, 0.3)',
          backdropFilter: 'blur(1px)',
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(0, 255, 240, 0.95)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 2147483647,
          top: '-2.5px',
          left: '-2.5px',
          boxShadow: '0 0 6px rgba(0, 255, 240, 0.8), 0 0 12px rgba(0, 200, 255, 0.4)',
        }}
      />
    </>
  )
}
