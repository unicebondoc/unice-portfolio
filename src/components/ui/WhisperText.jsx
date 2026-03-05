/**
 * WhisperText — rotating atmospheric lines at bottom center.
 * Fade in 1.5s, hold 5s, fade out 1.5s (8s cycle); hide when a panel is open.
 */
import { useState, useEffect, useRef } from 'react'
import useStore from '../../hooks/useStore'
import styles from './WhisperText.module.css'

const LINES = [
  'every memory is a seed that became a tree',
  'she left everything behind to grow something new',
  'from Manila to Sydney, the roots only grew deeper',
  'not all who wander are lost — some are planting',
  'the tree remembers what the world forgets',
]

const FADE_DUR = 1.5
const HOLD_DUR = 5

export default function WhisperText() {
  const activePanel = useStore((s) => s.activePanel)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('fadeIn') // 'fadeIn' | 'hold' | 'fadeOut'
  const [opacity, setOpacity] = useState(0)
  const phaseStartRef = useRef(Date.now())

  useEffect(() => {
    if (activePanel != null) return

    const advance = () => {
      const now = Date.now()
      const elapsed = (now - phaseStartRef.current) / 1000

      if (phase === 'fadeIn') {
        if (elapsed >= FADE_DUR) {
          setPhase('hold')
          setOpacity(1)
          phaseStartRef.current = now
        }
      } else if (phase === 'hold') {
        if (elapsed >= HOLD_DUR) {
          setPhase('fadeOut')
          setOpacity(0)
          phaseStartRef.current = now
        }
      } else {
        if (elapsed >= FADE_DUR) {
          setIndex((i) => (i + 1) % LINES.length)
          setPhase('fadeIn')
          setOpacity(0)
          phaseStartRef.current = now
        }
      }
    }

    const interval = setInterval(advance, 80)
    return () => clearInterval(interval)
  }, [activePanel, phase])

  // When entering fadeIn, set target opacity to 1 so CSS transition animates 0→1
  useEffect(() => {
    if (phase === 'fadeIn' && activePanel == null) setOpacity(1)
    if (phase === 'fadeOut') setOpacity(0)
  }, [phase, activePanel])

  if (activePanel != null) return null

  const transitionDur = phase === 'hold' ? '0s' : `${FADE_DUR}s`
  return (
    <div
      className={styles.whisper}
      style={{
        opacity: phase === 'hold' ? 1 : opacity,
        transition: `opacity ${transitionDur} ease-in-out`,
      }}
      aria-hidden
    >
      {LINES[index]}
    </div>
  )
}
