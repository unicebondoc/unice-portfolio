/**
 * ResumePanel — in-site PDF viewer. Opens when the Résumé artifact is clicked.
 * Desktop: iframe embed. Mobile: View + Download links (native PDF viewer shows all pages).
 */
import useStore from '../../hooks/useStore'
import styles from './ResumePanel.module.css'

const RESUME_PDF_URL = '/resume/Unice_Bondoc_Resume.pdf'

export default function ResumePanel({ onClose }) {
  const isMobile = useStore((s) => s.isMobile)

  return (
    <div
      className={styles.anchor}
      aria-label="Résumé"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        />
        <div className={styles.headerGlow} aria-hidden />
        <header className={styles.header}>
          <span className={styles.sparkle} aria-hidden>◈</span>
          <h2 className={styles.title}>RÉSUMÉ</h2>
          <p className={styles.subtitle}>my journey</p>
        </header>
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '24px',
            }}
          >
            <a
              href={RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 24px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '11px',
                letterSpacing: '3px',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              VIEW FULL RÉSUMÉ ↗
            </a>
            <a
              href={RESUME_PDF_URL}
              download="Unice_Bondoc_Resume.pdf"
              style={{
                padding: '10px 24px',
                border: '1px solid rgba(0,220,255,0.3)',
                borderRadius: '8px',
                color: 'rgba(0,220,255,0.7)',
                fontSize: '11px',
                letterSpacing: '3px',
                textDecoration: 'none',
                background: 'rgba(0,220,255,0.05)',
              }}
            >
              DOWNLOAD PDF ↓
            </a>
            <p
              style={{
                fontSize: '9px',
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.25)',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              2 pages · updated 2026
            </p>
          </div>
        ) : (
          <div className={styles.frameWrap} style={{ height: '100%', overflow: 'hidden' }}>
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
        )}
      </div>
    </div>
  )
}
