// ── DIAGNOSTIC SHELL — no Canvas, no HUD, no CSS, no portal ────
// Purpose: confirm that React itself can render position:fixed elements.
// Add components back one-by-one after both probes are visible.

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>

      {/* PROBE A — top-left green */}
      <div
        id="probe-green"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40vw',
          height: '40vh',
          background: 'lime',
          zIndex: 2147483647,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: '#000',
          pointerEvents: 'none',
        }}
      >
        GREEN ✓ TOP-LEFT
      </div>

      {/* PROBE B — bottom-right red */}
      <div
        id="probe-red"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '40vw',
          height: '40vh',
          background: 'red',
          zIndex: 2147483647,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: '#fff',
          pointerEvents: 'none',
        }}
      >
        RED ✓ BOTTOM-RIGHT
      </div>

    </div>
  )
}
