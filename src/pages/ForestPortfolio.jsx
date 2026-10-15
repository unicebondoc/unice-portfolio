import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { PROJECTS } from '../data/projects.js'
import { MEMORIES } from '../data/memories.js'
import { MEDIUM_PROFILE, WRITINGS } from '../data/writing.js'
import { PORTFOLIO_DATA } from '../../lib/portfolioData.js'
import { FOREST_NODES } from '../data/forestNodes.js'
import { forestTarget, resolveForestLocation, forestNodeForReference, canonicalChapterId } from '../data/forestNavigation.js'
import useStore from '../hooks/useStore.js'
import ProjectDemo, { AudioEdition } from '../components/ui/ProjectDemo.jsx'
import ProjectGuide from '../components/ui/ProjectGuide.jsx'
import AnimatedTyche from '../components/ui/AnimatedTyche.jsx'
import JourneyWorkMedia from '../components/ui/JourneyWorkMedia.jsx'
import EditingSamples from '../components/ui/EditingSamples.jsx'
import '../styles/forest-portfolio.css'

const ForestScene = lazy(() => import('../components/scene/PortfolioForestScene.jsx'))
const ChatBot = lazy(() => import('../components/ui/ChatBot.jsx'))
const CV_MAIN = '/resume/Unice_Bondoc_Resume.pdf'
const CV_CREATIVE = '/resume/Unice_Bondoc_CV_Creative_Media.pdf'
const CV_SOFTWARE = '/resume/Unice_Bondoc_CV_Software_Development.pdf'
const JOURNAL_NAMES = { work: 'The work', journey: 'The story at the roots', experience: 'Experience', about: 'A curious mind', writing: 'In my own words', cv: 'The CV', contact: 'Let’s make something useful' }
const NAVIGATION = [['work', 'Work'], ['journey', 'My journey'], ['experience', 'Experience'], ['about', 'About'], ['writing', 'Writing']]
const WRITING_DATE = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

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

