import { useEffect, useRef, useState } from 'react'
import { useChatGPT } from '../../hooks/useChatGPT'
import useStore from '../../hooks/useStore'
import styles from './ChatBot.module.css'

export default function ChatBot() {
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)
  const open = activePanel?.type === 'chat'

  // ChatGPT (OpenAI) integration
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, error } = useChatGPT()

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
        right: open ? 100 : 24,
        bottom: 24,
        zIndex: 2147483646,
        pointerEvents: 'none',
      }}
    >
      {open && (
        <div className={styles.panel}>
          {/* Header */}
          <div
            className={styles.header}
          >
            <div className={styles.title}>
              CHAT
            </div>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className={styles.close}
              aria-label="Close chat"
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

