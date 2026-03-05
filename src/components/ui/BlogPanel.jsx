/**
 * BlogPanel — small glass panel with writings/blog link.
 * Opens when the Tome artifact is clicked.
 */
import styles from './BlogPanel.module.css'

const BLOG_URL = 'https://medium.com/@unicebondoc'

export default function BlogPanel({ onClose }) {
  return (
    <div className={styles.anchor} aria-label="Writings">
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        />
        <h2 className={styles.title}>WRITINGS</h2>
        <p className={styles.subtitle}>Blog & articles</p>
        <a
          href={BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Read on Medium →
        </a>
        <p className={styles.hint}>More posts coming soon.</p>
      </div>
    </div>
  )
}
