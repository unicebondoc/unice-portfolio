import { useEffect, useId, useRef, useState } from 'react'
import '../../styles/project-demo.css'

// Capture native controls as well as our buttons, including the journey videos.
// Orb textures are detached video elements, so their silent previews are separate.
function pauseOtherMedia(event) {
  const current = event.target
  if (!['VIDEO', 'AUDIO'].includes(current?.tagName)) return
  document.querySelectorAll('video, audio').forEach(media => {
    if (media !== current && !media.paused) media.pause()
  })
}

let playbackGuardUsers = 0
function retainPlaybackGuard() {
  if (playbackGuardUsers === 0) document.addEventListener('play', pauseOtherMedia, true)
  playbackGuardUsers += 1
  return () => {
    playbackGuardUsers -= 1
    if (playbackGuardUsers === 0) document.removeEventListener('play', pauseOtherMedia, true)
  }
}

function readableDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return ''
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function useUserStartedMedia(src, withAudio, mediaKind = 'recording') {
  const mediaRef = useRef(null)
  const playbackAreaRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [duration, setDuration] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const media = mediaRef.current
    const releasePlaybackGuard = retainPlaybackGuard()
    setPlaying(false)
    setEnded(false)
    setDuration('')
    setError('')
    const onPlay = () => { setPlaying(true); setEnded(false); setError('') }
    const onPause = () => { setPlaying(false); setEnded(media.ended) }
    const onEnded = () => { setPlaying(false); setEnded(true) }
    const onSeeked = () => setEnded(media.ended)
    const onDuration = () => setDuration(readableDuration(media.duration))
    const onError = () => {
      setPlaying(false)
      setError(`This ${mediaKind} could not load here. You can open the media file directly below.`)
    }
    const onHidden = () => { if (document.hidden) media.pause() }
    const listeners = { play: onPlay, pause: onPause, ended: onEnded, seeked: onSeeked, loadedmetadata: onDuration, durationchange: onDuration, error: onError }
    Object.entries(listeners).forEach(([name, handler]) => media.addEventListener(name, handler))
    document.addEventListener('visibilitychange', onHidden)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) media.pause()
    })
    // The explicit sound button remains usable when the video is just above it.
    observer?.observe(playbackAreaRef.current || media)
    onHidden()
    return () => {
      media.pause()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onHidden)
      Object.entries(listeners).forEach(([name, handler]) => media.removeEventListener(name, handler))
      releasePlaybackGuard()
    }
  }, [src, mediaKind])

  const togglePlayback = () => {
    const media = mediaRef.current
    if (!media) return
    if (!media.paused && !media.ended) { media.pause(); return }
    if (media.ended) media.currentTime = 0
    if (withAudio) media.muted = false
    if (media.error) media.load()
    setError('')
    // Invoke play synchronously inside the click gesture for mobile browsers.
    const attempt = media.play()
    attempt?.catch(reason => {
      if (reason.name === 'AbortError' || mediaRef.current !== media) return
      setPlaying(false)
      setError('Playback did not start. Try the native Play control, or open the media file directly below.')
    })
  }

  return { mediaRef, playbackAreaRef, playing, ended, duration, error, togglePlayback }
}

function Transcript({ lines, audio = false }) {
  if (!Array.isArray(lines) || !lines.length) return null
  return <details className="pd-transcript"><summary>Read {audio ? 'audio ' : ''}transcript</summary><div>{lines.map((line, index) => <p key={index}>{line}</p>)}</div></details>
}

function Credits({ credits, label, attribution }) {
  const links = credits ? (Array.isArray(credits) ? credits : [credits]) : []
  const notes = attribution ? (Array.isArray(attribution) ? attribution : [attribution]) : []
  if (!links.length && !notes.length) return null
  return <div className="pd-credits">{notes.map((note, index) => <p key={index}>{note}</p>)}{links.map((item, index) => {
    const href = typeof item === 'string' ? item : item.href || item.url
    if (!href) return null
    return <a key={`${href}-${index}`} href={href} target="_blank" rel="noopener noreferrer">{(typeof item === 'object' && (item.label || item.title)) || label || 'Full credits and acknowledgements'} <span aria-hidden="true">↗</span></a>
  })}</div>
}

