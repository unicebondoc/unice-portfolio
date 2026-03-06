import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// ── DIAGNOSTIC PROBE — remove once chatbot is confirmed visible ──
// Vanilla JS: no React, no CSS modules, hardcoded max z-index.
// If this red dot appears on desktop → React/portal is the issue.
// If it does NOT appear → something is physically covering the viewport.
setTimeout(() => {
  const probe = document.createElement('div')
  probe.id = 'chatbot-probe'
  probe.style.cssText = [
    'position:fixed',
    'bottom:120px',
    'right:40px',
    'width:40px',
    'height:40px',
    'background:#ff0044',
    'border-radius:50%',
    'z-index:2147483647',
    'pointer-events:none',
    'border:3px solid white',
  ].join(';')
  document.body.appendChild(probe)
  console.log('[PROBE] red dot appended to body', probe)
}, 1500)

