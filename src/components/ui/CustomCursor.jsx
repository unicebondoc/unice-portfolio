/**
 * CustomCursor — desktop only. Glowing dot that expands to ring on interactive hover.
 * Disabled for pointer: coarse (touch). Uses transform + rAF for smooth movement.
 */
import { useRef, useEffect, useState } from 'react'
import useStore from '../../hooks/useStore'
import styles from './CustomCursor.module.css'

const LERP = 0.12

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hover, setHover] = useState(false)
  const dotRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const isMobile = useStore((s) => s.isMobile)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return
    const media = window.matchMedia('(pointer: coarse)')
    if (media.matches) return

    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const tick = () => {
      if (!mountedRef.current) return
      const pos = posRef.current
      const target = targetRef.current
      pos.x += (target.x - pos.x) * LERP
      pos.y += (target.y - pos.y) * LERP
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      }
      if (mountedRef.current) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    const onOver = (e) => {
      const target = e.target?.closest?.('a, button, [role="button"], [data-cursor-hover]')
      setHover(!!target)
    }
    document.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [isMobile, visible])

  useEffect(() => {
    if (visible && !isMobile) document.body.classList.add('custom-cursor-active')
    else document.body.classList.remove('custom-cursor-active')
    return () => document.body.classList.remove('custom-cursor-active')
  }, [visible, isMobile])

  if (isMobile) return null

  return (
    <div
      ref={dotRef}
      className={`${styles.cursor} ${visible ? styles.visible : ''} ${hover ? styles.hover : ''}`}
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      <span className={styles.dot} />
      <span className={styles.ring} />
    </div>
  )
}
