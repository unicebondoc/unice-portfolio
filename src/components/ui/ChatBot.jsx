import { useState } from 'react'

export default function ChatBot() {
  const [open, setOpen] = useState(false)

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
            width: 320,
            height: 420,
            marginBottom: 12,
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          }}
          onMouseDown={() => console.log('[ChatBot] panel mouse down')}
          onPointerDown={() => console.log('[ChatBot] panel pointer down')}
        >
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Chat</div>
          <div>Test panel</div>
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
          borderRadius: 999,
          padding: '14px 18px',
          background: 'red',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        }}
      >
        Chat
      </button>
    </div>
  )
}

