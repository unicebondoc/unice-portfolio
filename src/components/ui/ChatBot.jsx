import { useEffect, useRef, useState } from 'react'
import { useGemini } from '../../hooks/useGemini'
import styles from './ChatBot.module.css'

export default function ChatBot() {
  const [open, setOpen] = useState(false)

  // Phase 4: Gemini integration (keep UI + interaction model stable)
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, error } = useGemini()

  const listRef = useRef(null)
  const inputRef = useRef(null)

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
  }, [open, messages.length, isLoading])

  const send = () => {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage(text)
    setInput('')
  }

  return (
    <div
      className={styles.wrap}
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 2147483647,
        pointerEvents: 'none',
      }}
    >
      {open && (
        <div
          className={styles.panel}
          onMouseDown={() => console.log('[ChatBot] panel mouse down')}
          onPointerDown={() => console.log('[ChatBot] panel pointer down')}
        >
          {/* Header */}
          <div
            className={styles.header}
          >
            <div className={styles.title}>
              CHAT
            </div>
            <button
              type="button"
              onClick={() => {
                console.log('[ChatBot] close clicked')
                setOpen(false)
                console.log('[ChatBot] open:', false)
              }}
              className={styles.close}
              aria-label="Close chat"
              onMouseDown={() => console.log('[ChatBot] close mouse down')}
              onPointerDown={() => console.log('[ChatBot] close pointer down')}
            >
              ×
            </button>
          </div>

          {/* Body (scrollable) */}
          <div
            ref={listRef}
            className={styles.body}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgAssistant}`}
              >
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div className={styles.typing}>Thinking…</div>
            )}
            {error && (
              <div className={styles.errorNote}>
                {error}
              </div>
            )}
          </div>

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              console.log('[ChatBot] submit')
              send()
            }}
            className={styles.inputRow}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className={styles.input}
              aria-label="Message input"
              onMouseDown={() => console.log('[ChatBot] input mouse down')}
              onPointerDown={() => console.log('[ChatBot] input pointer down')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') console.log('[ChatBot] enter keydown')
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`${styles.send} ${input.trim() && !isLoading ? styles.sendEnabled : styles.sendDisabled}`}
              aria-label="Send"
              onMouseDown={() => console.log('[ChatBot] send mouse down')}
              onPointerDown={() => console.log('[ChatBot] send pointer down')}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onMouseDown={() => console.log('[ChatBot] mouse down')}
        onPointerDown={() => console.log('[ChatBot] pointer down')}
        onClick={() => {
          console.log('[ChatBot] button clicked')
          setOpen((v) => {
            const next = !v
            console.log('[ChatBot] open:', next)
            return next
          })
        }}
        className={styles.openBtn}
      >
        Open chat
      </button>
    </div>
  )
}

