import { useEffect, useState } from 'react'
import ResumePanel from '../components/ui/ResumePanel'
import ChatBot from '../components/ui/ChatBot'
import TycheMascot from '../components/ui/TycheMascot'
import useStore from '../hooks/useStore'
import { PROJECTS } from '../data/projects'
import '../styles/fast-track.css'

const PAGE_TITLE = 'Unice Bondoc — ICT Graduate | Software & Automation'
const PAGE_DESCRIPTION = 'Sydney ICT graduate and ACS WIL Developer / Programmer. Explore my team experience, AI-assisted software projects, interactive work and CV.'
const CV_SOFTWARE = '/resume/Unice_Bondoc_CV_Graduate_Software.pdf'

function scrollToSection(id, behavior = 'smooth') {
  const target = document.getElementById(id)
  if (target?.tagName === 'DETAILS') target.open = true
  target?.scrollIntoView({ behavior, block: 'start' })
}

function SiteHeader({ activeSection, onNavigate, onResume }) {
  const navigate = (event, id) => {
    event.preventDefault()
    event.currentTarget.closest('details')?.removeAttribute('open')
    onNavigate(id)
  }
  const links = [['experience', 'Experience'], ['work', 'Projects'], ['about', 'About'], ['core-memories', 'Forest']]
  const navigation = links.map(([id, label]) => <a key={id} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined} href={`#${id}`} onClick={(event) => navigate(event, id)}>{label}</a>)
  return (
    <header className="ft-header">
      <a className="ft-brand" href="#intro" aria-label="Unice Bondoc — back to the beginning" onClick={(event) => navigate(event, 'intro')}>
        <span className="ft-brand-mark">U</span>
        <span><strong>UNICE BONDOC</strong><small>SOFTWARE · SYSTEMS · SYDNEY</small></span>
      </a>
      <nav className="ft-nav" aria-label="Portfolio navigation">{navigation}<button type="button" onClick={onResume}>CV</button></nav>
      <details className="ft-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile portfolio navigation">{navigation}<button type="button" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onResume() }}>View CV</button></nav>
      </details>
    </header>
  )
}

function HiringHero({ onResume }) {
  return (
    <section id="intro" className="ft-hiring-hero ft-shell ft-scroll-section">
      <div className="ft-hiring-copy">
        <p className="ft-kicker">ICT GRADUATE · SYDNEY, AUSTRALIA</p>
        <h1>People, processes.<br /><em>Working software.</em></h1>
        <p className="ft-hiring-lede">I’m Unice Bondoc, a Developer / Programmer in an ACS WIL internship team. My background combines banking operations with software, workflow and interactive-product work through ONQST, using AI-assisted development tools.</p>
        <p className="ft-role-intent">Seeking graduate and junior opportunities in software, AI automation and systems implementation.</p>
        <div className="ft-hero-actions"><a className="ft-button primary" href="#experience">Explore my experience ↓</a><button className="ft-button" type="button" onClick={onResume}>View CV</button><a className="ft-text-link" href="mailto:uniceabondoc@gmail.com">Get in touch ↗</a></div>
        <div className="ft-cv-options"><span>Download PDF:</span><a href="/resume/Unice_Bondoc_Resume.pdf" target="_blank" rel="noopener noreferrer">Automation & systems</a><a href={CV_SOFTWARE} target="_blank" rel="noopener noreferrer">Graduate software</a></div>
      </div>
      <figure className="ft-hiring-portrait">
        <img src="/profile-unice.jpg" alt="Unice Bondoc in Sydney" width="640" height="640" fetchPriority="high" />
        <figcaption><span>CURRENTLY</span><strong>Learning. Building.<br />Contributing with a team.</strong><small>ACS WIL internship · ONQST projects</small></figcaption>
      </figure>
    </section>
  )
}

