/**
 * MobileNavFab — floating action button that opens a radial/fan menu:
 * Skills, Résumé, Writings, + Tyche (open chat).
 * Only shown when isMobile.
 */
import { useState, useRef, useEffect } from 'react'
import useStore from '../../hooks/useStore'
import { useSound } from '../../context/SoundManager'
import styles from './MobileNavFab.module.css'

const ACTIONS = [
  { id: 'skills', label: 'Skills', icon: '✦', panel: { type: 'skills' } },
  { id: 'resume', label: 'Résumé', icon: '◈', href: '/resume.pdf', external: true },
  { id: 'writings', label: 'Writings', icon: '❋', panel: { type: 'blog' } },
  { id: 'tyche', label: 'Ask Tyche', icon: '🐱', panel: { type: 'chat' } },
]

export default function MobileNavFab() {
  const [open, setOpen] = useState(false)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const isMobile = useStore((s) => s.isMobile)
  const sound = useSound()
  const wrapRef = useRef(null)

  const onAction = (action) => {
    sound?.play('navHover')
    if (action.panel) {
      setActivePanel(action.panel)
      setOpen(false)
    }
    if (action.href && action.external) {
      window.open(action.href, '_blank', 'noopener,noreferrer')
      setOpen(false)
    }
  }

  useEffect(() => {
    const close = (e) => {
      if (open && wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  if (!isMobile) return null

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={`${styles.fan} ${open ? styles.fanOpen : ''}`}>
        {ACTIONS.map((action, i) => (
          <button
            key={action.id}
            type="button"
            className={styles.fanItem}
            onClick={() => onAction(action)}
            style={{
              '--i': i,
              '--n': ACTIONS.length,
            }}
            aria-label={action.label}
          >
            <span className={styles.fanIcon}>{action.icon}</span>
            <span className={styles.fanLabel}>{action.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className={styles.fabIcon}>{open ? '✕' : '☰'}</span>
      </button>
    </div>
  )
}
