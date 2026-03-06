/**
 * ChatBot — rebuilt from zero. 100% inline styles, no CSS module dependency
 * for positioning. createPortal to document.body. Max z-index.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

console.log('[ChatBot] module loaded')

// Minimal stub — confirms portal works before adding useGemini back
function useGemini() {
  return { messages: [], sendMessage: () => {}, isLoading: false, error: null }
}

const Z = 2147483647 // max CSS z-index

export default function ChatBot() {
  console.log('[ChatBot] render called')
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput]   = useState('')
  const bottomRef           = useRef(null)
  const inputRef            = useRef(null)

  const { messages, sendMessage, isLoading, error } = useGemini()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const send = useCallback(() => {
    const t = input.trim()
    if (!t || isLoading) return
    sendMessage(t)
    setInput('')
  }, [input, isLoading, sendMessage])

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return createPortal(
    /* ── outer wrapper: fixed bottom-right ───────────────────────── */
    <div style={{
      position:      'fixed',
      bottom:        '28px',
      right:         '28px',
      zIndex:        Z,
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'flex-end',
      gap:           '12px',
      pointerEvents: 'auto',
    }}>

      {/* ── chat panel ─────────────────────────────────────────── */}
      {isOpen && (
        <div style={{
          width:         '340px',
          height:        '460px',
          display:       'flex',
          flexDirection: 'column',
          background:    'rgba(10,14,28,0.97)',
          border:        '1px solid rgba(255,255,255,0.09)',
          borderRadius:  '18px',
          overflow:      'hidden',
          boxShadow:     '0 24px 60px rgba(0,0,0,0.75),0 0 60px -12px rgba(199,125,255,0.30)',
        }}>
          {/* header */}
          <div style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            padding:         '14px 16px',
            borderBottom:    '1px solid rgba(255,255,255,0.07)',
            background:      'linear-gradient(135deg,rgba(199,125,255,0.12),rgba(0,217,255,0.08))',
            flexShrink:      0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{
                width:'7px', height:'7px', borderRadius:'50%',
                background:'#00FF88', boxShadow:'0 0 6px #00FF88',
                display:'inline-block', flexShrink:0,
              }} />
              <span style={{
                fontFamily: 'Sora,sans-serif', fontSize:'12.5px',
                fontWeight: 600, color:'rgba(232,234,240,0.88)',
              }}>Ask about Unice</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background:'rgba(255,255,255,0.06)', border:'none',
                borderRadius:'50%', width:'26px', height:'26px',
                cursor:'pointer', color:'rgba(232,234,240,0.55)',
                fontSize:'11px', lineHeight:'26px', textAlign:'center',
              }}
            >✕</button>
          </div>

          {/* messages */}
          <div style={{
            flex:1, overflowY:'auto', padding:'14px',
            display:'flex', flexDirection:'column', gap:'10px',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf:    m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth:     '85%',
                background:   m.role === 'user'
                  ? 'linear-gradient(135deg,rgba(199,125,255,0.22),rgba(0,217,255,0.14))'
                  : 'rgba(255,255,255,0.05)',
                border:       `1px solid ${m.role === 'user' ? 'rgba(199,125,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
                padding:      '9px 13px',
                fontFamily:   'Sora,sans-serif',
                fontSize:     '12.5px',
                lineHeight:   1.55,
                color:        'rgba(232,234,240,0.9)',
              }}>{m.text}</div>
            ))}
            {isLoading && (
              <div style={{ alignSelf:'flex-start', color:'rgba(199,125,255,0.6)', fontSize:'14px', padding:'4px 8px' }}>
                ···
              </div>
            )}
            {error && (
              <div style={{ color:'rgba(255,107,107,0.7)', fontSize:'11px', textAlign:'center' }}>
                ⚠ {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* input row */}
          <div style={{
            display:'flex', gap:'8px', padding:'10px 12px 12px',
            borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask me anything…"
              disabled={isLoading}
              maxLength={300}
              style={{
                flex:1, background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.10)', borderRadius:'10px',
                padding:'9px 12px', fontFamily:'Sora,sans-serif',
                fontSize:'12px', color:'rgba(232,234,240,0.9)', outline:'none',
              }}
            />
            <button
              onClick={send}
              disabled={isLoading || !input.trim()}
              style={{
                width:'34px', height:'34px', borderRadius:'10px', border:'none',
                background:'linear-gradient(135deg,#C77DFF,#00D9FF)',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.4 : 1,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2l3 6-3 6 12-6z" fill="#060914" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── trigger bubble ─────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
        style={{
          width:        '52px',
          height:       '52px',
          borderRadius: '50%',
          border:       'none',
          background:   'linear-gradient(135deg,#C77DFF 0%,#00D9FF 100%)',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          fontSize:     '20px',
          color:        '#060914',
          boxShadow:    '0 0 0 1px rgba(255,255,255,0.12),0 8px 24px rgba(0,0,0,0.5),0 0 30px -4px rgba(199,125,255,0.55)',
          flexShrink:   0,
          pointerEvents:'auto',
        }}
      >
        {isOpen ? '✕' : '✦'}
      </button>
    </div>,
    document.body
  )
}