function TycheImplementation() {
  const steps = [
    ['Visitor question', 'A question about my work, skills or story.'],
    ['React chat', 'The interface sends the conversation to /api/chat.'],
    ['Server endpoint', 'The endpoint combines recent messages with curated portfolio information.'],
    ['Context + language model', 'The model receives project facts, contribution boundaries and response instructions.'],
    ['Reply + project references', 'The response returns readable text and memory IDs used to highlight relevant forest memories.'],
  ]
  return <section className="pf-tyche-implementation" aria-labelledby="core-memories-tyche">
    <h3 id="core-memories-tyche">Tyche, the portfolio guide</h3>
    <p>I built Tyche’s React chat, server endpoint and curated portfolio context. Replies carry project-reference metadata used to highlight relevant memories in the forest; each memory opens its project case or journey chapter.</p>
    <figure className="pf-implementation-map">
      <figcaption>How a question moves through Tyche</figcaption>
      <ol>{steps.map(([title, description], index) => <li key={title}><span className="pf-flow-number" aria-hidden="true">{index + 1}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol>
    </figure>
    <p className="pf-implementation-note">Curated project facts and contribution boundaries guide the replies. The diagram describes the implemented request and response flow.</p>
  </section>
}

function ProjectCase({ project, navigate, reducedMotion }) {
  const preview = <>
    {project.mediaSamples && <EditingSamples samples={project.mediaSamples} />}
    {project.demo ? <ProjectDemo demo={project.demo} title={project.title} poster={project.image} /> : project.image && <figure className={`pf-case-image pf-case-image-${project.video ? 'video' : project.imageKind || 'wide'}`} >{project.video ? <LoopPreview src={project.video} poster={project.image} label={`${project.title} actual project recording`} reducedMotion={reducedMotion} /> : <a href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} image`}><img src={project.image} alt={project.imageAlt} width="680" height="430" /></a>}<figcaption>{(project.video ? project.videoCaption : project.imageCaption) || 'Project image'}</figcaption></figure>}
    {project.secondaryImage && <figure className="pf-case-image"><img src={project.secondaryImage} alt="Princess of Alemio separate audio edition" width="680" height="430" /><figcaption>Audio is a separate edition from the visual novel</figcaption></figure>}
    {project.audioPreview && <AudioEdition audio={project.audioPreview} title={project.title} />}
  </>
  return <article className="pf-case" id={`project-${project.id}`} style={{ '--pf-memory-color': project.color }}>
    <p className="pf-stage"><span aria-hidden>◈</span>{project.subtitle}</p>
    <p className="pf-case-purpose">{project.guide?.overview || project.description}</p>
    {project.guide ? <ProjectGuide key={project.id} project={project}>{preview}</ProjectGuide> : <>
    {project.id === 'core-memories' && <p className="pf-media-role"><strong>My role</strong> React/Three.js experience, navigation and media integration; Tyche’s chat interface, backend endpoint and portfolio context.</p>}
    {preview}
    {project.id === 'core-memories' && <TycheImplementation />}
    <div className="pf-contribution"><p className="pf-eyebrow">MY CONTRIBUTION</p><p>{project.caseStudy.contribution}</p></div>
    <dl className="pf-case-facts"><div><dt>The problem</dt><dd>{project.caseStudy.challenge}</dd></div><div><dt>A decision that mattered</dt><dd>{project.caseStudy.decision}</dd></div><div><dt>Evidence</dt><dd>{project.caseStudy.evidence}</dd></div><div><dt>Where it stands</dt><dd>{project.caseStudy.result}</dd></div></dl>
    </>}
    <ul className="pf-technologies" aria-label="Tools and technologies">{project.stack.map(item => <li key={item}>{item}</li>)}</ul>
    <div className="pf-case-actions">{project.links.live && <a className="pf-button" href={project.links.live} target="_blank" rel="noopener noreferrer">{project.linkLabel || (project.id === 'landlit' ? 'Explore fictional demo' : 'Explore the project')} ↗</a>}{project.links.github && <a className="pf-button" href={project.links.github} target="_blank" rel="noopener noreferrer">Team repository ↗</a>}<a href={forestTarget({ kind: 'work' })} onClick={event => { event.preventDefault(); navigate({ kind: 'work' }) }}>All work</a></div>
  </article>
}

function WorkIndex({ navigate }) {
  const groups = [
    ['Applications & product demonstrations', ['flatsync', 'landlit']],
    ['Interactive worlds & stories', ['core-memories', 'steeped', 'princess-of-alemio']],
    ['Software & team delivery', ['what-was-drawn', 'causeconnect']],
  ]
  const startingPoints = [['Software', 'FlatSync', 'flatsync'], ['Story & audio', 'Princess of Alemio', 'princess-of-alemio'], ['AI integration', 'Core Memories / Tyche', 'core-memories']]
  return <div><p className="pf-journal-lede">I build the interfaces and systems people use, and the video, sound and interaction that bring an idea to life. Open a project to see the work, what I built and its current stage.</p><nav className="pf-work-start" aria-label="Start with selected work"><p className="pf-eyebrow">START HERE</p><div>{startingPoints.map(([area, label, id]) => <a key={id} href={forestTarget({ kind: 'project', id })} onClick={event => { event.preventDefault(); navigate({ kind: 'project', id }) }}><small>{area}</small><strong>{label} <span aria-hidden="true">↗</span></strong></a>)}</div></nav>{groups.map(([title, ids]) => <section className="pf-work-group" key={title}><h3>{title}</h3><div className="pf-work-index">{ids.map((id, index) => {
    const project = PROJECTS.find(item => item.id === id)
    return <a href={forestTarget({ kind: 'project', id })} onClick={event => { event.preventDefault(); navigate({ kind: 'project', id }) }} className="pf-work-entry" key={id} style={{ '--pf-memory-color': project.color }}><span className="pf-entry-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{project.title}</strong><small>{project.subtitle}</small><p>{project.description}</p></span><span className="pf-entry-arrow" aria-hidden>↗</span></a>
  })}</div></section>)}<p className="pf-eyebrow pf-support-heading">OTHER THREADS</p><div className="pf-other-work">{PROJECTS.filter(item => item.group === 'support').map(project => <a key={project.id} href={forestTarget({ kind: 'project', id: project.id })} onClick={event => { event.preventDefault(); navigate({ kind: 'project', id: project.id }) }}><strong>{project.title}</strong><small>{project.subtitle}</small><span aria-hidden>↗</span></a>)}</div></div>
}

function WritingCard({ writing, compact = false }) {
  const Title = compact ? 'strong' : 'h3'
  return <a className={compact ? 'pf-chapter-writing-link' : 'pf-writing-entry'} href={writing.url} target="_blank" rel="noopener noreferrer">
    <span className="pf-writing-meta"><time dateTime={writing.publishedAt}>{WRITING_DATE.format(new Date(`${writing.publishedAt}T00:00:00Z`))}</time> · {writing.category}</span>
    <Title className="pf-writing-title">{compact ? writing.journeyLabel || writing.title : writing.title}</Title>
    {!compact && <p>{writing.description}</p>}
    <span className="pf-writing-action">Read on Medium <span aria-hidden="true">↗</span></span>
  </a>
}

function Journey({ initialChapter, navigate }) {
  const [chapter, setChapter] = useState(() => MEMORIES.find(item => item.id === canonicalChapterId(initialChapter)) || MEMORIES.find(item => item.id === 'orb-root'))
  useEffect(() => {
    setChapter(MEMORIES.find(item => item.id === canonicalChapterId(initialChapter)) || MEMORIES.find(item => item.id === 'orb-root'))
  }, [initialChapter])
  const chapterName = chapter.labelShort.replace(/^.*? · /, '')
  const relatedWriting = (chapter.writingIds || []).map(id => WRITINGS.find(writing => writing.id === id)).filter(Boolean)
  const openWriting = event => {
    if (typeof navigate !== 'function' || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate({ kind: 'writing' })
  }
  return <div className="pf-journey">
    <p className="pf-journal-lede">From Bicol to Sydney, from stories to systems. Each chapter gave me something I carry into the next: a voice, care in the details, a new direction and a reason to keep asking questions.</p>
    <div className="pf-chapter-list" aria-label="Career chapters">{MEMORIES.map(memory => <button type="button" key={memory.id} aria-pressed={memory.id === chapter.id} onClick={() => navigate({ kind: 'journey', chapter: memory.id })} style={{ '--pf-memory-color': memory.color }}><span aria-hidden>◈</span><small>{memory.year}</small><span>{memory.id === 'orb-root' ? 'Here, now' : memory.labelShort.replace(/^.*? · /, '')}</span></button>)}</div>
    <article className="pf-chapter" key={chapter.id}>
      <p className="pf-stage">{chapter.subtitle}</p><h3>{chapter.title}</h3>
      {chapter.workMedia ? <JourneyWorkMedia kind={chapter.workMedia} navigate={navigate} /> : chapter.imageSrc ? <figure className="pf-chapter-photo">
        <a href={chapter.imageSrc} target="_blank" rel="noopener noreferrer" aria-label={`Open ${chapterName} photograph in a new tab`}><img src={chapter.imageSrc} alt={chapter.imageAlt} /></a><figcaption>{chapter.imageCaption}</figcaption>
      </figure> : chapter.videoSrc && <ProjectDemo key={chapter.videoSrc} variant="memory" title={chapterName} demo={{ src: chapter.videoSrc, poster: chapter.videoPoster, caption: chapter.videoCaption, hasAudio: Boolean(chapter.videoHasAudio), aspectRatio: chapter.videoAspectRatio, captions: chapter.videoCaptions, transcript: chapter.videoTranscript }} />}
      <div className="pf-chapter-prose">
        <p>{chapter.description}</p>
        {chapter.continuation && <p>{chapter.continuation}</p>}
        {chapter.reflection && <p className="pf-chapter-reflection">{chapter.reflection}</p>}
      </div>
      {relatedWriting.length > 0 && <section className="pf-chapter-writing" aria-labelledby={`pf-chapter-writing-${chapter.id}`}>
        <h4 id={`pf-chapter-writing-${chapter.id}`}>In my own words</h4>
        <div>{relatedWriting.map(writing => <WritingCard key={writing.id} writing={writing} compact />)}</div>
        <a className="pf-inline-link" href={forestTarget({ kind: 'writing' })} onClick={openWriting}>More writing <span aria-hidden="true">↗</span></a>
      </section>}
      <ul className="pf-technologies">{chapter.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </article>
  </div>
}

function Experience({ navigate }) {
  return <div><p className="pf-journal-lede">Frontend interfaces, backend features and interactive media, built independently through ONQST and with project teams.</p><div className="pf-experience">{PORTFOLIO_DATA.experience.slice(0, 3).map(role => <article key={role.company}><p className="pf-stage">{role.dates}{role.type === 'Internship' ? ' · Internship' : ''}</p><h3>{role.title}</h3><p className="pf-role-company">{role.company}</p><ul>{role.highlights.map(text => <li key={text}>{text}</li>)}</ul>{role.company.includes('ACS') && <button className="pf-inline-link" type="button" onClick={() => navigate({ kind: 'project', id: 'causeconnect' })}>See my CauseConnect contribution ↗</button>}</article>)}</div><details className="pf-earlier"><summary>Earlier experience · RCBC</summary><p>SME Account & Loan Operations Manager · September 2019–September 2022.</p><p>{PORTFOLIO_DATA.experience[3].highlights[0]}</p></details></div>
}

function About({ navigate }) {
  return <div><div className="pf-about-identity"><img src="/profile-unice-approved.webp" alt="Unice Bondoc" width="768" height="768" /><div><p className="pf-eyebrow">UNICE BONDOC · SYDNEY</p><h3>Stories, made tangible.</h3><p>Software Developer &amp; Multimedia Creator<br />Founder of ONQST</p></div></div><p className="pf-journal-lede">{PORTFOLIO_DATA.identity.summary}</p><p>I care about both how something works and how it feels. Broadcasting shaped how I tell a story; ICT lets me build the interactions and systems underneath. In this forest, every project orb opens the work, my contribution and its current stage.</p><div className="pf-education">{PORTFOLIO_DATA.education.map(item => <article key={item.qualification}><h3>{item.qualification}</h3><p>{item.institution} · {item.dates || item.status}</p>{item.research && <p>{item.research}</p>}</article>)}</div><button type="button" className="pf-inline-link" onClick={() => navigate({ kind: 'project', id: 'core-memories' })}>How this forest was built ↗</button><ContactLinks /></div>
}

function Writing() {
  return <div className="pf-writing"><p className="pf-journal-lede">Personal essays, product stories and technical notes from my journey and the work I’m building.</p><div className="pf-writing-list">{WRITINGS.map(writing => <WritingCard key={writing.id} writing={writing} />)}</div><a className="pf-inline-link" href={MEDIUM_PROFILE} target="_blank" rel="noopener noreferrer">My Medium profile <span aria-hidden="true">↗</span></a></div>
}

function CV() {
  return <div><p className="pf-journal-lede">Choose the version for the role. The combined CV brings software development and multimedia together. Focused versions expand the technical or automation work.</p><div className="pf-cv-choices">{[[CV_CREATIVE, 'Software development & multimedia', 'Interactive products, AI workflows, video and motion'], [CV_SOFTWARE, 'Software development', 'Frontend, backend, applications and interactive products'], [CV_MAIN, 'Automation & systems', 'Workflow, implementation and business systems roles']].map(([href, title, description]) => <article key={href}><p className="pf-eyebrow">PDF · TWO PAGES</p><h3>{title}</h3><p>{description}</p><div><a className="pf-button" href={href} target="_blank" rel="noopener noreferrer">Open CV ↗</a><a href={href} download>Download ↓</a></div></article>)}</div><p className="pf-cv-note">View or download directly. Your place in the forest stays here.</p><ContactLinks /></div>
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
      const items = [...journalRef.current.querySelectorAll('button, a[href], summary, video, audio, iframe, [tabindex="0"]')].filter(element => !element.disabled && element.getClientRects().length)
      const first = items[0], last = items.at(-1)
      if (event.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [onClose])
  useEffect(() => { scrollRef.current.scrollTop = 0; journalRef.current.scrollTop = 0; headingRef.current?.focus({ preventScroll: true }) }, [panel.kind, panel.id])
  return <div className="pf-journal-layer"><button type="button" className="pf-journal-backdrop" aria-label="Close journal and return to the forest" tabIndex={-1} onClick={onClose} /><section ref={journalRef} className="pf-journal" role="dialog" aria-modal="true" aria-labelledby="pf-journal-title" style={{ '--pf-memory-color': project?.color || '#b9e6db' }}><header className="pf-journal-header"><div><p className="pf-eyebrow">THE FIELD JOURNAL <span aria-hidden>/</span> {project ? 'PROJECT MEMORY' : 'UNICE’S WORLD'}</p><h2 id="pf-journal-title" ref={headingRef} tabIndex={-1}>{title}</h2></div><button type="button" className="pf-journal-close" aria-label="Close journal" onClick={onClose}><span aria-hidden>×</span></button></header><nav className="pf-journal-tabs" aria-label="Journal sections">{[['work', 'Work'], ['journey', 'Journey'], ['experience', 'Experience'], ['writing', 'Writing'], ['cv', 'CV']].map(([kind, label]) => <button key={kind} type="button" aria-current={panel.kind === kind || (kind === 'work' && panel.kind === 'project') ? 'page' : undefined} onClick={() => navigate({ kind })}>{label}</button>)}</nav><div className="pf-journal-scroll" ref={scrollRef}>{project ? <ProjectCase project={project} navigate={navigate} reducedMotion={reducedMotion} /> : panel.kind === 'work' ? <WorkIndex navigate={navigate} /> : panel.kind === 'journey' ? <Journey initialChapter={panel.chapter} navigate={navigate} /> : panel.kind === 'experience' ? <Experience navigate={navigate} /> : panel.kind === 'about' ? <About navigate={navigate} /> : panel.kind === 'writing' ? <Writing /> : panel.kind === 'cv' ? <CV /> : <><p className="pf-journal-lede">Software development, multimedia and AI workflows · Sydney.</p><ContactLinks /></>}</div><footer className="pf-journal-foot"><span aria-hidden>✧</span><span>The forest stays with you.</span><button type="button" onClick={onClose}>Return to the world ↙</button></footer></section></div>
}

export default function ForestPortfolio() {
  const [panel, setPanel] = useState(() => resolveForestLocation(window.location))
  useEffect(() => {
    const isWriting = panel?.kind === 'writing'
    const title = isWriting ? 'Unice Bondoc — Writing & Stories' : 'Unice Bondoc — Software Developer & Multimedia Creator'
    const description = isWriting
      ? 'Personal essays, product stories and technical notes by Unice Bondoc, a Sydney software developer, multimedia creator and founder of ONQST. Read the stories behind the work.'
      : 'Sydney software developer, multimedia creator and founder of ONQST. Explore frontend interfaces, backend APIs, AI workflows, video, motion and interactive stories.'
    const canonical = `https://www.unicebondoc.com${window.location.pathname}`
    document.title = title
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
  }, [panel?.kind])
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
      <div className="pf-ambient-shade" aria-hidden />
      <a className="pf-skip" href={forestTarget({ kind: 'work' })} onClick={event => { event.preventDefault(); navigate({ kind: 'work' }) }}>Go straight to work and CV</a>
      <header className="pf-header">
        <a className="pf-brand" href="/#world" onClick={event => { event.preventDefault(); navigate(null) }} aria-label="Unice Bondoc — the world"><span className="pf-brand-mark" aria-hidden>U</span><span><strong>Unice Bondoc</strong><small>SOFTWARE · MEDIA · INTERACTION</small></span></a>
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
      <main className="pf-introduction" aria-label="Unice Bondoc interactive portfolio"><p className="pf-eyebrow">SYDNEY · FOUNDER OF ONQST</p><h1>Follow a spark.<br /><em>Find a world.</em></h1><p className="pf-identity-line">Software Developer &amp; Multimedia Creator<br /><span>Interactive Products · AI Workflows · Video &amp; Motion</span></p></main>
      <div className="pf-canvas-layer"><Suspense fallback={null}><ForestScene nodes={FOREST_NODES} journalOpen={Boolean(panel)} selectedId={selectedId} pulseId={pulseId} onSelect={selectNode} reducedMotion={reducedMotion} onReady={onReady} onError={onError} /></Suspense></div>
      <footer className="pf-world-footer"><div className="pf-world-hint" role="status"><span className="pf-small-compass" aria-hidden>✧</span><span>{graphicsError ? 'Choose a memory, or go straight to the journal.' : ready ? 'Choose a glowing memory. The forest will follow.' : 'The forest is waking. Your journal is ready.'}<small>{seen.length ? `${seen.length} of 6 project memories explored this visit` : 'Click or Tab to explore · CV and work always within reach'}</small></span></div><div className="pf-footer-actions"><a className="pf-mobile-shortcut" href="/#work" onClick={event => { event.preventDefault(); navigate({ kind: 'work' }) }}>Work</a><a className="pf-mobile-shortcut" href="/#cv" onClick={event => { event.preventDefault(); navigate({ kind: 'cv' }) }}>CV</a><a href="/#contact" onClick={event => { event.preventDefault(); navigate({ kind: 'contact' }) }}>Contact ↗</a><div className="pf-guide-slot"><button type="button" className="pf-tyche" aria-label={chatOpen ? 'Close chat with Tyche' : 'Ask Tyche about Unice’s work'} aria-expanded={chatOpen} onClick={() => { setGuideOpened(true); setActivePanel(chatOpen ? null : { type: 'chat' }) }}><span>{chatOpen ? 'Close chat' : 'Ask Tyche'}</span><AnimatedTyche reducedMotion={reducedMotion} /></button></div></div></footer>
      {guideOpened && <Suspense fallback={null}><ChatBot nativeCursor /></Suspense>}
    </div>
    {panel && <Journal panel={panel} navigate={navigate} onClose={closeJournal} reducedMotion={reducedMotion} />}
    <Analytics />
  </div>
}
