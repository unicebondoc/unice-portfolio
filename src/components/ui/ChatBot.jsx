import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGemini } from '../../hooks/useGemini'
import useStore from '../../hooks/useStore'
import { useSound } from '../../context/SoundManager'
import styles from './ChatBot.module.css'
import TycheMascot from './TycheMascot'

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
function Message({ role, text, isInitial }) {
  return (
    <motion.div
      className={`${role === 'user' ? styles.userMsg : styles.aiMsg} ${isInitial ? styles.initialMsg : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      {text}
    </motion.div>
  )
}

// ── Panel animation — oracle: fade + translateY (open 400ms, close 250ms) ─
const panelVariants = {
  hidden:  {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

/**
 * ChatBot — Gemini-powered chat with holographic cat trigger.
 * Spirit-guide behavior: idle float, head tilt, turns toward hovered orb, glow on memory open.
 */
export default function ChatBot() {
  const [input,  setInput]    = useState('')
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const messagesEndRef        = useRef(null)
  const inputRef              = useRef(null)
  const panelWrapRef          = useRef(null)

  const activePanel   = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const entranceTime  = useStore((s) => s.entranceTime)
  const loadingExited = useStore((s) => s.loadingExited)

  const { messages, sendMessage, isLoading, error } = useGemini()
  const sound = useSound()

  const isOpen = activePanel?.type === 'chat'
  const isMobile = useStore((s) => s.isMobile)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Play gentle bell when a new assistant message arrives
  const prevMessagesLenRef = useRef(messages.length)
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (messages.length > prevMessagesLenRef.current && last?.role === 'assistant') {
      sound?.play('chatReceive')
    }
    prevMessagesLenRef.current = messages.length
  }, [messages, sound])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120)
  }, [isOpen])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage(text)
    sound?.play('chatSend')
    setInput('')
  }, [input, isLoading, sendMessage, sound])

  const handleSendChip = useCallback((text) => {
    if (!text || isLoading) return
    sendMessage(text)
    sound?.play('chatSend')
  }, [isLoading, sendMessage, sound])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasNewMessage = !isOpen && messages.length > 1

  const handlePanelMouseMove = useCallback((e) => {
    if (!panelWrapRef.current) return
    const rect = panelWrapRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const nx = (e.clientX - cx) / (rect.width / 2)
    const ny = (e.clientY - cy) / (rect.height / 2)
    setParallax({ x: nx * 1.8, y: ny * 1.8 })
  }, [])
  const handlePanelMouseLeave = useCallback(() => setParallax({ x: 0, y: 0 }), [])

  return (
    <>
      {/* ── Chat panel — relic shard with drift, parallax, shimmer ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            ref={panelWrapRef}
            className={styles.panelParallaxWrap}
            onMouseMove={handlePanelMouseMove}
            onMouseLeave={handlePanelMouseLeave}
            onClick={(e) => e.stopPropagation()}
            style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
          >
            <div className={styles.panelDriftWrap}>
              <motion.div
                className={`${styles.panel} ${styles.panelMaterialize}`}
                initial={false}
                animate={{ opacity: 1 }}
                exit="exit"
                variants={panelVariants}
                style={{ transformOrigin: 'bottom right' }}
                aria-label="Ask the tree — Unice's story"
              >
                <div className={styles.chatPanelTopLight} />
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={styles.chatPanelParticle}
                    style={{
                      left: `${12 + i * 22}%`,
                      top: `${15 + (i % 2) * 35}%`,
                      animationDelay: `${i * 0.9}s`,
                    }}
                  />
                ))}
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.headerTitle}>· ASK THE TREE ·</span>
              </div>
              <button
                className={styles.headerClose}
                onClick={() => setActivePanel(null)}
                aria-label="Close chat"
              >
                {isMobile ? '←' : '✕'}
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  role={msg.role}
                  text={msg.text}
                  isInitial={i === 0 && msg.role === 'assistant'}
                />
              ))}
              {isLoading && <TypingDots />}
              {error && <p className={styles.errorNote}>⚠ {error}</p>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input — send button inside field */}
            <div className={styles.footer}>
              <div className={styles.inputWrap}>
                <label htmlFor="chat-input" className="sr-only">Message to ask the tree</label>
                <input
                  ref={inputRef}
                  className={styles.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="whisper a question..."
                  disabled={isLoading}
                  maxLength={300}
                  aria-label="Message to ask the tree"
                  id="chat-input"
                />
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send"
                >
                  →
                </button>
              </div>
              <div className={styles.suggestedWrap}>
                <button
                  type="button"
                  className={styles.suggestedChip}
                  onClick={() => handleSendChip('What has she built?')}
                  disabled={isLoading}
                >
                  What has she built?
                </button>
                <span className={styles.suggestedSep}>·</span>
                <button
                  type="button"
                  className={styles.suggestedChip}
                  onClick={() => handleSendChip('What are her skills?')}
                  disabled={isLoading}
                >
                  What are her skills?
                </button>
                <span className={styles.suggestedSep}>·</span>
                <button
                  type="button"
                  className={styles.suggestedChip}
                  onClick={() => handleSendChip('Tell me about her AI projects')}
                  disabled={isLoading}
                >
                  Tell me about her AI projects
                </button>
              </div>
            </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <TycheMascot
        entranceOpacity={loadingExited ? 1 : Math.min(1, Math.max(0, (entranceTime - 2.5) / 0.5))}
        showUnread={hasNewMessage}
      />
    </>
  )
}