function ExperienceSection() {
  const project = PROJECTS.find(item => item.id === 'causeconnect')
  return (
    <section id="experience" className="ft-section ft-shell ft-scroll-section">
      <div className="ft-section-heading"><p className="ft-kicker">01 · EXPERIENCE</p><h2>Building with a team.</h2><p>My current internship brings project delivery, communication and software work together.</p></div>
      <article id="project-causeconnect" className="ft-experience-card">
        <div className="ft-experience-role"><p className="ft-kicker">JULY 2026 – PRESENT</p><h3>Developer / Programmer</h3><p>ACS WIL Internship · CauseConnect</p><span className="ft-stage-tag">Internship team of 10</span><a className="ft-text-link" href={project.links.github} target="_blank" rel="noopener noreferrer">View team repository ↗</a></div>
        <div className="ft-experience-detail"><h4>A social-awareness campaign application</h4><p>{project.description}</p><dl><dt>My contribution</dt><dd>{project.caseStudy.contribution}</dd><dt>Team delivery</dt><dd>{project.caseStudy.result}</dd></dl><p className="ft-proof">React · JavaScript · MySQL · Git · Team documentation</p></div>
      </article>
      <div className="ft-experience-followup"><div><p className="ft-kicker">MARCH 2026 – PRESENT</p><h3>Founder & Builder · ONQST</h3><p>Independent project work spanning product direction, AI-assisted implementation, testing, release preparation and product presentation.</p></div><a className="ft-button" href="https://onqst.com/" target="_blank" rel="noopener noreferrer">Explore the studio ↗</a></div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="ft-flagship-card ft-selected-card" id={`project-${project.id}`}>
      {project.image && <figure className={`ft-project-figure ${project.imageKind || ''}`}><a href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} preview image`}><img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" /></a><figcaption>{project.imageCaption}</figcaption></figure>}
      <div className="ft-card-body">
        <p className="ft-kicker">{project.subtitle}</p><h3>{project.title}</h3><p>{project.description}</p>
        <dl className="ft-contribution"><dt>My contribution</dt><dd>{project.caseStudy.contribution}</dd></dl>
        <p className="ft-proof">{project.stack.join(' · ')}</p>
        <details className="ft-case-study"><summary>Decisions, evidence & current stage</summary><dl><dt>The problem</dt><dd>{project.caseStudy.challenge}</dd><dt>A decision that mattered</dt><dd>{project.caseStudy.decision}</dd><dt>What I checked</dt><dd>{project.caseStudy.evidence}</dd><dt>Where it stands</dt><dd>{project.caseStudy.result}</dd></dl></details>
        <div className="ft-card-actions">{project.links.live && <a className="ft-text-link" href={project.links.live} target="_blank" rel="noopener noreferrer">{project.linkLabel || 'Explore the project'} ↗</a>}<a className="ft-text-link muted" href={`#project-${project.id}`} aria-label={`Link to ${project.title} case study`}>Case link</a></div>
      </div>
    </article>
  )
}

function WorkSections() {
  return (
    <>
      <section id="work" className="ft-section ft-shell ft-scroll-section">
        <div className="ft-section-heading"><p className="ft-kicker">02 · SELECTED SOFTWARE</p><h2>Everyday problems.<br />Practical projects.</h2><p>Three app projects, with my contribution and their current stage. I use AI-assisted development tools to turn requirements into implementations, then review workflows, test behaviour and document the result.</p></div>
        <div id="flagships" className="ft-selected-grid">{PROJECTS.filter(project => project.group === 'featured').map(project => <ProjectCard key={project.id} project={project} />)}</div>
        <p className="ft-studio-note">Built through <a href="https://onqst.com/" target="_blank" rel="noopener noreferrer">ONQST ↗</a>. This portfolio explains my work; the studio is where people discover the products.</p>
      </section>
      <section className="ft-section ft-shell ft-interactive-work">
        <div className="ft-section-heading"><p className="ft-kicker">03 · INTERACTIVE WORK</p><h2>Stories you can step into.</h2><p>Supporting work in game systems and storytelling. Each edition has its own release stage.</p></div>
        <div className="ft-interactive-grid">{PROJECTS.filter(project => project.group === 'interactive').map(project => <ProjectCard key={project.id} project={project} />)}</div>
      </section>
    </>
  )
}

