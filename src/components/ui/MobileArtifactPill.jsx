/**
 * MobileArtifactPill — labeled floating pill nav for mobile only (Skills, Résumé, Writings).
 * Replaces icon-only artifact row. First-visit hint "✦ TAP TO EXPLORE ✦" fades on first tap.
 */
import { useState, useCallback } from 'react'
import useStore from '../../hooks/useStore'

export default function MobileArtifactPill() {
  const activePanel = useStore((s) => s.activePanel)
  const setActivePanel = useStore((s) => s.setActivePanel)

  const activeArtifact =
    activePanel?.type === 'skills'
      ? 'skills'
      : activePanel?.type === 'resume'
        ? 'resume'
        : activePanel?.type === 'blog'
          ? 'writings'
          : null

  const [showHint, setShowHint] = useState(() => {
    if (typeof sessionStorage === 'undefined') return true
    return !sessionStorage.getItem('artifactsSeen')
  })

  const openArtifact = useCallback(
    (key) => {
      if (!sessionStorage.getItem('artifactsSeen')) {
        sessionStorage.setItem('artifactsSeen', 'true')
        setShowHint(false)
      }
      if (key === 'skills') setActivePanel({ type: 'skills' })
      else if (key === 'resume') setActivePanel({ type: 'resume' })
      else if (key === 'writings') setActivePanel({ type: 'blog' })
    },
    [setActivePanel]
  )

  return (
    <>
      {/* First-visit hint — fades out on first pill tap */}
      <div
        style={{
          position: 'fixed',
          bottom: '130px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.3)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          animation: 'hintBreathe 2.5s ease-in-out infinite',
          opacity: showHint ? 1 : 0,
          transition: 'opacity 500ms ease-out',
          zIndex: 201,
        }}
      >
        ✦ TAP TO EXPLORE ✦
      </div>

      {/* Floating pill — mobile only */}
      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'row',
          gap: '0px',
          background: 'rgba(5, 15, 30, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '40px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '5px',
          boxShadow: `
    0 8px 32px rgba(0,0,0,0.5),
    0 0 0 1px rgba(0,200,255,0.05),
    inset 0 1px 0 rgba(255,255,255,0.05)
  `,
        }}
      >
        <button
          type="button"
          onClick={() => openArtifact('skills')}
          style={{
            background: activeArtifact === 'skills' ? 'rgba(255,255,255,0.08)' : 'none',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '32px',
            color: activeArtifact === 'skills' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '13px' }}>✦</span>
          <span
            style={{
              fontSize: '7px',
              letterSpacing: '2px',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Skills
          </span>
        </button>

        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'rgba(255,255,255,0.06)',
            alignSelf: 'center',
          }}
        />

        <button
          type="button"
          onClick={() => openArtifact('resume')}
          style={{
            background: activeArtifact === 'resume' ? 'rgba(255,255,255,0.08)' : 'none',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '32px',
            color: activeArtifact === 'resume' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '13px' }}>◈</span>
          <span
            style={{
              fontSize: '7px',
              letterSpacing: '2px',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Résumé
          </span>
        </button>

        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'rgba(255,255,255,0.06)',
            alignSelf: 'center',
          }}
        />

        <button
          type="button"
          onClick={() => openArtifact('writings')}
          style={{
            background: activeArtifact === 'writings' ? 'rgba(255,255,255,0.08)' : 'none',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '32px',
            color: activeArtifact === 'writings' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '13px' }}>✧</span>
          <span
            style={{
              fontSize: '7px',
              letterSpacing: '2px',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Writings
          </span>
        </button>
      </div>
    </>
  )
}
