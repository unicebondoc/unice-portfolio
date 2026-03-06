import { useEffect, useMemo, useRef, useState } from 'react'
import useStore from '../../hooks/useStore'

export default function SimpleChat() {
  const isMobile = useStore((s) => s.isMobile)
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)

  const isOpen = activePanel?.type === 'chat-simple'
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => ([
    { role: 'assistant', text: "Hi — I'm a simple chat stub. This will be wired to AI later." },
  ]))

  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [isOpen, messages.length])

  const canSend = input.trim().length > 0

  const layout = useMemo(() => {
    if (isMobile) {
      return {
        panel: {
          left: 12,
          right: 12,
          bottom: 12,
          top: 80,
          width: 'auto',
          height: 'auto',
          borderRadius: 14,
        },
        btn: { right: 16, bottom: 16 },
      }
    }
    return {
      panel: {
        right: 18,
        top: 90,
        width: 360,
        height: 460,
        borderRadius: 14,
      },
      btn: { right: 18, bottom: 18 },
    }
  }, [isMobile])

  const open = () => setActivePanel({ type: 'chat-simple' })
  const close = () => setActivePanel(null)

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      { role: 'assistant', text: `Echo: ${text}` },
    ])
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) send()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={isOpen ? close : open}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          right: layout.btn.right,
          bottom: layout.btn.bottom,
          zIndex: 120,
          pointerEvents: 'auto',
          width: 52,
          height: 52,
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(8, 20, 45, 0.88)',
          color: 'rgba(230,250,250,0.92)',
          fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
          fontSize: 14,
          letterSpacing: 1,
          cursor: 'pointer',
          boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
        }}
      >
        Chat
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat panel"
          style={{
            position: 'fixed',
            zIndex: 120,
            pointerEvents: 'auto',
            ...layout.panel,
            background: 'rgba(8, 15, 30, 0.72)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
            backdropFilter: 'blur(24px) saturate(1.25)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                letterSpacing: 4,
                color: 'rgba(0, 220, 255, 0.65)',
                userSelect: 'none',
              }}
            >
              SIMPLE CHAT
            </div>
            <button
              type="button"
              onClick={close}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
                padding: 0,
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div
            ref={listRef}
            style={{
              flex: '1 1 auto',
              padding: 12,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  color: m.role === 'user' ? 'rgba(200, 220, 255, 0.92)' : 'rgba(220, 245, 245, 0.92)',
                  fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
                  fontSize: 14,
                  lineHeight: 1.5,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: 12,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message…"
              rows={1}
              style={{
                flex: '1 1 auto',
                resize: 'none',
                padding: '10px 10px',
                borderRadius: 10,
                border: '1px solid rgba(0, 220, 255, 0.18)',
                background: 'rgba(0, 220, 255, 0.06)',
                color: 'rgba(230,250,250,0.92)',
                outline: 'none',
                fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
                fontSize: 13,
                lineHeight: 1.4,
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              style={{
                flex: '0 0 auto',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.14)',
                background: canSend ? 'rgba(0, 220, 255, 0.18)' : 'rgba(255,255,255,0.06)',
                color: canSend ? 'rgba(230,250,250,0.95)' : 'rgba(230,250,250,0.45)',
                cursor: canSend ? 'pointer' : 'not-allowed',
                fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
                fontSize: 13,
                letterSpacing: 1,
              }}
              aria-label="Send"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}

