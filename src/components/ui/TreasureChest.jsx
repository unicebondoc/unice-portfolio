/**
 * TreasureChest — bottom-center glowing chest.
 * Click once to open: lid swings up, golden gush, 4 project diamonds fan out horizontally.
 * Click again to close. Hover a diamond to see its label. Click to open project modal.
 */
import { useState, useCallback, useEffect, useRef, useId } from 'react'
import useStore from '../../hooks/useStore'
import { PROJECTS } from '../../data/projects'

// Horizontal row just above the chest — 4 diamonds evenly spaced
const DIAMOND_POSITIONS = [
  { x: -84, y: -72 },
  { x: -28, y: -72 },
  { x:  28, y: -72 },
  { x:  84, y: -72 },
]

function DiamondSvg({ color, glow, size = 32 }) {
  const uid = useId().replace(/:/g, '')
  const gradId = `dg-${uid}`
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 54 62"
      fill="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="30%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <polygon
        points="27,2 52,20 27,60 2,20"
        fill={`url(#${gradId})`}
        stroke={color}
        strokeWidth="1.5"
        opacity="1"
      />
      {/* inner facet lines */}
      <polygon
        points="27,8 46,21 27,52 8,21"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.8"
      />
      {/* top shine */}
      <polygon points="27,2 52,20 27,20" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="35" cy="13" rx="5" ry="3" fill="rgba(255,255,255,0.30)" transform="rotate(-20 35 13)" />
    </svg>
  )
}

