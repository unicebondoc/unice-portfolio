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
  // Big red block covering bottom-right quarter of screen
  const probe = document.createElement('div')
  probe.id = 'chatbot-probe'
  probe.innerHTML = '<span style="color:white;font-size:24px;font-weight:bold">PROBE</span>'
  probe.style.cssText = 'position:fixed;bottom:0;right:0;width:40vw;height:40vh;background:rgba(255,0,68,0.85);z-index:2147483647;display:flex;align-items:center;justify-content:center;pointer-events:none;'
  document.body.appendChild(probe)
  console.error('[PROBE] injected — if you see this in console but not on screen, a browser extension is covering the page')
}, 800)

