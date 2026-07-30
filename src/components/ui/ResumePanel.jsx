/**
 * ResumePanel — in-site PDF viewer. Opens when the Résumé artifact is clicked.
 * Keeps visitors in place with an embedded PDF plus optional full-size/download actions.
 */
import { useEffect, useRef } from 'react'
import styles from './ResumePanel.module.css'

const RESUME_PDF_URL = '/resume/Unice_Bondoc_Resume.pdf'

export default function ResumePanel({ onClose }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll('button, a[href], iframe')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className={styles.anchor}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={panelRef} className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          ref={closeRef}
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        />
        <div className={styles.headerGlow} aria-hidden />
        <header className={styles.header}>
          <span className={styles.sparkle} aria-hidden>◈</span>
          <h2 id="resume-title" className={styles.title}>RÉSUMÉ</h2>
          <p className={styles.subtitle}>my journey</p>
        </header>
        <div className={styles.desktopResume}>
          <div className={styles.desktopActions}>
            <p>Two-page résumé · updated 2026</p>
            <div>
              <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer">Open full size ↗</a>
              <a href={RESUME_PDF_URL} download="Unice_Bondoc_Resume.pdf">Download PDF ↓</a>
            </div>
          </div>
          <div className={styles.frameWrap}>
            <iframe
              src={RESUME_PDF_URL}
              title="Unice Bondoc — Résumé"
              className={styles.iframe}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '500px',
                border: 'none',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