function ProjectModal({ project, onClose }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      {/* backdrop — clicking anywhere outside card closes the modal */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer',
        }}
      />
      {/* card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: 'min(560px, 90vw)',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: 'linear-gradient(160deg, rgba(10,20,38,0.97) 0%, rgba(5,12,24,0.98) 100%)',
        border: `1px solid ${project.color}44`,
        borderRadius: 20,
        padding: '28px 28px 24px',
        boxShadow: `0 0 60px ${project.glowSoft}, 0 24px 60px rgba(0,0,0,0.6)`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.3,0.64,1)',
      }}>
        <button
          type="button" onClick={onClose} aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <DiamondSvg color={project.color} glow={project.glow} size={42} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          {project.flagship && (
            <span style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 9, letterSpacing: 4,
              color: project.color, textTransform: 'uppercase',
              display: 'block', marginBottom: 6,
              textShadow: `0 0 12px ${project.glow}`,
            }}>✦ Flagship Project ✦</span>
          )}
          <h2 style={{
            fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700,
            color: '#fff', margin: '0 0 6px 0',
            textShadow: `0 0 20px ${project.glowSoft}`,
          }}>{project.title}</h2>
          <p style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 11,
            letterSpacing: 3, textTransform: 'uppercase',
            color: `${project.color}cc`, margin: 0,
          }}>{project.subtitle}</p>
          {project.note && (
            <p style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 11,
              color: 'rgba(255,255,255,0.4)', margin: '8px 0 0',
              fontStyle: 'italic',
            }}>{project.note}</p>
          )}
        </div>

        <p style={{
          fontFamily: "'Raleway', sans-serif", fontSize: 13.5, lineHeight: 1.7,
          color: 'rgba(220,235,255,0.85)', margin: '0 0 20px',
        }}>{project.description}</p>

        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontFamily: "'Raleway', sans-serif", fontSize: 9.5,
            letterSpacing: 3, textTransform: 'uppercase',
            color: 'rgba(200,220,255,0.45)', margin: '0 0 8px',
          }}>Tech Stack</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px' }}>
            {project.stack.map((t) => (
              <span key={t} style={{
                fontFamily: "'Raleway', sans-serif", fontSize: 10,
                color: project.color, background: `${project.color}18`,
                border: `1px solid ${project.color}33`,
                borderRadius: 4, padding: '2px 8px',
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {project.links?.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', padding: '8px 20px', borderRadius: 8,
              background: `${project.color}22`, border: `1px solid ${project.color}66`,
              color: project.color, textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}>Live Site ↗</a>
          )}
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', padding: '8px 20px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}>GitHub ↗</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TreasureChest() {
  const activePanel = useStore((s) => s.activePanel)
  const isMobile = useStore((s) => s.isMobile)
  // On mobile the chest is hidden — projects are accessible via MobileArtifactPill
  if (isMobile) return null
  const [isOpen, setIsOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [diamondsOut, setDiamondsOut] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const timeoutRef = useRef(null)

  const handleOpen = useCallback(() => {
    if (isOpen) {
      // close
      setDiamondsOut(false)
      setTimeout(() => {
        setOpening(false)
        setIsOpen(false)
      }, 350)
      return
    }
    // open
    setIsOpen(true)
    setOpening(true)
    timeoutRef.current = setTimeout(() => {
      setOpening(false)
      setDiamondsOut(true)
    }, 500)
  }, [isOpen])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const isMemoryOpen = activePanel?.type === 'memory'

  return (
    <>
      <style>{`
        @keyframes diamondFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes lidSwing {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-120deg); }
        }
        @keyframes goldGush {
          0%   { opacity: 0; transform: translateX(-50%) scaleX(0.3) scaleY(0.2); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) scaleX(1.6) scaleY(2); }
        }
        @keyframes diamondRise {
          0%   { opacity: 0; transform: translate(calc(var(--dx) - 50%), 10px) scale(0.2); }
          65%  { opacity: 1; transform: translate(calc(var(--dx) - 50%), calc(var(--dy) - 50%)) scale(1.08); }
          100% { opacity: 1; transform: translate(calc(var(--dx) - 50%), calc(var(--dy) - 50%)) scale(1); }
        }
      `}</style>

      {/* Chest — bottom center */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 120,
          pointerEvents: 'auto',
          opacity: isMemoryOpen ? 0 : 1,
          transition: 'opacity 300ms ease',
        }}
      >
        <button
          type="button"
          onClick={handleOpen}
          aria-label={isOpen ? 'Close projects' : 'Open project treasure chest'}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', padding: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 0,
            perspective: '300px',
          }}
        >
          {/* CHEST SVG — perspective on THIS div so rotateX works on lid */}
          <div style={{ position: 'relative', width: 70, height: 68, perspective: '160px' }}>
            {/* base — always visible */}
            <svg width="70" height="42" viewBox="0 0 70 42" style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <rect x="3" y="8" width="64" height="34" rx="5" fill="url(#chestBase)" stroke="#a87832" strokeWidth="1.5" />
              <rect x="3" y="19" width="64" height="4" fill="#7a5520" opacity="0.6" />
              <rect x="30" y="8" width="10" height="34" fill="#7a5520" opacity="0.4" />
              <rect x="28" y="14" width="14" height="10" rx="3" fill="#c8962a" stroke="#ffd700" strokeWidth="1" />
              <circle cx="35" cy="19" r="2.5" fill="#7a5520" />
              <defs>
                <linearGradient id="chestBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8962a" />
                  <stop offset="100%" stopColor="#6b3e0a" />
                </linearGradient>
              </defs>
            </svg>

            {/* inner glow — only visible when open */}
            {(isOpen || opening) && (
              <div style={{
                position: 'absolute', bottom: 20, left: '50%',
                transform: 'translateX(-50%)',
                width: 44, height: 18,
                background: 'radial-gradient(ellipse, rgba(255,215,0,0.7) 0%, rgba(255,160,0,0.3) 60%, transparent 100%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                opacity: opening ? 0 : 1,
                transition: 'opacity 0.4s ease 0.3s',
              }} />
            )}

            {/* lid wrapper — gets the 3D rotation; perspective is on parent div above */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%',
              transformOrigin: '50% 100%',
              transform: (isOpen && !opening) ? 'rotateX(-120deg)' : 'rotateX(0deg)',
              transition: opening ? 'none' : 'transform 0.38s cubic-bezier(0.22,1,0.36,1)',
              animation: opening ? 'lidSwing 0.5s cubic-bezier(0.22,1,0.36,1) forwards' : undefined,
            }}>
              <svg width="70" height="26" viewBox="0 0 70 26">
                <rect x="3" y="0" width="64" height="22" rx="5 5 0 0" fill="url(#chestLid)" stroke="#a87832" strokeWidth="1.5" />
                <rect x="3" y="14" width="64" height="4" fill="#7a5520" opacity="0.5" />
                <rect x="30" y="0" width="10" height="22" fill="#7a5520" opacity="0.35" />
                <ellipse cx="20" cy="8" rx="10" ry="4" fill="rgba(255,220,120,0.18)" transform="rotate(-10 20 8)" />
                <defs>
                  <linearGradient id="chestLid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8b840" />
                    <stop offset="100%" stopColor="#a07020" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* gold gush during open animation */}
            {opening && (
              <div style={{
                position: 'absolute', bottom: 18, left: '50%',
                width: 50, height: 30,
                background: 'radial-gradient(ellipse, rgba(255,215,0,0.85) 0%, rgba(255,180,0,0.4) 50%, transparent 100%)',
                borderRadius: '50%',
                animation: 'goldGush 0.65s ease-out forwards',
                pointerEvents: 'none',
              }} />
            )}
          </div>

          {/* label */}
          <span style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 9, letterSpacing: 3,
            color: isOpen ? 'rgba(255,215,0,0.80)' : 'rgba(200,160,70,0.65)',
            textTransform: 'uppercase', fontWeight: 600, marginTop: 6,
            transition: 'color 0.3s ease',
          }}>
            {isOpen ? 'HIDE TREASURE' : 'OPEN PROJECTS'}
          </span>
        </button>

        {/* Diamond orbs — horizontal row above chest */}
        {PROJECTS.map((project, i) => {
          const pos = DIAMOND_POSITIONS[i]
          const delay = i * 70
          const isHov = hoveredIdx === i
          return (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              aria-label={`View project: ${project.title}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project) } }}
              onClick={() => setSelectedProject(project)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                '--dx': `${pos.x}px`,
                '--dy': `${pos.y}px`,
                opacity: 0,
                transform: `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%)) scale(1)`,
                animation: diamondsOut
                  ? `diamondRise 0.55s cubic-bezier(0.34,1.4,0.64,1) ${delay}ms forwards`
                  : undefined,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: diamondsOut ? 'auto' : 'none',
              }}
            >
              {/* hover label above diamond */}
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: 6,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: isHov ? 1 : 0,
                transition: 'opacity 0.18s ease',
                pointerEvents: 'none',
              }}>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 8.5, fontWeight: 700,
                  color: project.color, margin: 0,
                  lineHeight: 1.3, letterSpacing: '0.5px',
                  textShadow: `0 0 10px ${project.glow}`,
                }}>{project.title}</p>
                <p style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 7, color: 'rgba(210,225,245,0.6)',
                  margin: 0, letterSpacing: 0.5, lineHeight: 1.3,
                }}>{project.flagship ? '✦ FLAGSHIP' : project.subtitle.split(' — ')[0]}</p>
              </div>

              {/* diamond */}
              <div style={{
                animation: diamondsOut ? `diamondFloat ${2.4 + i * 0.25}s ease-in-out ${delay + 550}ms infinite` : undefined,
                filter: isHov
                  ? `drop-shadow(0 0 20px ${project.glow}) drop-shadow(0 0 8px ${project.glow})`
                  : `drop-shadow(0 0 10px ${project.glow}) drop-shadow(0 0 3px ${project.glow})`,
                transform: isHov ? 'scale(1.2)' : 'scale(1)',
                transition: 'filter 0.18s ease, transform 0.18s ease',
              }}>
                <DiamondSvg
                  color={project.color}
                  glow={project.glow}
                  size={project.flagship ? 34 : 28}
                />
              </div>
            </div>
          )
        })}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
