import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Suppress THREE.Clock deprecation from R3F/drei (we use THREE.Timer; lib will migrate)
const origWarn = console.warn
const origError = console.error
function suppressClockDeprecation(args, fallback) {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '')
  if (msg.includes('THREE.Clock') && msg.includes('deprecated')) return
  fallback.apply(console, args)
}
console.warn = (...args) => suppressClockDeprecation(args, origWarn)
console.error = (...args) => suppressClockDeprecation(args, origError)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
