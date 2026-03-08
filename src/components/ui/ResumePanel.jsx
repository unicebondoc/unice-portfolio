/**
 * ResumePanel — in-site PDF viewer. Opens when the Résumé artifact is clicked.
 */
import styles from './ResumePanel.module.css'

const RESUME_PDF_URL = '/resume/Unice_Bondoc_Resume.pdf'

export default function ResumePanel({ onClose }) {
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
        <div className={styles.frameWrap}>
          <iframe
            src={RESUME_PDF_URL}
            title="Unice Bondoc — Résumé"
            className={styles.iframe}
          />
        </div>
      </div>
    </div>
  )
}
