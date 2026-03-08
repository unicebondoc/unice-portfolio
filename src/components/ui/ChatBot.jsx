import { useEffect, useRef, useState } from 'react'
import { useChatGPT } from '../../hooks/useChatGPT'
import useStore from '../../hooks/useStore'
import { SUGGESTED_QUESTIONS } from '../../data/suggestedQuestions'
import styles from './ChatBot.module.css'

const LOADING_PHRASES = [
  'The tree is listening…',
  'Gathering a memory…',
  'Tracing the roots…',
]
const REVEAL_MS_PER_WORD = 36
const REVEAL_MS_MIN = 400

export default function ChatBot() {
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const isMobile = useStore((s) => s.isMobile)
  const open = activePanel?.type === 'chat'

  const { messages, sendMessage, isLoading, error, pendingReply, setPendingReply, commitPendingReply, clearMessages } = useChatGPT()
  const [input, setInput] = useState('')
  const [loadingPhrase, setLoadingPhrase] = useState(LOADING_PHRASES[0])
  const [revealedText, setRevealedText] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const revealEndRef = useRef(false)
  const setChatPulse = useStore((s) => s.setChatPulse)
  const prevMsgCountRef = useRef(0)

  useEffect(() => {
    if (messages.length > prevMsgCountRef.current) {
      const last = messages[messages.length - 1]
      if (last?.role === 'assistant') setChatPulse()
    }
    prevMsgCountRef.current = messages.length
  }, [messages, setChatPulse])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [open, messages.length, isLoading, revealedText])

  // Rotate loading phrase while waiting
  useEffect(() => {
    if (!isLoading || pendingReply) return
    const idx = Math.floor(Math.random() * LOADING_PHRASES.length)
    setLoadingPhrase(LOADING_PHRASES[idx])
    const id = setInterval(() => {
      setLoadingPhrase((prev) => {
        const i = LOADING_PHRASES.indexOf(prev)
        const next = (i + 1) % LOADING_PHRASES.length
        return LOADING_PHRASES[next]
      })
    }, 2200)
    return () => clearInterval(id)
  }, [isLoading, pendingReply])

  // Progressive reveal when pendingReply is set
  useEffect(() => {
    if (!pendingReply) {
      setRevealedText('')
      revealEndRef.current = false
      return
    }
    const words = pendingReply.split(/(\s+)/)
    let index = 0
    setRevealedText('')
    revealEndRef.current = false

    const duration = Math.max(REVEAL_MS_MIN, words.filter(Boolean).length * REVEAL_MS_PER_WORD)
    const step = Math.max(1, Math.ceil(words.length / Math.max(1, duration / 50)))
    const interval = setInterval(() => {
      index += step
      if (index >= words.length) {
        clearInterval(interval)
        setRevealedText(pendingReply)
        revealEndRef.current = true
        commitPendingReply()
        return
      }
      setRevealedText(words.slice(0, index).join(''))
    }, 50)

    return () => clearInterval(interval)
  }, [pendingReply, commitPendingReply])

  const send = () => {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage(text)
    setInput('')
  }

  const onSuggestedQuestion = (question) => {
    if (!question || isLoading) return
    const text = question.replace(/\s*[🌿✦📋🤖🌙🏆📩⚡🔮🚀]\s*$/g, '').trim() || question
    setInput(text)
    sendMessage(text)
    setInput('')
  }

  const stripEmoji = (q) => (q || '').replace(/\s*[🌿✦📋🤖🌙🏆📩⚡🔮🚀]\s*$/g, '').trim()
  const hasUserSentMessage = messages.some((m) => m.role === 'user')
  const usedTexts = new Set(
    messages
      .filter((m) => m.role === 'user')
      .map((m) => (m.text || '').trim().toLowerCase())
  )
  const availableQuestions = SUGGESTED_QUESTIONS.filter(
    (q) => !usedTexts.has(stripEmoji(q).toLowerCase())
  )
  const chipsToShow = availableQuestions.slice(0, 3)
  const lastMessage = messages[messages.length - 1]
  const showChipsAfterReply = lastMessage?.role === 'assistant' && !isLoading && !pendingReply
  const showChips = (!hasUserSentMessage || showChipsAfterReply) && chipsToShow.length > 0

  return (
    <div
      className={styles.wrap}
      style={{
        position: 'fixed',
        ...(isMobile
          ? { left: 0, right: 0, bottom: 0, top: 'auto', zIndex: 2147483646 }
          : { right: open ? 100 : 24, bottom: 24, zIndex: 2147483646 }),
        pointerEvents: 'none',
      }}
    >
      {open && (
        <div className={`${styles.panel} ${isMobile ? styles.panelMobile : ''}`}>
          <div className={styles.header}>
            <div className={styles.title}>MEMORY TREE</div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={clearMessages}
                className={styles.clear}
                aria-label="Clear chat"
                title="Clear chat"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className={styles.close}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          <div ref={listRef} className={styles.body}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgAssistant}`}
              >
                {m.text}
              </div>
            ))}
            {pendingReply && (
              <div className={`${styles.msg} ${styles.msgAssistant} ${styles.msgReveal}`}>
                {revealedText}
                {!revealEndRef.current && <span className={styles.cursor} />}
              </div>
            )}
            {isLoading && !pendingReply && (
              <div className={styles.typing}>{loadingPhrase}</div>
            )}
            {error && (
              <div className={styles.errorNote}>{error}</div>
            )}
          </div>

          <div className={styles.suggested}>
            {showChips &&
              chipsToShow.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.chip}
                  onClick={() => onSuggestedQuestion(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className={styles.inputRow}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the tree…"
              className={styles.input}
              aria-label="Message input"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`${styles.send} ${input.trim() && !isLoading ? styles.sendEnabled : styles.sendDisabled}`}
              aria-label="Send"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
