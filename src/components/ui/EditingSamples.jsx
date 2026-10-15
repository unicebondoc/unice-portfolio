import { useEffect, useRef, useState } from 'react'

// Keep the original public edit on its publishing platform. Load a player only
// after a visitor asks, and remove it when hidden so sound cannot follow them.
export default function EditingSamples({ samples }) {
  const [active, setActive] = useState(null)
  const playerArea = useRef(null)
  const watchButtons = useRef({})
  useEffect(() => {
    if (!active) return
    const close = () => setActive(null)
    const onHidden = () => { if (document.hidden) close() }
    const onOtherPlay = event => {
      if (['VIDEO', 'AUDIO'].includes(event.target?.tagName)) close()
    }
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) close() })
    if (playerArea.current) observer.observe(playerArea.current)
    document.addEventListener('visibilitychange', onHidden)
    document.addEventListener('play', onOtherPlay, true)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onHidden)
      document.removeEventListener('play', onOtherPlay, true)
    }
  }, [active])
  const open = sample => {
    document.querySelectorAll('video, audio').forEach(media => media.pause())
    setActive(sample.id)
  }
  const close = () => {
    const previous = active
    setActive(null)
    requestAnimationFrame(() => watchButtons.current[previous]?.focus())
  }
  return <div className="pf-editing-samples">
    {samples.map(sample => <section className="pf-editing-sample" key={sample.id} aria-labelledby={`edit-${sample.id}`}>
      <p className="pf-stage">INDEPENDENT VIDEO EDIT · {sample.duration}</p>
      <h3 id={`edit-${sample.id}`}>{sample.title}</h3>
      <p>{sample.description}</p>
      {active === sample.id ? <div ref={playerArea} className="pf-external-player">
        <iframe title={`${sample.title} — original YouTube video`} src={`https://www.youtube-nocookie.com/embed/${sample.id}?autoplay=1&playsinline=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        <button type="button" className="pf-button" onClick={close}>Close video</button>
      </div> : <button ref={button => { watchButtons.current[sample.id] = button }} type="button" className="pf-button" onClick={() => open(sample)}>Watch {sample.shortTitle} <span aria-hidden>▶</span></button>}
      <a className="pf-original-video" href={sample.url} target="_blank" rel="noopener noreferrer">Open original on YouTube ↗</a>
    </section>)}
  </div>
}
