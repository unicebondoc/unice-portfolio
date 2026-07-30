/**
 * MobileArtifactPill — labeled floating pill nav for mobile only.
 * Four tabs: Skills, Résumé, Writings, Vault.
 * Vault opens an inline bottom-sheet listing all projects; tap any to see the full modal.
 */
import { Fragment, useState, useCallback, useEffect } from 'react'
import useStore from '../../hooks/useStore'
import { PROJECTS } from '../../data/projects'

// ── Mini project modal (same style as TreasureChest desktop modal) ───────────
function ProjectDetailModal({ project, onClose }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`mobile-project-title-${project.id}`}
      style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'auto' }}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer',
        }}
      />
      {/* card — bottom sheet on mobile */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        maxHeight: '82vh',
        overflowY: 'auto',
        background: 'linear-gradient(160deg, rgba(10,20,38,0.97) 0%, rgba(5,12,24,0.98) 100%)',
        border: `1px solid ${project.color}44`,
        borderRadius: '20px 20px 0 0',
        padding: '24px 20px max(20px, env(safe-area-inset-bottom))',
        boxShadow: `0 -8px 48px rgba(0,0,0,0.5), 0 0 40px ${project.glowSoft}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        {/* drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 18px' }} />

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

        {project.flagship && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 4, color: project.color, textTransform: 'uppercase', margin: '0 0 6px', textAlign: 'center', textShadow: `0 0 12px ${project.glow}` }}>
            ✦ Flagship Project ✦
          </p>
        )}
        <h2 id={`mobile-project-title-${project.id}`} style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px', textAlign: 'center', textShadow: `0 0 20px ${project.glowSoft}` }}>
          {project.title}
        </h2>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: `${project.color}cc`, margin: '0 0 4px', textAlign: 'center' }}>
          {project.subtitle}
        </p>
        {project.note && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '4px 0 16px', fontStyle: 'italic', textAlign: 'center' }}>
            {project.note}
          </p>
        )}

        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, lineHeight: 1.7, color: 'rgba(220,235,255,0.85)', margin: '0 0 18px' }}>
          {project.description}
        </p>

        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(200,220,255,0.45)', margin: '0 0 8px' }}>
          Tech Stack
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 7px', marginBottom: 20 }}>
          {project.stack.map((t) => (
            <span key={t} style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, color: project.color, background: `${project.color}18`, border: `1px solid ${project.color}33`, borderRadius: 4, padding: '2px 7px' }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {project.links?.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', padding: '9px 22px', borderRadius: 8, background: `${project.color}22`, border: `1px solid ${project.color}66`, color: project.color, textDecoration: 'none' }}>
              Live Site ↗
            </a>
          )}
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', padding: '9px 22px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Projects bottom sheet ─────────────────────────────────────────────────────
function ProjectsSheet({ onClose, onSelectProject }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-label="Project vault" style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'flex-end', pointerEvents: 'auto' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', cursor: 'pointer' }} />
      <div style={{
        position: 'relative', zIndex: 1, width: '100%',
        maxHeight: '82vh', overflowY: 'auto',
        background: 'linear-gradient(180deg, rgba(8,18,40,0.97) 0%, rgba(4,10,24,0.98) 100%)',
        border: '1px solid rgba(100,180,255,0.12)',
        borderRadius: '20px 20px 0 0',
        padding: '20px 16px max(16px, env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 48px rgba(0,0,0,0.5)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 4, color: 'rgba(200,230,255,0.6)', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 16px' }}>
          ✦ Project Vault
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProject(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: `${p.color}0d`,
                border: `1px solid ${p.color}30`,
                borderRadius: 12,
                padding: '12px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {/* color dot */}
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.glow}`, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: 1, color: `${p.color}bb`, margin: '2px 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.subtitle}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 14, flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main pill ─────────────────────────────────────────────────────────────────
export default function MobileArtifactPill() {
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)

  const activeArtifact =
    activePanel?.type === 'skills'   ? 'skills'   :
    activePanel?.type === 'resume'   ? 'resume'    :
    activePanel?.type === 'blog'     ? 'writings'  :
    null

  const [showHint, setShowHint] = useState(() => {
    if (typeof sessionStorage === 'undefined') return true
    return !sessionStorage.getItem('artifactsSeen')
  })
  const [showProjectsSheet, setShowProjectsSheet] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const openArtifact = useCallback(
    (key) => {
      if (!sessionStorage.getItem('artifactsSeen')) {
        sessionStorage.setItem('artifactsSeen', 'true')
        setShowHint(false)
      }
      setShowProjectsSheet(false)
      if (key === 'skills')    setActivePanel({ type: 'skills' })
      else if (key === 'resume')   setActivePanel({ type: 'resume' })
      else if (key === 'writings') setActivePanel({ type: 'blog' })
      else if (key === 'projects') {
        setActivePanel(null)
        setShowProjectsSheet(true)
      }
    },
    [setActivePanel]
  )

  const isMemoryOpen = activePanel?.type === 'memory'

  return (
    <>
      {/* First-visit hint */}
      <div style={{
        position: 'fixed',
        bottom: 148,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 8,
        letterSpacing: 3,
        color: 'rgba(255,255,255,0.3)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        animation: 'hintBreathe 2.5s ease-in-out infinite',
        opacity: (showHint && !isMemoryOpen) ? 1 : 0,
        transition: 'opacity 500ms ease-out',
        zIndex: 201,
      }}>
        ✦ TAP TO EXPLORE ✦
      </div>

      {/* Floating pill — 4 tabs */}
      <div style={{
        position: 'fixed',
        bottom: 86,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'row',
        gap: 0,
        background: 'rgba(5, 15, 30, 0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 40,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 5,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        opacity: isMemoryOpen ? 0 : 1,
        pointerEvents: isMemoryOpen ? 'none' : 'auto',
        transition: 'opacity 300ms ease',
      }}>
        {[
          { key: 'skills',    icon: '✦',  label: 'Skills'    },
          { key: 'resume',    icon: '◈',  label: 'Résumé'    },
          { key: 'writings',  icon: '✧',  label: 'Writings'  },
          { key: 'projects',  icon: '◇',  label: 'Vault'  },
        ].map((tab, i) => {
          const isActive = tab.key === activeArtifact || (tab.key === 'projects' && showProjectsSheet)
          return (
            <Fragment key={tab.key}>
              {i > 0 && (
                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.06)', alignSelf: 'center' }} />
              )}
              <button
                type="button"
                onClick={() => openArtifact(tab.key)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'none',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: 32,
                  color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 13 }}>{tab.icon}</span>
                <span style={{ fontSize: 7, letterSpacing: 2, fontFamily: 'inherit', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {tab.label}
                </span>
              </button>
            </Fragment>
          )
        })}
      </div>

      {/* Projects bottom sheet */}
      {showProjectsSheet && (
        <ProjectsSheet
          onClose={() => setShowProjectsSheet(false)}
          onSelectProject={(p) => { setShowProjectsSheet(false); setSelectedProject(p) }}
        />
      )}

      {/* Project detail modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
