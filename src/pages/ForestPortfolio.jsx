import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { PROJECTS } from '../data/projects.js'
import { MEMORIES } from '../data/memories.js'
import { PORTFOLIO_DATA } from '../../lib/portfolioData.js'
import { FOREST_NODES } from '../data/forestNodes.js'
import { forestTarget, resolveForestLocation, forestNodeForReference } from '../data/forestNavigation.js'
import useStore from '../hooks/useStore.js'
import ProjectDemo, { AudioEdition } from '../components/ui/ProjectDemo.jsx'
import AnimatedTyche from '../components/ui/AnimatedTyche.jsx'
import '../styles/forest-portfolio.css'

const ForestScene = lazy(() => import('../components/scene/PortfolioForestScene.jsx'))
const ChatBot = lazy(() => import('../components/ui/ChatBot.jsx'))
const CV_MAIN = '/resume/Unice_Bondoc_Resume.pdf'
const CV_SOFTWARE = '/resume/Unice_Bondoc_CV_Software_Development.pdf'
const JOURNAL_NAMES = { work: 'The work', journey: 'The story at the roots', experience: 'Experience', about: 'A curious mind', writing: 'Notes from the build', cv: 'The CV', contact: 'Let’s make something useful' }
const NAVIGATION = [['work', 'Work'], ['journey', 'My journey'], ['experience', 'Experience'], ['about', 'About'], ['writing', 'Writing']]

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

function MotionPreference({ reducedMotion, prefersReducedMotion, onToggle, descriptionId }) {
  return <div className="pf-motion-preference">
    <button type="button" className="pf-motion-switch" role="switch" aria-checked={!reducedMotion} aria-describedby={descriptionId} disabled={prefersReducedMotion} onClick={onToggle}>
      <span>Motion effects</span><span className="pf-switch-track" aria-hidden><span /></span>
    </button>
    <p id={descriptionId}>{prefersReducedMotion ? 'Reduced by your device preference.' : 'Gentle movement in the forest.'}</p>
  </div>
}

function ContactLinks() {
  return <div className="pf-contact-links"><a href="mailto:uniceabondoc@gmail.com">Email Unice ↗</a><a href="https://www.linkedin.com/in/unicebondoc/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/unicebondoc" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://onqst.com/" target="_blank" rel="noopener noreferrer">ONQST ↗</a></div>
}

function LoopPreview({ src, poster, label, reducedMotion }) {
  const videoRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current
    let visible = false
    const update = () => {
      if (visible && !reducedMotion && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }, { threshold: 0.25 })
    observer.observe(video)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); video.pause() }
  }, [src, reducedMotion])
  return <video ref={videoRef} src={src} poster={poster} muted loop playsInline controls preload="none" aria-label={label} />
}

