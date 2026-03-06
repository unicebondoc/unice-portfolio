import { useState, useRef, useEffect, useCallback } from 'react'
import { useGemini } from '../../hooks/useGemini'
import styles from './ChatBot.module.css'

function TypingDots() {
  return (
    <div className={styles.aiMsg}>
      <div className={styles.typingDots}>
        <span /><span /><span />
      </div>
    </div>
  )
}

function Message({ role, text }) {
  return (
    <div className={role === 'user' ? styles.userMsg : styles.aiMsg}>
      {text}
    </div>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput]   = useState('')
  const messagesEndRef      = useRef(null)
  const inputRef            = useRef(null)

  const { messages, sendMessage, isLoading, error } = useGemini()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120)
  }, [isOpen])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage(text)
    setInput('')
  }, [input, isLoading, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasNewMessage = !isOpen && messages.length > 1

  return (
    <div className={styles.wrapper}>
      {/* ── Chat panel ──────────────────────────────────────── */}
      {isOpen && (
        <div className={styles.panel} aria-label="Unice's AI assistant">
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.headerDot} />
              <span className={styles.headerTitle}>Ask about Unice</span>
            </div>
            <button
              className={styles.headerClose}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} text={msg.text} />
            ))}
            {isLoading && <TypingDots />}
            {error && <p className={styles.errorNote}>⚠ {error}</p>}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.footer}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              disabled={isLoading}
              maxLength={300}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger bubble ──────────────────────────────────── */}
      <button
        className={styles.bubble}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
      >
        <span className={styles.bubbleIcon}>{isOpen ? '✕' : '✦'}</span>
        {hasNewMessage && <span className={styles.unreadDot} />}
      </button>
    </div>
  )
}
