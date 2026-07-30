/**
 * TreasureChest — the forest's single visual entrance to Selected Work.
 * Project browsing lives on /work/ so this control has one predictable outcome.
 */
import useStore from '../../hooks/useStore'

export default function TreasureChest() {
  const activePanel = useStore((state) => state.activePanel)
  const isMobile = useStore((state) => state.isMobile)

  if (isMobile) return null

  const hidden = activePanel?.type === 'memory'

  return (
    <>
      <style>{`
        @keyframes chestBeacon {
          0%, 100% { opacity: 0.34; transform: translateX(-50%) scale(0.86); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.08); }
        }
        .work-chest:hover .work-chest-lid,
        .work-chest:focus-visible .work-chest-lid {
          transform: rotateX(-34deg);
        }
        .work-chest:hover .work-chest-label,
        .work-chest:focus-visible .work-chest-label {
          color: rgba(255, 226, 135, 1);
        }
      `}</style>
      <a
        className="work-chest"
        href="/work/"
        aria-label="View selected work"
        tabIndex={hidden ? -1 : 0}
        aria-hidden={hidden}
        style={{
          position: 'fixed',
          bottom: 25,
          left: '50%',
          zIndex: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'inherit',
          textDecoration: 'none',
          transform: 'translateX(-50%)',
          opacity: hidden ? 0 : 1,
          pointerEvents: hidden ? 'none' : 'auto',
          transition: 'opacity 300ms ease, transform 220ms ease',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 14,
            width: 112,
            height: 54,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,205,73,0.42), rgba(76,171,255,0.1) 48%, transparent 72%)',
            filter: 'blur(8px)',
            animation: 'chestBeacon 2.8s ease-in-out infinite',
          }}
        />
        <span aria-hidden style={{ position: 'relative', width: 78, height: 70, perspective: 180 }}>
          <svg width="78" height="46" viewBox="0 0 78 46" style={{ position: 'absolute', bottom: 0 }}>
            <defs>
              <linearGradient id="workChestBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9a92f" />
                <stop offset="100%" stopColor="#67400e" />
              </linearGradient>
            </defs>
            <rect x="4" y="8" width="70" height="37" rx="6" fill="url(#workChestBase)" stroke="#e7b848" strokeWidth="1.5" />
            <rect x="4" y="20" width="70" height="4" fill="#6f4a18" opacity="0.66" />
            <rect x="34" y="8" width="10" height="37" fill="#72501d" opacity="0.48" />
            <rect x="31" y="15" width="16" height="11" rx="3" fill="#d3a12a" stroke="#ffe071" />
            <circle cx="39" cy="20.5" r="2.4" fill="#755018" />
          </svg>
          <span
            className="work-chest-lid"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 28,
              transformOrigin: '50% 100%',
              transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <svg width="78" height="28" viewBox="0 0 78 28">
              <defs>
                <linearGradient id="workChestLid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0c24d" />
                  <stop offset="100%" stopColor="#9b6c1f" />
                </linearGradient>
              </defs>
              <rect x="4" width="70" height="24" rx="6" fill="url(#workChestLid)" stroke="#e7b848" strokeWidth="1.5" />
              <rect x="4" y="15" width="70" height="4" fill="#76511b" opacity="0.55" />
              <rect x="34" width="10" height="24" fill="#78541d" opacity="0.4" />
            </svg>
          </span>
        </span>
        <span
          className="work-chest-label"
          style={{
            position: 'relative',
            marginTop: 5,
            color: 'rgba(224,190,94,0.82)',
            fontFamily: "'Raleway', sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 3.2,
            textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(255,205,73,0.34)',
            transition: 'color 220ms ease',
          }}
        >
          View Work
        </span>
      </a>
    </>
  )
}
