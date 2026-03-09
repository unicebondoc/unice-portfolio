/**
 * OrbPanel — centered memory viewer.
 * Fixed center, small circular glass panel. No scroll; content is clipped to fit.
 */
import { useRef, useState, useCallback, useEffect } from 'react'
import styles from './OrbPanel.module.css'

const IS_PHOTO = /\.(png|jpe?g|webp)$/i
/** Video orbs: larger circle. Non-video: smaller circle. */
const PANEL_SIZE_VIDEO = 'min(460px, 52vw)'
const PANEL_SIZE_DEFAULT = 'min(400px, 46vw)'

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [100, 180, 255]
}

const CATEGORY_SYMBOL = {
  career: '◆',
  achievement: '✧',
  education: '✧',
  life: '✦',
  project: '⬡',
  projects: '⬡',
  work: '❋',
  origin: '❋',
  turning_point: '❋',
  creator: '❋',
  skills: '❋',
  future: '❋',
  writing: '✒',
  operations: '◆',
  the_leap: '💫',
  ai_deployment: '🌱',
  masters: '✧',
  ai_portfolio: '⬡',
  present: '✦',
}
function getSymbolForCategory(category) {
  if (!category) return '❋'
  return CATEGORY_SYMBOL[category] ?? '❋'
}

export default function OrbPanel({
  memory,
  onClose,
  memories = [],
  closing = false,
  panelPos = null,
  mobile = false,
}) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const wrapRef = useRef(null)
  const panelRef = useRef(null)
  const [closingState, setClosingState] = useState(false)
  const [visible, setVisible] = useState(!!memory)
  const [revealed, setRevealed] = useState(false)
  const [displayMemory, setDisplayMemory] = useState(memory)
  const [contentOpacity, setContentOpacity] = useState(1)
  const [panelAnim, setPanelAnim] = useState({ scale: 0.05, opacity: 0, durationMs: 400 })
  const [dragY, setDragY] = useState(0)
  const dragStartY = useRef(0)
  const [sheetOffset, setSheetOffset] = useState(100)
  const lastPosRef = useRef(panelPos)
  const swapTimeoutRef = useRef(null)
  const videoBadgeRef = useRef(null)
  const videoInnerRef = useRef(null)
  const badgeVideoUnlockedRef = useRef(false)

  useEffect(() => {
    if (panelPos) lastPosRef.current = panelPos
  }, [panelPos])

  useEffect(() => {
    if (memory) {
      setVisible(true)
      if (mobile) {
        setSheetOffset(100)
        setPanelAnim({ scale: 1, opacity: 1, durationMs: 320 })
        requestAnimationFrame(() => setSheetOffset(0))
      } else {
        setPanelAnim({ scale: 0.05, opacity: 0, durationMs: 0 })
        requestAnimationFrame(() => setPanelAnim({ scale: 1, opacity: 1, durationMs: 400 }))
      }
      const isSameOrb = displayMemory?.id === memory.id
      if (isSameOrb || !displayMemory) {
        setRevealed(true)
        setDisplayMemory(memory)
        setContentOpacity(1)
        if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current)
        return
      }
      setRevealed(false)
      setContentOpacity(0)
      if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current)
      swapTimeoutRef.current = setTimeout(() => {
        setDisplayMemory(memory)
        setContentOpacity(1)
        badgeVideoUnlockedRef.current = false
        setTimeout(() => setRevealed(true), 50)
      }, 180)
      return () => {
        if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current)
      }
    } else {
      setVisible(false)
      setRevealed(false)
      setDisplayMemory(null)
      setContentOpacity(1)
      badgeVideoUnlockedRef.current = false
    }
  }, [memory?.id, mobile])

  // When switching to a different orb while panel is open:
  // shrink into old orb (200ms), then bloom at new orb (350ms).
  useEffect(() => {
    if (!memory) return
    const prev = displayMemory?.id
    const next = memory.id
    if (!prev || prev === next) return
    // shrink out (old position)
    setPanelAnim({ scale: 0.05, opacity: 0, durationMs: 200 })
    const t = setTimeout(() => {
      // bloom in at new position
      setPanelAnim({ scale: 0.05, opacity: 0, durationMs: 0 })
      requestAnimationFrame(() => setPanelAnim({ scale: 1, opacity: 1, durationMs: 350 }))
    }, 200)
    return () => clearTimeout(t)
  }, [memory?.id])

  useEffect(() => {
    if (memory && displayMemory?.id === memory.id) setDisplayMemory(memory)
  }, [memory, displayMemory?.id])

  /* When panel is revealed with a video, ensure both badge and inner clip play (and loop) */
  useEffect(() => {
    const current = displayMemory || memory
    if (!revealed || !current?.videoSrc) return
    const play = (el) => {
      if (el && typeof el.play === 'function') {
        el.muted = true
        el.play().catch(() => {})
      }
    }
    const t1 = setTimeout(() => { play(videoBadgeRef.current); play(videoInnerRef.current) }, 100)
    const t2 = setTimeout(() => { play(videoBadgeRef.current); play(videoInnerRef.current) }, 450)
    const t3 = setTimeout(() => { play(videoBadgeRef.current); play(videoInnerRef.current) }, 900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [revealed, memory, displayMemory])

  const handleClose = useCallback(() => {
    if (closingState) return
    if (mobile) setSheetOffset(100)
    setClosingState(true)
    onClose()
  }, [onClose, closingState, mobile])

  const handleMouseMove = useCallback((e) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const nx = (e.clientX - cx) / (rect.width / 2)
    const ny = (e.clientY - cy) / (rect.height / 2)
    setParallax({
      x: nx * 1.8,
      y: ny * 1.8,
    })
  }, [])

  const handleMouseLeave = useCallback(() => setParallax({ x: 0, y: 0 }), [])

  const handleTouchStart = useCallback((e) => {
    if (!mobile) return
    dragStartY.current = e.touches[0].clientY
  }, [mobile])
  const handleTouchMove = useCallback((e) => {
    if (!mobile) return
    const y = e.touches[0].clientY - dragStartY.current
    if (y > 0) setDragY(y)
  }, [mobile])
  const handleTouchEnd = useCallback(() => {
    if (!mobile) return
    if (dragY > 80) onClose()
    setDragY(0)
  }, [mobile, dragY, onClose])

  /** Unlock badge video on first user interaction with panel (browser requires play() in user gesture stack) */
  const handlePanelUserGesture = useCallback(() => {
    if (badgeVideoUnlockedRef.current) return
    const el = videoBadgeRef.current
    if (!el || !el.src) return
    badgeVideoUnlockedRef.current = true
    el.muted = true
    el.play().catch(() => {})
  }, [])

  /** Direct tap on badge: play() is in same call stack as user click — most reliable for autoplay policy */
  const handleBadgePlay = useCallback((e) => {
    e.stopPropagation()
    const el = videoBadgeRef.current
    if (!el) return
    el.muted = true
    el.play().catch(() => {})
    badgeVideoUnlockedRef.current = true
  }, [])

  if (!memory) return null

  const m = displayMemory || memory
  const isPhoto = IS_PHOTO.test(m.image ?? '')
  const tierLabel = m.tier ? String(m.tier).toUpperCase() : ''
  const emotionLabel = m.emotion ? String(m.emotion).toUpperCase().replace(/\s+/g, ' ') : ''
  const metaLine = (m.labelShort || m.year || [m.year, emotionLabel, tierLabel].filter(Boolean).join(' · ')).trim()
  const tagsLine = (m.tags || []).join(' · ')
  const hasTools = m.tags && m.tags.length > 0
  const links = m.links && m.links.length
    ? m.links
    : m.link
      ? [{ url: m.link, label: 'View Project' }]
      : []
  const hasExplore = links.length > 0
  const effectiveClosing = closing || closingState
  const [r, g, b] = hexToRgb(memory.color)
  const orbRgba = (a) => `rgba(${r},${g},${b},${a})`

  const desc = (m.description?.trim() ?? '')

  return (
    <div
      className={`${styles.anchor} ${mobile ? styles.anchorBottomSheet : styles.anchorCenter} ${visible ? (revealed ? styles.panelVisible : styles.panelEnter) : styles.panelEnter}`}
      style={{
        ['--panel-diameter']: m.videoSrc ? PANEL_SIZE_VIDEO : PANEL_SIZE_DEFAULT,
        ...(mobile
          ? {
              left: 0,
              right: 0,
              bottom: 0,
              top: 'auto',
              transform: `translateY(calc(${sheetOffset}% + ${dragY}px))`,
              transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
            }
          : {
              left: (panelPos?.[0] ?? lastPosRef.current?.[0] ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 400)) + 'px',
              top: (panelPos?.[1] ?? lastPosRef.current?.[1] ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 300)) + 'px',
            }),
      }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
        <div
        ref={wrapRef}
        className={styles.parallaxWrap}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: mobile ? `translateY(${dragY}px)` : `translate(${parallax.x}px, ${parallax.y}px) scale(${panelAnim.scale})`,
          opacity: panelAnim.opacity,
          transition: mobile && !dragY ? `transform 0.3s ease-out, opacity 0.3s ease-out` : `transform ${panelAnim.durationMs}ms cubic-bezier(0.34, 1.3, 0.64, 1), opacity ${panelAnim.durationMs}ms ease-out`,
        }}
      >
        <div className={styles.driftWrap}>
          <div
            ref={panelRef}
            className={`${styles.panel} ${mobile ? styles.panelBottomSheet : ''} ${effectiveClosing ? styles.panelClosing : ''} ${memory.isFuture ? styles.future : ''}`}
            style={{
              '--orb-r': r,
              '--orb-g': g,
              '--orb-b': b,
            }}
          >
            {mobile && (
              <>
                <div className={styles.bottomSheetHandle} aria-hidden />
                <button
                  type="button"
                  className={styles.bottomSheetClose}
                  onClick={handleClose}
                  aria-label="Close"
                >
                  ✕
                </button>
              </>
            )}
            <div
              className={styles.contentWrap}
              style={{
                opacity: contentOpacity,
                transition: contentOpacity === 1 ? 'opacity 250ms ease-out' : 'opacity 180ms ease-out',
                ...(m.videoSrc
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px 28px',
                      height: '100%',
                      overflow: 'hidden',
                      textAlign: 'center',
                    }
                  : {}),
              }}
              onPointerDown={handlePanelUserGesture}
              onClick={handlePanelUserGesture}
            >
            {/* Thumbnail badge: 48px circle top-right */}
            {/* Thumbnail badge: 48px circle top-right; profile orb gets vignette */}
            {(m.videoSrc || (isPhoto && m.image)) && (
              <div
                className={`${styles.thumbnailBadge} ${m.isRoot ? styles.thumbnailBadgeVignette : ''}`}
                title={m.videoSrc ? 'Tap to play video' : undefined}
              >
                {m.videoSrc ? (
                  <button
                    type="button"
                    className={styles.thumbnailBadgeBtn}
                    onClick={handleBadgePlay}
                    aria-label="Play video"
                  >
                    <video
                      ref={videoBadgeRef}
                      key={m.videoSrc}
                      className={styles.thumbnailMedia}
                      src={`${m.videoSrc}${m.videoSrc.includes('?') ? '&' : '?'}b=1`}
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onCanPlay={(e) => {
                        e.currentTarget.muted = true
                        e.currentTarget.play?.().catch?.(() => {})
                      }}
                      onLoadedData={(e) => {
                        e.currentTarget.muted = true
                        e.currentTarget.play?.().catch?.(() => {})
                      }}
                      onEnded={(e) => {
                        e.currentTarget.currentTime = 0
                        e.currentTarget.play?.().catch?.(() => {})
                      }}
                    />
                  </button>
                ) : (
                  <img className={styles.thumbnailMedia} src={m.image} alt="" draggable="false" />
                )}
              </div>
            )}

            <div
              className={styles.scroll}
              style={
                m.videoSrc
                  ? {
                      position: 'relative',
                      top: 'auto',
                      left: 'auto',
                      transform: 'none',
                      width: '100%',
                      maxHeight: 'none',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      minHeight: 0,
                    }
                  : {}
              }
            >
              <div key={m.id} className={styles.content}>
                <div
                  className={styles.panelSymbol}
                  style={{ color: orbRgba(1) }}
                >
                  <span className={styles.panelSymbolInner}>
                    {getSymbolForCategory(m.category)}
                  </span>
                </div>

                {m.videoSrc && (
                  <div
                    className={styles.panelVideoWrap}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      marginBottom: '14px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <video
                      ref={videoInnerRef}
                      key={m.videoSrc}
                      className={styles.panelVideo}
                      src={m.videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      disablePictureInPicture
                      style={{
                        width: '75%',
                        height: '150px',
                        objectFit: 'cover',
                        objectPosition: 'center 10%',
                        borderRadius: '16px',
                        display: 'block',
                        margin: '0 auto 12px auto',
                        flexShrink: 0,
                        background: 'transparent',
                      }}
                      onCanPlay={(e) => e.currentTarget.play?.().catch(() => {})}
                      onLoadedData={(e) => e.currentTarget.play?.().catch(() => {})}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <p className={styles.metaLine}>{metaLine}</p>
                <h2 className={styles.title}>{m.title}</h2>
                <p className={styles.subtitle}>{m.subtitle}</p>

                <p className={styles.desc}>{desc}</p>

                {tagsLine && !hasTools && <div className={styles.tags}>{tagsLine}</div>}

                {hasTools && (
                  <div className={styles.toolsWrap}>
                    <div className={styles.sectionLabel}>TOOLS</div>
                    <div className={styles.toolsContent}>{(m.tags || []).join(' · ')}</div>
                  </div>
                )}

                {hasExplore && (
                  <div className={styles.exploreWrap}>
                    <div className={styles.sectionLabel}>EXPLORE</div>
                    <div className={styles.exploreLinks}>
                      {links.map((item, i) => {
                        const url = typeof item === 'string' ? item : item.url
                        const label = typeof item === 'string' ? 'Open link' : (item.label || 'Open link')
                        return (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.exploreLink}
                          >
                            → {label}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}

                {m.link && !hasExplore && (
                  <div className={styles.ctaWrap}>
                    <a href={m.link} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                      View Project →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Refined hint: single line, low prominence */}
            <p className={styles.releaseHint}>click outside to close</p>
            </div>
          </div>
          {/* No exit button — close via outside click, ESC, or same orb */}
        </div>
      </div>
    </div>
  )
}
