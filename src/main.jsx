import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'

const ForestExperience = lazy(() => import('./App.jsx'))
const FastTrackSite = lazy(() => import('./pages/FastTrackSite.jsx'))
const isEmbeddedForest = window.location.pathname === '/'
  && new URLSearchParams(window.location.search).get('embed') === '1'

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
    <Suspense fallback={<div className="route-loading" aria-label="Loading portfolio" />}>
      {isEmbeddedForest ? <ForestExperience /> : <FastTrackSite />}
    </Suspense>
  </React.StrictMode>
)
