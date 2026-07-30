/**
 * BlogPanel — shows latest 2 Medium articles fetched from /api/blog.
 * Closes on X click OR click outside the panel.
 */
import { useState, useEffect } from 'react'
import styles from './BlogPanel.module.css'

const MEDIUM_URL = 'https://medium.com/@unicebondoc'

function formatDate(pubDate) {
  if (!pubDate) return ''
  try {
    return new Date(pubDate).toLocaleDateString('en-AU', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function BlogPanel({ onClose }) {
  const [articles, setArticles] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        if (data.articles?.length) setArticles(data.articles)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [])

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="writings-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        />

        <header className={styles.header}>
          <span className={styles.sparkle} aria-hidden>❋</span>
          <h2 id="writings-title" className={styles.title}>WRITINGS</h2>
          <p className={styles.subtitle}>thoughts & articles</p>
        </header>

        <div className={styles.articles}>
          {articles === null && !error && (
            <p className={styles.loading}>fetching from the ether…</p>
          )}

          {error && (
            <p className={styles.loading}>
              The scrolls are resting.{' '}
              <a href={MEDIUM_URL} target="_blank" rel="noopener noreferrer" className={styles.fallback}>
                Read on Medium →
              </a>
            </p>
          )}

          {articles?.map((a) => (
            <a
              key={a.link}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <span className={styles.cardDate}>{formatDate(a.pubDate)}</span>
              <span className={styles.cardTitle}>{a.title}</span>
              {a.excerpt && <span className={styles.cardExcerpt}>{a.excerpt}</span>}
              <span className={styles.cardCta}>Read on Medium →</span>
            </a>
          ))}
        </div>

        <a
          href={MEDIUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.allLink}
        >
          See all writings ↗
        </a>
      </div>
    </div>
  )
}