function ProjectCase({ project, navigate, reducedMotion }) {
  return <article className="pf-case" id={`project-${project.id}`} style={{ '--pf-memory-color': project.color }}>
    <p className="pf-stage"><span aria-hidden>◈</span>{project.subtitle}</p>
    <p className="pf-case-purpose">{project.description}</p>
    {project.demo ? <ProjectDemo demo={project.demo} title={project.title} poster={project.image} /> : project.image && <figure className={`pf-case-image pf-case-image-${project.video ? 'video' : project.imageKind || 'wide'}`} >{project.video ? <LoopPreview src={project.video} poster={project.image} label={`${project.title} actual project recording`} reducedMotion={reducedMotion} /> : <a href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} image`}><img src={project.image} alt={project.imageAlt} width="680" height="430" /></a>}<figcaption>{(project.video ? project.videoCaption : project.imageCaption) || 'Project image'}</figcaption></figure>}
    <div className="pf-contribution"><p className="pf-eyebrow">MY CONTRIBUTION</p><p>{project.caseStudy.contribution}</p></div>
    <dl className="pf-case-facts"><div><dt>The problem</dt><dd>{project.caseStudy.challenge}</dd></div><div><dt>A decision that mattered</dt><dd>{project.caseStudy.decision}</dd></div><div><dt>Evidence</dt><dd>{project.caseStudy.evidence}</dd></div><div><dt>Where it stands</dt><dd>{project.caseStudy.result}</dd></div></dl>
    {project.secondaryImage && <figure className="pf-case-image"><img src={project.secondaryImage} alt="Princess of Alemio separate audio edition" width="680" height="430" /><figcaption>Audio is a separate edition from the visual novel</figcaption></figure>}
    {project.audioPreview && <AudioEdition audio={project.audioPreview} title={project.title} />}
    <ul className="pf-technologies" aria-label="Tools and technologies">{project.stack.map(item => <li key={item}>{item}</li>)}</ul>
    <div className="pf-case-actions">{project.links.live && <a className="pf-button" href={project.links.live} target="_blank" rel="noopener noreferrer">{project.linkLabel || (project.id === 'landlit' ? 'Explore fictional demo' : 'Explore the project')} ↗</a>}{project.links.github && <a className="pf-button" href={project.links.github} target="_blank" rel="noopener noreferrer">Team repository ↗</a>}<a href={forestTarget({ kind: 'work' })} onClick={event => { event.preventDefault(); navigate({ kind: 'work' }) }}>All work</a></div>
  </article>
}

function WorkIndex({ navigate }) {
  const selected = PROJECTS.filter(item => ['experience', 'featured', 'interactive'].includes(item.group))
  return <div><p className="pf-journal-lede">Applications, connected workflows and stories you can step inside. Each case explains what I contributed and where the work stands.</p><div className="pf-work-index">{selected.map((project, index) => <a href={forestTarget({ kind: 'project', id: project.id })} onClick={event => { event.preventDefault(); navigate({ kind: 'project', id: project.id }) }} className="pf-work-entry" key={project.id} style={{ '--pf-memory-color': project.color }}><span className="pf-entry-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{project.title}</strong><small>{project.subtitle}</small><p>{project.description}</p></span><span className="pf-entry-arrow" aria-hidden>↗</span></a>)}</div><p className="pf-eyebrow pf-support-heading">OTHER THREADS</p><div className="pf-other-work">{PROJECTS.filter(item => ['support', 'forest'].includes(item.group)).map(project => <a key={project.id} href={forestTarget({ kind: 'project', id: project.id })} onClick={event => { event.preventDefault(); navigate({ kind: 'project', id: project.id }) }}><strong>{project.id === 'core-memories' ? 'How this forest was built' : project.title}</strong><small>{project.subtitle}</small><span aria-hidden>↗</span></a>)}</div></div>
}

function Journey({ initialChapter, reducedMotion }) {
  const [chapter, setChapter] = useState(() => MEMORIES.find(item => item.id === initialChapter) || MEMORIES.find(item => item.id === 'orb-root'))
  useEffect(() => { if (initialChapter) { const match = MEMORIES.find(item => item.id === initialChapter); if (match) setChapter(match) } }, [initialChapter])
  return <div className="pf-journey"><p className="pf-journal-lede">The same curiosity runs through all of it: story, a change of country, learning to test an idea, and the worlds I’m building now.</p><div className="pf-chapter-list" aria-label="Career chapters">{MEMORIES.map(memory => <button type="button" key={memory.id} aria-pressed={memory.id === chapter.id} onClick={() => setChapter(memory)} style={{ '--pf-memory-color': memory.color }}><span aria-hidden>◈</span><small>{memory.year}</small><span>{memory.id === 'orb-root' ? 'Here, now' : memory.labelShort.replace(/^.*? · /, '')}</span></button>)}</div><article className="pf-chapter" key={chapter.id}><p className="pf-stage">{chapter.subtitle}</p><h3>{chapter.title}</h3>{chapter.id === 'orb-root' ? <figure className="pf-now-portrait"><div className="pf-now-portrait-frame"><img src="/profile-unice-approved.webp" alt="Unice Bondoc wearing her taupe blazer, pearl earrings and diamond pendant" width="768" height="768" /></div><figcaption>Unice Bondoc · Founder of ONQST</figcaption></figure> : chapter.imageSrc ? <figure className="pf-chapter-photo"><a href={chapter.imageSrc} target="_blank" rel="noopener noreferrer" aria-label="Open the graduation photograph"><img src={chapter.imageSrc} alt={chapter.imageAlt} /></a><figcaption>{chapter.imageCaption}</figcaption></figure> : chapter.videoSrc && <ProjectDemo key={chapter.videoSrc} variant="memory" title={chapter.labelShort.replace(/^.*? · /, '')} demo={{ src: chapter.videoSrc, poster: chapter.videoPoster, caption: chapter.videoCaption, hasAudio: false }} />}<p>{chapter.description}</p><ul className="pf-technologies">{chapter.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></article></div>
}

function Experience({ navigate }) {
  return <div><p className="pf-journal-lede">Team delivery, product direction and software work—with the role and contribution made clear.</p><div className="pf-experience">{PORTFOLIO_DATA.experience.slice(0, 3).map(role => <article key={role.company}><p className="pf-stage">{role.dates}{role.type === 'Internship' ? ' · Internship' : ''}</p><h3>{role.title}</h3><p className="pf-role-company">{role.company}</p><ul>{role.highlights.map(text => <li key={text}>{text}</li>)}</ul>{role.company.includes('ACS') && <button className="pf-inline-link" type="button" onClick={() => navigate({ kind: 'project', id: 'causeconnect' })}>See my CauseConnect contribution ↗</button>}</article>)}</div><details className="pf-earlier"><summary>Earlier experience · RCBC</summary><p>SME Account & Loan Operations Manager · September 2019–September 2022.</p><p>{PORTFOLIO_DATA.experience[3].highlights[0]}</p></details></div>
}

function About({ navigate }) {
  return <div><div className="pf-about-identity"><img src="/profile-unice-approved.webp" alt="Unice Bondoc" width="768" height="768" /><div><p className="pf-eyebrow">UNICE BONDOC · SYDNEY</p><h3>Software, with a sense of wonder.</h3><p>Software Developer · AI Automation, Apps & Games<br />Founder of ONQST</p></div></div><p className="pf-journal-lede">{PORTFOLIO_DATA.identity.summary}</p><p>I like making complex things feel clear, useful and a little unexpected. My background in communication helps me connect the experience people see with the systems underneath.</p><div className="pf-education">{PORTFOLIO_DATA.education.map(item => <article key={item.qualification}><h3>{item.qualification}</h3><p>{item.institution} · {item.dates || item.status}</p>{item.research && <p>{item.research}</p>}</article>)}</div><button type="button" className="pf-inline-link" onClick={() => navigate({ kind: 'project', id: 'core-memories' })}>How this forest was built ↗</button><ContactLinks /></div>
}

function Writing() {
  return <div><p className="pf-journal-lede">Notes on making software feel like somewhere you can go.</p><a className="pf-writing-entry" href="https://medium.com/@unicebondoc/i-made-a-forest-because-i-didnt-know-how-else-to-tell-you-who-i-am-24282209e85a" target="_blank" rel="noopener noreferrer"><small>10 MARCH 2026 · MEDIUM</small><h3>I Didn’t Build a Portfolio.<br />I Built a Place.</h3><p>The story behind Core Memories and exploring a portfolio through an interactive world.</p><span>Read the story ↗</span></a><a className="pf-inline-link" href="https://medium.com/@unicebondoc" target="_blank" rel="noopener noreferrer">More writing on Medium ↗</a></div>
}

function CV() {
  return <div><p className="pf-journal-lede">Two focused versions, each two pages. ACS team experience, ONQST and the UNIKRE Software Engineer internship lead the story.</p><div className="pf-cv-choices">{[[CV_MAIN, 'Automation & systems', 'Workflow, implementation and business systems roles'], [CV_SOFTWARE, 'Software development', 'Applications and interactive product roles']].map(([href, title, description]) => <article key={href}><p className="pf-eyebrow">PDF · TWO PAGES</p><h3>{title}</h3><p>{description}</p><div><a className="pf-button" href={href} target="_blank" rel="noopener noreferrer">Open CV ↗</a><a href={href} download>Download ↓</a></div></article>)}</div><p className="pf-cv-note">View or download directly. Your place in the forest stays here.</p><ContactLinks /></div>
}

function Journal({ panel, navigate, onClose, reducedMotion }) {
  const journalRef = useRef(null)
  const headingRef = useRef(null)
  const scrollRef = useRef(null)
  const project = panel.kind === 'project' ? PROJECTS.find(item => item.id === panel.id) : null
  const title = project?.title || JOURNAL_NAMES[panel.kind] || 'Field journal'
  useEffect(() => {
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      if (event.key !== 'Tab') return
      const items = [...journalRef.current.querySelectorAll('button, a[href], summary, video, audio, [tabindex="0"]')].filter(element => !element.disabled && element.getClientRects().length)
      const first = items[0], last = items.at(-1)
      if (event.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [onClose])
  useEffect(() => { scrollRef.current.scrollTop = 0; journalRef.current.scrollTop = 0; headingRef.current?.focus({ preventScroll: true }) }, [panel.kind, panel.id])
  return <div className="pf-journal-layer"><button type="button" className="pf-journal-backdrop" aria-label="Close journal and return to the forest" tabIndex={-1} onClick={onClose} /><section ref={journalRef} className="pf-journal" role="dialog" aria-modal="true" aria-labelledby="pf-journal-title" style={{ '--pf-memory-color': project?.color || '#b9e6db' }}><header className="pf-journal-header"><div><p className="pf-eyebrow">THE FIELD JOURNAL <span aria-hidden>/</span> {project ? 'PROJECT MEMORY' : 'UNICE’S WORLD'}</p><h2 id="pf-journal-title" ref={headingRef} tabIndex={-1}>{title}</h2></div><button type="button" className="pf-journal-close" aria-label="Close journal" onClick={onClose}><span aria-hidden>×</span></button></header><nav className="pf-journal-tabs" aria-label="Journal sections">{[['work', 'Work'], ['journey', 'Journey'], ['experience', 'Experience'], ['cv', 'CV']].map(([kind, label]) => <button key={kind} type="button" aria-current={panel.kind === kind || (kind === 'work' && panel.kind === 'project') ? 'page' : undefined} onClick={() => navigate({ kind })}>{label}</button>)}</nav><div className="pf-journal-scroll" ref={scrollRef}>{project ? <ProjectCase project={project} navigate={navigate} reducedMotion={reducedMotion} /> : panel.kind === 'work' ? <WorkIndex navigate={navigate} /> : panel.kind === 'journey' ? <Journey initialChapter={panel.chapter} reducedMotion={reducedMotion} /> : panel.kind === 'experience' ? <Experience navigate={navigate} /> : panel.kind === 'about' ? <About navigate={navigate} /> : panel.kind === 'writing' ? <Writing /> : panel.kind === 'cv' ? <CV /> : <><p className="pf-journal-lede">Software development, AI automation and systems implementation · Sydney.</p><ContactLinks /></>}</div><footer className="pf-journal-foot"><span aria-hidden>✧</span><span>The forest stays with you.</span><button type="button" onClick={onClose}>Return to the world ↙</button></footer></section></div>
}

export default function ForestPortfolio() {
  const [panel, setPanel] = useState(() => resolveForestLocation(window.location))
  const [ready, setReady] = useState(false)
  const [graphicsError, setGraphicsError] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [displayOpen, setDisplayOpen] = useState(false)
  const [seen, setSeen] = useState([])
  const [guideOpened, setGuideOpened] = useState(false)
  const triggerRef = useRef(null)
  const worldRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [motionPaused, setMotionPaused] = useState(false)
  const reducedMotion = prefersReducedMotion || motionPaused
  const activePanel = useStore(state => state.activePanel)
  const setActivePanel = useStore(state => state.setActivePanel)
  const setViewport = useStore(state => state.setViewport)
  const setLoadingExited = useStore(state => state.setLoadingExited)
  const pulsingOrbs = useStore(state => state.pulsingOrbs)
  const pulseId = Object.keys(pulsingOrbs).map(forestNodeForReference).filter(Boolean).at(-1) || null
  const chatOpen = activePanel?.type === 'chat'
  const navigate = useCallback(next => {
    if (!panel) triggerRef.current = document.activeElement
    const url = forestTarget(next)
    if (location.pathname + location.hash !== url) history.pushState(null, '', url)
    setMenuOpen(false)
    setDisplayOpen(false)
    setActivePanel(null)
    setPanel(next)
    if (next?.kind === 'project' && FOREST_NODES.some(node => node.id === next.id)) setSeen(previous => previous.includes(next.id) ? previous : [...previous, next.id])
  }, [panel, setActivePanel])
  const closeJournal = useCallback(() => {
    history.pushState(null, '', '/#world')
    setPanel(null)
    requestAnimationFrame(() => { if (triggerRef.current?.isConnected && triggerRef.current.getClientRects().length) triggerRef.current.focus(); else worldRef.current?.querySelector('a')?.focus() })
  }, [])
  const selectNode = useCallback(id => navigate(id === 'journey' ? { kind: 'journey' } : { kind: 'project', id }), [navigate])
  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(error => { setGraphicsError(error?.message || "Graphics unavailable"); setReady(true) }, [])
  useEffect(() => {
    document.documentElement.classList.add('pf-document')
    document.body.classList.add('pf-document')
    setLoadingExited(true)
    const viewport = () => setViewport(1, matchMedia('(max-width: 700px)').matches)
    viewport()
    window.addEventListener('resize', viewport)
    const route = () => { setActivePanel(null); setPanel(resolveForestLocation(window.location)); setMenuOpen(false); setDisplayOpen(false) }
    window.addEventListener('popstate', route)
    window.addEventListener('hashchange', route)
    return () => { document.documentElement.classList.remove('pf-document'); document.body.classList.remove('pf-document'); window.removeEventListener('resize', viewport); window.removeEventListener('popstate', route); window.removeEventListener('hashchange', route) }
  }, [setLoadingExited, setActivePanel, setViewport])
  useEffect(() => {
    if (!chatOpen && !menuOpen && !displayOpen) return
    const close = event => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setDisplayOpen(false)
      setActivePanel(null)
      worldRef.current?.querySelector(chatOpen ? '.pf-tyche' : displayOpen ? '.pf-display-toggle' : '.pf-menu-toggle')?.focus()
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [chatOpen, menuOpen, displayOpen, setActivePanel])
  useEffect(() => {
    if (!menuOpen && !displayOpen) return
    const closeOutside = event => {
      if (event.target instanceof Element && event.target.closest('.pf-header-tools')) return
      setMenuOpen(false)
      setDisplayOpen(false)
    }
    window.addEventListener('pointerdown', closeOutside)
    return () => window.removeEventListener('pointerdown', closeOutside)
  }, [menuOpen, displayOpen])
  const selectedId = panel?.kind === 'project' ? (FOREST_NODES.some(node => node.id === panel.id) ? panel.id : null) : panel?.kind === 'journey' ? 'journey' : null
  return <div className={`pf-portfolio ${panel ? 'pf-journal-open' : ''} ${ready ? 'pf-world-ready' : ''} ${reducedMotion ? 'pf-motion-paused' : ''}`} data-graphics-error={graphicsError || undefined}>
    <div className="pf-world-layer" aria-hidden={panel ? true : undefined} inert={panel ? true : undefined} ref={worldRef}>
      <div className="pf-world-backdrop" aria-hidden />
      <div className="pf-canvas-layer"><Suspense fallback={null}><ForestScene nodes={FOREST_NODES} journalOpen={Boolean(panel)} selectedId={selectedId} pulseId={pulseId} onSelect={selectNode} reducedMotion={reducedMotion} onReady={onReady} onError={onError} /></Suspense></div>
      <div className="pf-ambient-shade" aria-hidden />
      <a className="pf-skip" href={forestTarget({ kind: 'work' })} onClick={event => { event.preventDefault(); navigate({ kind: 'work' }) }}>Go straight to work and CV</a>
      <header className="pf-header">
        <a className="pf-brand" href="/#world" onClick={event => { event.preventDefault(); navigate(null) }} aria-label="Unice Bondoc — the world"><span className="pf-brand-mark" aria-hidden>U</span><span><strong>Unice Bondoc</strong><small>SOFTWARE · SYSTEMS · STORIES</small></span></a>
        <div className="pf-header-tools">
          <nav className="pf-desktop-nav" aria-label="Portfolio navigation">
            <a href="/#world" aria-current={!panel ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate(null) }}>World</a>
            {NAVIGATION.map(([kind, label]) => <a key={kind} href={forestTarget({ kind })} aria-current={panel?.kind === kind || (kind === 'work' && panel?.kind === 'project') ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate({ kind }) }}>{label}</a>)}
            <a className="pf-nav-cv" href="/#cv" aria-current={panel?.kind === 'cv' ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate({ kind: 'cv' }) }}>CV <span aria-hidden>↗</span></a>
          </nav>
          <div className="pf-display-control">
            <button className="pf-display-toggle" type="button" aria-label="Display settings" aria-expanded={displayOpen} aria-controls="pf-display-panel" onClick={() => { setDisplayOpen(value => !value); setMenuOpen(false) }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 7h7m4 0h5M4 17h3m4 0h9" /><circle cx="13" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>
            </button>
            {displayOpen && <div className="pf-display-panel" id="pf-display-panel"><p className="pf-menu-heading">Make yourself at home</p><MotionPreference reducedMotion={reducedMotion} prefersReducedMotion={prefersReducedMotion} onToggle={() => setMotionPaused(value => !value)} descriptionId="pf-display-motion-description" /></div>}
          </div>
          <button className="pf-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="pf-mobile-menu" onClick={() => { setMenuOpen(value => !value); setDisplayOpen(false) }}>Menu <span className="pf-menu-symbol" aria-hidden>{menuOpen ? '−' : '+'}</span></button>
          {menuOpen && <nav id="pf-mobile-menu" className="pf-mobile-menu" aria-label="Mobile portfolio navigation"><p className="pf-menu-heading">Explore the world</p>{NAVIGATION.map(([kind, label]) => <a key={kind} href={forestTarget({ kind })} aria-current={panel?.kind === kind ? 'page' : undefined} onClick={event => { event.preventDefault(); worldRef.current?.querySelector('.pf-menu-toggle')?.focus(); navigate({ kind }) }}><span>{label}</span><span aria-hidden>↗</span></a>)}<div className="pf-menu-links"><a href="/#cv" onClick={event => { event.preventDefault(); worldRef.current?.querySelector('.pf-menu-toggle')?.focus(); navigate({ kind: 'cv' }) }}>CV ↗</a><a href="/#contact" onClick={event => { event.preventDefault(); worldRef.current?.querySelector('.pf-menu-toggle')?.focus(); navigate({ kind: 'contact' }) }}>Contact ↗</a></div><MotionPreference reducedMotion={reducedMotion} prefersReducedMotion={prefersReducedMotion} onToggle={() => setMotionPaused(value => !value)} descriptionId="pf-menu-motion-description" /></nav>}
        </div>
      </header>
      <main className="pf-introduction" aria-label="Unice Bondoc interactive portfolio"><p className="pf-eyebrow">SYDNEY · FOUNDER OF ONQST</p><h1>Follow a spark.<br /><em>Find a world.</em></h1><p className="pf-identity-line">Software Developer<br /><span>AI Automation, Apps & Games</span></p></main>
      <footer className="pf-world-footer"><div className="pf-world-hint" role="status"><span className="pf-small-compass" aria-hidden>✧</span><span>{graphicsError ? 'Choose a memory, or go straight to the journal.' : ready ? 'Choose a glowing memory. The forest will follow.' : 'The forest is waking. Your journal is ready.'}<small>{seen.length ? `${seen.length} of 6 project memories explored this visit` : 'Click or Tab to explore · CV and work always within reach'}</small></span></div><div className="pf-footer-actions"><a className="pf-mobile-shortcut" href="/#work" onClick={event => { event.preventDefault(); navigate({ kind: 'work' }) }}>Work</a><a className="pf-mobile-shortcut" href="/#cv" onClick={event => { event.preventDefault(); navigate({ kind: 'cv' }) }}>CV</a><a href="/#contact" onClick={event => { event.preventDefault(); navigate({ kind: 'contact' }) }}>Contact ↗</a><div className="pf-guide-slot"><button type="button" className="pf-tyche" aria-label={chatOpen ? 'Close chat with Tyche' : 'Ask Tyche about Unice’s work'} aria-expanded={chatOpen} onClick={() => { setGuideOpened(true); setActivePanel(chatOpen ? null : { type: 'chat' }) }}><span>{chatOpen ? 'Close chat' : 'Ask Tyche'}</span><AnimatedTyche reducedMotion={reducedMotion} /></button></div></div></footer>
      {guideOpened && <Suspense fallback={null}><ChatBot nativeCursor /></Suspense>}
    </div>
    {panel && <Journal panel={panel} navigate={navigate} onClose={closeJournal} reducedMotion={reducedMotion} />}
    <Analytics />
  </div>
}
