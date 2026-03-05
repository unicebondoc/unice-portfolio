/**
 * Sound config — single place to swap audio files.
 * Placeholder paths; replace with your assets.
 */
export const SOUND_CONFIG = {
  ambient: '/audio/forest-ambient.mp3',
  orbHover: '/audio/orb-hover.mp3',
  orbOpen: '/audio/orb-open.mp3',
  orbClose: '/audio/orb-close.mp3',
  navHover: '/audio/nav-hover.mp3',
  tycheClick: '/audio/tyche-click.mp3',
  chatSend: '/audio/chat-send.mp3',
  chatReceive: '/audio/chat-receive.mp3',
}

const AMBIENT_VOLUME = 0.15
const MASTER_VOLUME = 1
const FADE_IN_AMBIENT_MS = 3000
const FADE_IN_AMBIENT_WHEN_TOGGLED_MS = 2000
const FADE_OUT_MS = 1000

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

const SoundContext = createContext(null)

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) return null
  return ctx
}

function createAudioContext() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || window.webkitAudioContext)()
}

export function SoundProvider({ children }) {
  const [muted, setMutedState] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const ctxRef = useRef(null)
  const masterGainRef = useRef(null)
  const ambientGainRef = useRef(null)
  const ambientSourceRef = useRef(null)
  const buffersRef = useRef({})
  const ambientAudioRef = useRef(null)

  const unlock = useCallback(() => {
    if (ctxRef.current) return
    const ctx = createAudioContext()
    if (!ctx) return
    ctxRef.current = ctx
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    const master = ctx.createGain()
    master.gain.value = muted ? 0 : MASTER_VOLUME
    master.connect(ctx.destination)
    masterGainRef.current = master
    const ambientGain = ctx.createGain()
    ambientGain.gain.value = 0
    ambientGain.connect(master)
    ambientGainRef.current = ambientGain
    setUnlocked(true)
  }, [muted])

  const preload = useCallback(async () => {
    const ctx = ctxRef.current
    if (!ctx || !unlocked) return
    const keys = ['orbHover', 'orbOpen', 'orbClose', 'navHover', 'tycheClick', 'chatSend', 'chatReceive']
    for (const key of keys) {
      if (buffersRef.current[key]) continue
      const url = SOUND_CONFIG[key]
      if (!url) continue
      try {
        const res = await fetch(url)
        const buf = await res.arrayBuffer()
        const decoded = await ctx.decodeAudioData(buf)
        buffersRef.current[key] = decoded
      } catch {
        // Placeholder missing or decode error — skip
      }
    }
  }, [unlocked])

  const play = useCallback((key, volume = 1) => {
    if (muted) return
    const ctx = ctxRef.current
    const buf = buffersRef.current[key]
    if (!ctx || !buf) return
    const src = ctx.createBufferSource()
    src.buffer = buf
    const gain = ctx.createGain()
    gain.gain.value = volume * MASTER_VOLUME
    gain.connect(masterGainRef.current)
    src.connect(gain)
    src.start(0)
    src.onended = () => {
      try { gain.disconnect() } catch {}
    }
  }, [muted])

  const startAmbient = useCallback(() => {
    if (!unlocked || !ctxRef.current || !ambientGainRef.current) return
    const ctx = ctxRef.current
    if (ambientSourceRef.current) return
    const url = SOUND_CONFIG.ambient
    if (!url) return
    const audio = new Audio(url)
    audio.loop = true
    audio.crossOrigin = 'anonymous'
    ambientAudioRef.current = audio
    const source = ctx.createMediaElementSource(audio)
    source.connect(ambientGainRef.current)
    ambientSourceRef.current = source
    audio.play().catch(() => {})
    const gain = ambientGainRef.current
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(AMBIENT_VOLUME, ctx.currentTime + FADE_IN_AMBIENT_WHEN_TOGGLED_MS / 1000)
  }, [unlocked])

  const stopAmbient = useCallback(() => {
    const ctx = ctxRef.current
    const gain = ambientGainRef.current
    const audio = ambientAudioRef.current
    if (!ctx || !gain || !audio) return
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT_MS / 1000)
    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, FADE_OUT_MS)
    ambientSourceRef.current = null
    ambientAudioRef.current = null
  }, [])

  const setMuted = useCallback((value) => {
    const next = !!value
    setMutedState(next)
    if (!unlocked) return
    const master = masterGainRef.current
    const ctx = ctxRef.current
    if (!master || !ctx) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    if (next) {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT_MS / 1000)
      stopAmbient()
    } else {
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + FADE_IN_AMBIENT_WHEN_TOGGLED_MS / 1000)
      startAmbient()
    }
  }, [unlocked, startAmbient, stopAmbient])

  const toggleMuted = useCallback(() => setMuted(!muted), [muted, setMuted])

  // When user first enables sound, unlock may complete after setMuted; start ambient once unlocked
  useEffect(() => {
    if (unlocked && !muted && ctxRef.current && masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(MASTER_VOLUME, ctxRef.current.currentTime)
      startAmbient()
    }
  }, [unlocked, muted, startAmbient])

  useEffect(() => {
    if (!unlocked) return
    preload()
  }, [unlocked, preload])

  // Unlock and preload on first user interaction anywhere (respects autoplay)
  useEffect(() => {
    const onInteraction = () => {
      unlock()
    }
    document.addEventListener('click', onInteraction, { once: true })
    document.addEventListener('touchstart', onInteraction, { once: true })
    return () => {
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('touchstart', onInteraction)
    }
  }, [unlock])

  const value = {
    muted,
    setMuted,
    toggleMuted,
    unlock,
    play,
    unlocked,
  }

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  )
}

export default SoundContext