function Disclosure({ text }) {
  if (!text) return null
  return <div className="pd-disclosure">{(Array.isArray(text) ? text : [text]).map((line, index) => <p key={index}>{line}</p>)}</div>
}

function PlaybackError({ message, src, title, audio = false }) {
  if (!message) return null
  return <div className="pd-error" role="status"><p>{message}</p><a href={src} target="_blank" rel="noopener noreferrer">Open {title} {audio ? 'audio' : 'video'} file <span aria-hidden="true">↗</span></a></div>
}

function captionTracks(captions) {
  const items = captions ? (Array.isArray(captions) ? captions : [captions]) : []
  return items.map(track => typeof track === 'string' ? { src: track } : track).filter(track => track?.src)
}

export default function ProjectDemo({ demo, title, poster, variant = 'demo' }) {
  const captionId = useId()
  const isMemory = variant === 'memory'
  const { mediaRef, playbackAreaRef, playing, ended, duration, error, togglePlayback } = useUserStartedMedia(demo.src, Boolean(demo.hasAudio), isMemory ? 'story video' : 'recording')
  const tracks = captionTracks(demo.captions)
  const action = isMemory ? `${playing ? 'Pause' : ended ? 'Replay' : 'Play'} ${title} memory` : playing ? `Pause ${title} demo` : `${ended ? 'Replay' : 'Play'} ${title} ${demo.hasAudio ? 'demo with sound' : 'silent demo'}`
  const soundStatus = isMemory ? `Memory video${demo.hasAudio ? ' · Sound available' : ''}` : demo.hasAudio ? 'Sound available' : 'Silent recording'
  return <figure className={`pd-demo${isMemory ? ' pd-memory' : ''}`}>
    <div ref={playbackAreaRef} className="pd-playback-area">
    <div className="pd-video-frame"><video key={demo.src} ref={mediaRef} src={demo.src} poster={demo.poster || poster} controls playsInline preload={isMemory ? 'metadata' : 'none'} aria-label={`${title} ${isMemory ? 'story video' : 'demo'}`} aria-describedby={demo.caption ? captionId : undefined}>{tracks.map((track, index) => <track key={track.src} kind={track.kind || 'captions'} src={track.src} srcLang={track.srclang || track.srcLang || track.language || 'en'} label={track.label || 'English'} default={index === 0} />)}</video></div>
    <div className="pd-toolbar"><button type="button" className="pd-play-button" onClick={togglePlayback}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>{action}</button><span className="pd-media-status">{soundStatus}{duration && ` · ${duration}`}</span></div>
    </div>
    {demo.caption && <figcaption id={captionId}>{demo.caption}</figcaption>}
    <Disclosure text={demo.disclosure} />
    <PlaybackError message={error} src={demo.src} title={title} />
    <Transcript lines={demo.transcript} />
    <Credits credits={demo.credits} label={demo.creditsLabel} />
  </figure>
}

export function AudioEdition({ audio, title }) {
  const captionId = useId()
  const { mediaRef, playbackAreaRef, playing, ended, duration, error, togglePlayback } = useUserStartedMedia(audio.src, true)
  const action = `${playing ? 'Pause' : ended ? 'Replay' : 'Play'} ${title} audio excerpt`
  return <section className="pd-audio-edition" aria-label={`${title} audio edition`}>
    <p className="pd-edition-label">SEPARATE AUDIO EDITION</p>
    <h3>{audio.title || `${title} · Audio excerpt`}</h3>
    <div ref={playbackAreaRef} className="pd-playback-area">
    <audio key={audio.src} ref={mediaRef} src={audio.src} controls preload="none" aria-label={`${title} audio excerpt`} aria-describedby={audio.caption ? captionId : undefined} />
    <div className="pd-toolbar"><button type="button" className="pd-play-button" onClick={togglePlayback}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>{action}</button><span className="pd-media-status">Audio excerpt{duration && ` · ${duration}`}</span></div>
    </div>
    {audio.caption && <p id={captionId} className="pd-audio-caption">{audio.caption}</p>}
    <Disclosure text={audio.disclosure} />
    <PlaybackError message={error} src={audio.src} title={title} audio />
    <Transcript lines={audio.transcript} audio />
    <Credits credits={audio.credits} attribution={audio.attribution} />
  </section>
}