function AboutSections({ onResume }) {
  return (
    <section id="about" className="ft-section ft-shell ft-scroll-section">
      <div className="ft-section-heading"><p className="ft-kicker">04 · BACKGROUND</p><h2>From operations<br />to implementation.</h2></div>
      <div className="ft-background-grid">
        <div><h3>Experience with real workflows</h3><p>As an SME Account & Loan Operations Manager at RCBC from September 2019 to September 2022, I coordinated documentation, compliance requirements and stakeholders. That experience shapes how I approach software: understand the people, the process and the handover.</p><p>My broadcasting background adds clear communication and an eye for how information is presented.</p><div className="ft-social-row"><a href="https://www.linkedin.com/in/unicebondoc/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/unicebondoc" target="_blank" rel="noopener noreferrer">GitHub ↗</a><button type="button" onClick={onResume}>View CV</button></div></div>
        <div className="ft-education"><p className="ft-kicker">EDUCATION</p><h3>Master of ICT</h3><p>Western Sydney University · 2023–2025</p><p>Capstone: comparing AI-generated and human-written content for e-commerce.</p><hr /><h3>Professional Year (ICT)</h3><p>Performance Education · ACS accredited<br />In progress</p><hr /><p>Bachelor of Communication (Broadcasting)<br />Bicol University · 2012–2016</p></div>
      </div>
      <div className="ft-support-grid">{PROJECTS.filter(project => project.group === 'support').map(project => <details className="ft-support-case" key={project.id} id={`project-${project.id}`}><summary><span>{project.title}</span><small>{project.subtitle}</small></summary><p>{project.description}</p><p>{project.caseStudy.contribution}</p><p>{project.caseStudy.decision}</p><p>{project.caseStudy.result}</p>{project.links.live && <a className="ft-text-link" href={project.links.live} target="_blank" rel="noopener noreferrer">Explore the website ↗</a>}</details>)}</div>
    </section>
  )
}

function CoreMemoriesSection({ onLaunch }) {
  return (
    <section id="core-memories" className="ft-core-chapter ft-scroll-section">
      <div className="ft-core-portal ft-shell" id="project-core-memories">
        <div className="ft-core-copy"><p className="ft-kicker">OPTIONAL · CORE MEMORIES</p><h2>A different way<br />to meet me.</h2><p className="ft-core-lede">Explore seven chapters of my journey in an interactive forest. Built with React, Three.js and WebGL, it brings my interest in storytelling and software together.</p><div className="ft-hero-actions"><button className="ft-button" type="button" onClick={onLaunch}>Explore the forest ↗</button><a className="ft-text-link" href="#writing">Read the story behind it ↓</a></div><p className="ft-forest-note">Sound optional · best on a larger screen</p></div>
        <button className="ft-core-stage" type="button" onClick={onLaunch} aria-label="Launch the interactive Core Memories forest"><img src="/projects/core-memories-forest.jpg" alt="The live Core Memories WebGL forest with glowing career-story orbs" loading="lazy" /><span className="ft-core-stage-label"><b>ENTER THE FOREST</b><small>Interactive portfolio</small><i aria-hidden>↗</i></span></button>
      </div>
    </section>
  )
}

function WritingSections() {
  return (
    <section id="writing" className="ft-section ft-shell ft-scroll-section ft-writing-notes"><div className="ft-section-heading"><p className="ft-kicker">NOTES FROM THE BUILD</p><h2>Behind the interface.</h2></div><a className="ft-article" href="https://medium.com/@unicebondoc/i-made-a-forest-because-i-didnt-know-how-else-to-tell-you-who-i-am-24282209e85a" target="_blank" rel="noopener noreferrer"><span className="ft-article-number">01</span><div><p className="ft-kicker">10 MARCH 2026</p><h3>I Didn’t Build a Portfolio. I Built a Place.</h3><p>The story behind Core Memories, and exploring a portfolio through an interactive world.</p></div><span className="ft-article-arrow" aria-hidden>↗</span></a><a className="ft-text-link" href="https://medium.com/@unicebondoc" target="_blank" rel="noopener noreferrer">More writing on Medium ↗</a></section>
  )
}

function Footer() {
  return (
    <footer className="ft-footer"><div><p className="ft-kicker">LET’S CONNECT</p><strong>Ready to contribute. Keen to keep learning.</strong><p>Sydney · Graduate and junior software, automation and systems opportunities.</p></div><div className="ft-footer-links"><a href="mailto:uniceabondoc@gmail.com">Email</a><a href="https://www.linkedin.com/in/unicebondoc/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://onqst.com/" target="_blank" rel="noopener noreferrer">ONQST ↗</a></div></footer>
  )
}

function CoreMemoriesModal({ onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="ft-core-modal" role="dialog" aria-modal="true" aria-label="Interactive Core Memories forest">
      <button className="ft-core-modal-backdrop" type="button" aria-label="Close interactive forest" onClick={onClose} />
      <div className="ft-core-modal-frame">
        <div className="ft-core-modal-bar">
          <span><b>CORE MEMORIES</b> · INTERACTIVE FOREST</span>
          <button type="button" onClick={onClose} autoFocus aria-label="Close interactive forest">Close <i aria-hidden>×</i></button>
        </div>
        <iframe src="/?embed=1" title="Core Memories interactive portfolio" allow="autoplay; fullscreen" />
      </div>
    </div>
  )
}

