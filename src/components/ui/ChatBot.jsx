import { useState } from 'react'

export default function ChatBot() {
  const [open, setOpen] = useState(false)

  // Phase 1: styling + layout only (no real chat UX yet)
  const placeholderMessages = [
    { role: 'assistant', text: "Hi — this is a minimal chat shell. We'll wire real chat next." },
    { role: 'assistant', text: 'For now, this panel is just a layout + click-layer sanity check.' },
    { role: 'user', text: 'Got it.' },
  ]

  return (
    <div
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
          style={{
            pointerEvents: 'auto',
            width: 340,
            height: 460,
            marginBottom: 12,
            background: 'rgba(8, 15, 30, 0.72)',
            color: 'rgba(235, 245, 255, 0.92)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 18,
            boxShadow: '0 22px 70px rgba(0,0,0,0.55)',
            backdropFilter: 'blur(24px) saturate(1.25)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseDown={() => console.log('[ChatBot] panel mouse down')}
          onPointerDown={() => console.log('[ChatBot] panel pointer down')}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0))',
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                letterSpacing: 4,
                color: 'rgba(0, 220, 255, 0.65)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              CHAT
            </div>
            <button
              type="button"
              onClick={() => {
                console.log('[ChatBot] close clicked')
                setOpen(false)
                console.log('[ChatBot] open:', false)
              }}
              style={{
                pointerEvents: 'auto',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
                padding: 2,
              }}
              aria-label="Close chat"
              onMouseDown={() => console.log('[ChatBot] close mouse down')}
              onPointerDown={() => console.log('[ChatBot] close pointer down')}
            >
              ×
            </button>
          </div>

          {/* Body (scrollable) */}
          <div
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {placeholderMessages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  padding: '10px 12px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.03)',
                  color: m.role === 'user' ? 'rgba(200, 220, 255, 0.92)' : 'rgba(220, 245, 245, 0.92)',
                  fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input row (visual only in Phase 1) */}
          <div
            style={{
              flex: '0 0 auto',
              padding: 12,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <input
              value=""
              readOnly
              placeholder="Type a message…"
              style={{
                pointerEvents: 'auto',
                flex: '1 1 auto',
                height: 40,
                borderRadius: 12,
                padding: '0 12px',
                border: '1px solid rgba(0, 220, 255, 0.18)',
                background: 'rgba(0, 220, 255, 0.06)',
                color: 'rgba(230,250,250,0.92)',
                outline: 'none',
                fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
                fontSize: 13,
              }}
              aria-label="Message input (disabled in Phase 1)"
              onMouseDown={() => console.log('[ChatBot] input mouse down')}
              onPointerDown={() => console.log('[ChatBot] input pointer down')}
            />
            <button
              type="button"
              disabled
              style={{
                pointerEvents: 'auto',
                height: 40,
                padding: '0 14px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(230,250,250,0.45)',
                cursor: 'not-allowed',
                fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
                fontSize: 13,
                letterSpacing: 1,
              }}
              aria-label="Send (disabled in Phase 1)"
              onMouseDown={() => console.log('[ChatBot] send mouse down')}
              onPointerDown={() => console.log('[ChatBot] send pointer down')}
            >
              Send
            </button>
          </div>
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
        style={{
          pointerEvents: 'auto',
          border: 'none',
          borderRadius: 14,
          height: 44,
          padding: '0 14px',
          background: 'rgba(0, 220, 255, 0.18)',
          color: 'rgba(235, 250, 255, 0.92)',
          fontWeight: 650,
          letterSpacing: 1,
          fontFamily: 'Raleway, system-ui, -apple-system, sans-serif',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(14px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
        }}
      >
        Open chat
      </button>
    </div>
  )
}

