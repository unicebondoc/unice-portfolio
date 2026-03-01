import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGemini } from '../../hooks/useGemini'
import styles from './ChatBot.module.css'

// ── Typing indicator ─────────────────────────────────────────────
function TypingDots() {
  return (
    <div className={styles.aiMsg}>
      <div className={styles.typingDots}>
        <span /><span /><span />
      </div>
    </div>
  )
}

// ── Single message bubble ────────────────────────────────────────
function Message({ role, text }) {
  return (
    <motion.div
      className={role === 'user' ? styles.userMsg : styles.aiMsg}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      {text}
    </motion.div>
  )
}

// ── Panel animation variants ─────────────────────────────────────
const panelVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
}

/**
 * ChatBot — collapsible Gemini-powered chat bubble, fixed bottom-right.
 *
 * - Collapsed: floating glow button
 * - Expanded: glass panel with message history + input
 * - Strips [MEMORY:orb-X] from displayed text; those trigger 3D pulses
 */
export default function ChatBot() {
  const [isOpen, setIsOpen]   = useState(false)
  const [input,  setInput]    = useState('')
  const messagesEndRef        = useRef(null)
  const inputRef              = useRef(null)

  const { messages, sendMessage, isLoading, error } = useGemini()

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when panel opens
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

  // Unread dot: show after first AI reply when panel is closed
  const hasNewMessage = !isOpen && messages.length > 1

  return (
    <div className={styles.wrapper}>
      {/* ── Chat panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.panel}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Unice's AI assistant"
          >
            {/* Header */}
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

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <Message key={i} role={msg.role} text={msg.text} />
              ))}
              {isLoading && <TypingDots />}
              {error && (
                <p className={styles.errorNote}>⚠ {error}</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / input */}
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
                  <path
                    d="M14 8L2 2l3 6-3 6 12-6z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger bubble ───────────────────────────── */}
      <motion.button
        className={styles.bubble}
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
              className={styles.bubbleIcon}
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className={styles.bubbleIcon}
            >
              ✦
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread indicator */}
        {hasNewMessage && <span className={styles.unreadDot} />}
      </motion.button>
    </div>
  )
}