export default function FastTrackSite() {
  const [resumeOpen, setResumeOpen] = useState(false)
  const [coreOpen, setCoreOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('intro')
  const [scrollProgress, setScrollProgress] = useState(0)
  const activePanel = useStore((state) => state.activePanel)
  const setActivePanel = useStore((state) => state.setActivePanel)
  const setLoadingExited = useStore((state) => state.setLoadingExited)
  const chatOpen = activePanel?.type === 'chat'

  const navigateToSection = (id) => {
    const nextHash = `#${id}`
    if (window.location.hash !== nextHash) window.history.pushState(null, '', nextHash)
    scrollToSection(id)
  }

  useEffect(() => {
    setLoadingExited(true)
    const legacySection = window.location.pathname === '/about/'
      ? 'about'
      : window.location.pathname === '/writing/'
        ? 'writing'
        : null
    if (legacySection) window.history.replaceState(null, '', `/work/#${legacySection}`)

    document.title = PAGE_TITLE
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', PAGE_DESCRIPTION)
    document.body.classList.add('fast-track-body')
    document.documentElement.classList.add('fast-track-html')
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const sections = [...document.querySelectorAll('.ft-scroll-section')]
    const revealItems = [...document.querySelectorAll('.ft-section, .ft-cta, .ft-chapter-hero')]
    revealItems.forEach((item) => item.classList.add('ft-reveal'))

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-18% 0px -58% 0px', threshold: [0.05, 0.2, 0.5] })
    sections.forEach((section) => sectionObserver.observe(section))

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    revealItems.forEach((item) => revealObserver.observe(item))

    const updateProgress = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0)
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    const handleHistoryNavigation = () => {
      const id = window.location.hash.slice(1) || 'intro'
      window.setTimeout(() => scrollToSection(id), 0)
    }
    window.addEventListener('popstate', handleHistoryNavigation)
    updateProgress()

    const initialSection = legacySection || window.location.hash.slice(1)
    const initialTarget = initialSection && document.getElementById(initialSection)
    const scrollTimer = initialTarget
      ? window.setTimeout(() => scrollToSection(initialSection, 'instant'), 80)
      : null

    return () => {
      if (scrollTimer) window.clearTimeout(scrollTimer)
      sectionObserver.disconnect()
      revealObserver.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('popstate', handleHistoryNavigation)
      window.history.scrollRestoration = previousScrollRestoration
      document.body.classList.remove('fast-track-body')
      document.documentElement.classList.remove('fast-track-html')
      setActivePanel(null)
    }
  }, [setActivePanel, setLoadingExited])

  useEffect(() => {
    if (resumeOpen || coreOpen) setActivePanel(null)
  }, [coreOpen, resumeOpen, setActivePanel])

  return (
    <>
      <div className="fast-track-site" inert={resumeOpen || coreOpen ? true : undefined} aria-hidden={resumeOpen || coreOpen || undefined}>
        <div className="ft-scroll-progress" aria-hidden style={{ transform: `scaleX(${scrollProgress})` }} />
        <a className="ft-skip" href="#content">Skip to content</a>
        <SiteHeader activeSection={activeSection} onNavigate={navigateToSection} onResume={() => setResumeOpen(true)} />
        <main id="content">
          <HiringHero onResume={() => setResumeOpen(true)} />
          <ExperienceSection />
          <WorkSections />
          <AboutSections onResume={() => setResumeOpen(true)} />
          <CoreMemoriesSection onLaunch={() => setCoreOpen(true)} />
          <WritingSections />
        </main>
        <a
          className={`ft-back-top ${scrollProgress > 0.06 ? 'visible' : ''} ${chatOpen ? 'chat-open' : ''}`}
          href="#intro"
          aria-label="Back to the top"
          onClick={(event) => {
            event.preventDefault()
            navigateToSection('intro')
          }}
        >↑ <span>Top</span></a>
        <Footer />
      </div>
      {!resumeOpen && !coreOpen && (
        <div className="ft-assistant-layer" aria-label="Tyche AI portfolio guide">
          <ChatBot nativeCursor />
          <TycheMascot label="Ask Tyche" />
        </div>
      )}
      {resumeOpen && <ResumePanel onClose={() => setResumeOpen(false)} />}
      {coreOpen && <CoreMemoriesModal onClose={() => setCoreOpen(false)} />}
    </>
  )
}
