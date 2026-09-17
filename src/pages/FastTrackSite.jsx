import { useEffect, useState } from 'react'
import ResumePanel from '../components/ui/ResumePanel'
import ChatBot from '../components/ui/ChatBot'
import TycheMascot from '../components/ui/TycheMascot'
import useStore from '../hooks/useStore'
import { PROJECTS } from '../data/projects'
import '../styles/fast-track.css'

const PAGE_TITLE = 'Unice Bondoc — Founder & Builder | ONQST'
const PAGE_DESCRIPTION = 'Sydney-based founder and product engineer building AI, software and interactive experiences. Explore selected work and the Core Memories forest.'

function scrollToSection(id, behavior = 'smooth') {
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

const articles = [
  {
    date: '26 Mar 2026',
    title: 'The AI Model Nobody’s Talking About Just Beat Claude Opus — At 50x Less the Cost',
    summary: 'A practical investigation into MiniMax M2.7, its claims, trade-offs, and where it actually fits.',
    href: 'https://medium.com/@unicebondoc/the-ai-model-nobodys-talking-about-just-beat-claude-opus-at-50x-less-the-cost-37fe0a897a11',
  },
  {
    date: '18 Mar 2026',
    title: 'I Built an App That Reads Your Hands Because I Was Tired of Tapping Through Fate',
    summary: 'The product story behind gesture-controlled oracle cards and making an interaction feel meaningful.',
    href: 'https://medium.com/@unicebondoc/i-built-an-app-that-reads-your-hands-because-i-was-tired-of-tapping-through-fate-1d9ddcc2f8a6',
  },
  {
    date: '10 Mar 2026',
    title: 'I Didn’t Build a Portfolio. I Built a Place.',
    summary: 'Why Core Memories became a forest, and what an immersive portfolio can communicate that a résumé cannot.',
    href: 'https://medium.com/@unicebondoc/i-made-a-forest-because-i-didnt-know-how-else-to-tell-you-who-i-am-24282209e85a',
  },
]

function SiteHeader({ activeSection, onNavigate, onResume }) {
  const handleSectionClick = (event, id) => {
    event.preventDefault()
    event.currentTarget.closest('details')?.removeAttribute('open')
    onNavigate(id)
  }
  return (
    <header className="ft-header">
      <a className="ft-brand" href="#core-memories" aria-label="Unice Bondoc — back to the beginning" onClick={(event) => handleSectionClick(event, 'core-memories')}>
        <span className="ft-brand-mark">U</span>
        <span>
          <strong>UNICE BONDOC</strong>
          <small>FOUNDER · BUILDER · ONQST</small>
        </span>
      </a>
      <nav className="ft-nav" aria-label="Portfolio navigation">
        <a className={activeSection === 'core-memories' ? 'active' : ''} aria-current={activeSection === 'core-memories' ? 'location' : undefined} href="#core-memories" onClick={(event) => handleSectionClick(event, 'core-memories')}>Forest</a>
        <a className={activeSection === 'work' ? 'active' : ''} aria-current={activeSection === 'work' ? 'location' : undefined} href="#work" onClick={(event) => handleSectionClick(event, 'work')}>Work</a>
        <a className={activeSection === 'about' ? 'active' : ''} aria-current={activeSection === 'about' ? 'location' : undefined} href="#about" onClick={(event) => handleSectionClick(event, 'about')}>About</a>
        <a className={activeSection === 'writing' ? 'active' : ''} aria-current={activeSection === 'writing' ? 'location' : undefined} href="#writing" onClick={(event) => handleSectionClick(event, 'writing')}>Writing</a>
        <button type="button" onClick={onResume}>Résumé</button>
      </nav>
      <details className="ft-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile portfolio navigation">
          <a className={activeSection === 'core-memories' ? 'active' : ''} aria-current={activeSection === 'core-memories' ? 'location' : undefined} href="#core-memories" onClick={(event) => handleSectionClick(event, 'core-memories')}>Core Memories</a>
          <a className={activeSection === 'work' ? 'active' : ''} aria-current={activeSection === 'work' ? 'location' : undefined} href="#work" onClick={(event) => handleSectionClick(event, 'work')}>Work</a>
          <a className={activeSection === 'about' ? 'active' : ''} aria-current={activeSection === 'about' ? 'location' : undefined} href="#about" onClick={(event) => handleSectionClick(event, 'about')}>About</a>
          <a className={activeSection === 'writing' ? 'active' : ''} aria-current={activeSection === 'writing' ? 'location' : undefined} href="#writing" onClick={(event) => handleSectionClick(event, 'writing')}>Writing</a>
          <button
            type="button"
            onClick={(event) => {
              event.currentTarget.closest('details')?.removeAttribute('open')
              onResume()
            }}
          >Résumé</button>
        </nav>
      </details>
    </header>
  )
}

function Footer() {
  return (
    <footer className="ft-footer">
      <div>
        <strong>BUILDING INTELLIGENT PRODUCTS</strong>
        <p>Sydney, Australia · Open to product engineering roles, collaborations, and interesting conversations.</p>
      </div>
      <div className="ft-footer-links">
        <a href="https://www.linkedin.com/in/unicebondoc/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/unicebondoc" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:uniceabondoc@gmail.com">Email</a>
      </div>
    </footer>
  )
}

function ProjectCard({ project, onLaunch }) {
  return (
    <article className="ft-flagship-card ft-selected-card" id={`project-${project.id}`}>
      {project.image ? (
        <div className="ft-card-media"><img src={project.image} alt={project.imageAlt} loading="lazy" /></div>
      ) : (
        <div className="ft-project-monogram" aria-hidden="true" style={{ color: project.color }}>
          <span>{project.id === 'flatsync' ? 'FS' : 'CC'}</span>
          <small>{project.id === 'flatsync' ? 'A LITTLE MORE IN SYNC.' : 'BUILT TOGETHER.'}</small>
        </div>
      )}
      <div className="ft-card-body">
        <p className="ft-kicker">{project.subtitle}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <p className="ft-proof">{project.stack.join(' · ')}</p>
        <details className="ft-case-study">
          <summary>Read the case study</summary>
          <dl>
            <dt>The challenge</dt><dd>{project.caseStudy.challenge}</dd>
            <dt>My contribution</dt><dd>{project.caseStudy.contribution}</dd>
            <dt>Where it stands</dt><dd>{project.caseStudy.result}</dd>
          </dl>
        </details>
        <div className="ft-card-actions">
          {project.links.live && <a className="ft-text-link" href={project.links.live} target="_blank" rel="noopener noreferrer">Visit website ↗</a>}
          {project.links.github && <a className="ft-text-link" href={project.links.github} target="_blank" rel="noopener noreferrer">View team repository ↗</a>}
          {project.id === 'core-memories' && <button type="button" className="ft-text-link ft-inline-button" onClick={onLaunch}>Explore the forest ↗</button>}
          {!project.links.live && !project.links.github && project.id !== 'core-memories' && <a className="ft-text-link" href="mailto:uniceabondoc@gmail.com">Ask me about the work ↗</a>}
        </div>
      </div>
    </article>
  )
}

function WorkSections({ onLaunch }) {
  return (
    <>
      <section id="work" className="ft-section ft-shell ft-scroll-section">
        <div className="ft-section-heading">
          <p className="ft-kicker">02 · SELECTED WORK</p>
          <h2>Three ways I build.</h2>
          <p>AI that people can interact with. Software that handles everyday complexity. Experiences that feel like somewhere worth exploring.</p>
        </div>
        <div id="flagships" className="ft-selected-grid">
          {PROJECTS.filter(project => project.flagship).map(project => <ProjectCard key={project.id} project={project} onLaunch={onLaunch} />)}
        </div>
      </section>
      <section className="ft-section ft-shell">
        <div className="ft-section-heading">
          <p className="ft-kicker">BEYOND THE PRODUCT</p>
          <h2>The business. The systems. The team.</h2>
          <p>Building also means operating the business, making the underlying systems dependable, and delivering with other people.</p>
        </div>
        <div className="ft-selected-grid">
          {PROJECTS.filter(project => !project.flagship).map(project => <ProjectCard key={project.id} project={project} onLaunch={onLaunch} />)}
        </div>
      </section>
    </>
  )
}

function CoreMemoriesSection({ onLaunch }) {
  return (
    <section id="core-memories" className="ft-core-chapter ft-scroll-section">
      <div className="ft-core-portal ft-shell">
        <div className="ft-core-copy">
          <p className="ft-kicker">UNICE BONDOC · FOUNDER & BUILDER AT ONQST</p>
          <h1>I build things you can step into.</h1>
          <p className="ft-core-lede">
            AI, software, and interactive experiences—from the first idea to the product and the business around it. I’m Unice, a Sydney-based founder who designs the experience and writes the code. This forest is one piece of my story.
          </p>
          <div className="ft-core-features" aria-label="Core Memories experience features">
            <div><strong>07</strong><span>memory orbs</span></div>
            <div><strong>LIVE</strong><span>WebGL world</span></div>
            <div><strong>AI</strong><span>Tyche guide</span></div>
          </div>
          <div className="ft-hero-actions">
            <a className="ft-button primary" href="#work">See what I build ↓</a>
            <button className="ft-button ft-launch-button" type="button" onClick={onLaunch}>Explore the forest</button>
          </div>
        </div>

        <button className="ft-core-stage" type="button" onClick={onLaunch} aria-label="Launch the interactive Core Memories forest">
          <img src="/projects/core-memories-forest.jpg" alt="The live Core Memories WebGL forest with seven glowing career-story orbs" />
          <span className="ft-core-stage-label"><b>ENTER THE FOREST</b><small>Sound optional · explore freely</small><i aria-hidden>↗</i></span>
        </button>
      </div>
      <div className="ft-core-marquee" aria-hidden>
        <span>MEMORY · CRAFT · SYSTEMS · PLAY · CURIOSITY · MEMORY · CRAFT · SYSTEMS · PLAY · CURIOSITY ·</span>
      </div>
    </section>
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

function AboutSections({ onResume }) {
  return (
    <>
      <section id="about" className="ft-hero ft-shell about-hero ft-scroll-section ft-chapter-hero">
        <div className="ft-about-hero-grid">
          <div className="ft-about-intro">
            <p className="ft-kicker">03 · ABOUT UNICE</p>
            <h2 className="ft-chapter-title">Story first. Systems always.</h2>
            <p className="ft-hero-copy">I’m Unice Bondoc, founder and builder at ONQST in Sydney. I started in broadcasting and banking operations—worlds that taught me how people move through systems when the stakes are real. Today, I work across product direction, design, software, and the business around what I build.</p>
            <div className="ft-social-row" aria-label="Connect with Unice">
              <a href="https://www.linkedin.com/in/unicebondoc/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href="https://github.com/unicebondoc" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a href="https://medium.com/@unicebondoc" target="_blank" rel="noopener noreferrer">Medium ↗</a>
              <a href="mailto:uniceabondoc@gmail.com">Email ↗</a>
              <button type="button" onClick={onResume}>Résumé</button>
            </div>
          </div>
          <figure className="ft-portrait-card">
            <div className="ft-portrait-orbit" aria-hidden />
            <img src="/profile-unice.jpg" alt="Unice Bondoc in Sydney" />
            <figcaption><strong>UNICE BONDOC</strong><span>Founder · product engineer · Sydney</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="ft-section ft-shell about-grid">
        <div className="ft-about-copy">
          <h2>I stay for the whole build.</h2>
          <p>Research, architecture, interfaces, deployment, evaluation, and the awkward final ten percent where a prototype becomes something another person can actually use.</p>
          <p>My Master of ICT capstone at Western Sydney University compared AI-generated and human-written content in a commerce setting. It taught me to evaluate what an AI system actually changes—not just whether its output looks impressive.</p>
          <p>Today I’m building an interconnected portfolio: customer-facing AI products, a private automation system, and interactive web experiences.</p>
        </div>
        <aside className="ft-now-card">
          <p className="ft-kicker">NOW</p>
          <h3>Founder & Builder · ONQST</h3>
          <ul>
            <li>Building What Was Drawn and FlatSync</li>
            <li>Contributing to UNIKRE commerce and operations</li>
            <li>Developing Ninja Clan on Hermes</li>
            <li>Building interactive software experiences</li>
            <li>Completing the ACS Professional Year</li>
          </ul>
          <button type="button" className="ft-text-link ft-inline-button" onClick={onResume}>View résumé ↗</button>
        </aside>
      </section>

      <section id="system-story" className="ft-section ft-shell">
        <div className="ft-section-heading compact">
          <p className="ft-kicker">EVOLUTION OF AN AGENT SYSTEM</p>
          <h2>One machine. Then a butler. Now a clan.</h2>
          <p>What began as a local assistant on a repurposed iMac became a dependable private operating system. Each migration solved a real constraint: local experimentation, always-on availability, safer routing, and finally a wider clan of specialised agents.</p>
        </div>
        <div className="ft-timeline">
          <div><span>01 · LOCAL FOUNDATION</span><strong>A Linux iMac</strong><p>A retired iMac was converted into an always-available Linux machine: the first private home for experiments, bots, and automation.</p></div>
          <div><span>02 · FIRST ASSISTANT</span><strong>Ninja Butler on OpenClaw</strong><p>A Telegram-first assistant connected conversations, memory, daily operations, and early automation into one working system.</p></div>
          <div><span>03 · INFRASTRUCTURE</span><strong>Moved to a Linux VPS</strong><p>The runtime migrated to Hetzner for reliable 24/7 operation, systemd services, persistent logs, SSH boundaries, and remote access.</p></div>
          <div><span>04 · CURRENT SYSTEM</span><strong>Hermes on the Mac</strong><p>The VPS was retired. Hermes now runs on a Mac, with Obsidian for durable knowledge, TickTick for actions, Google Calendar for time, and human approval gates for consequential actions.</p></div>
        </div>
      </section>

      <section className="ft-section ft-shell">
        <div className="ft-section-heading compact"><p className="ft-kicker">CORE CAPABILITIES</p><h2>Range, without losing depth.</h2></div>
        <div className="ft-capability-grid">
          <div><strong>AI PRODUCTS</strong><p>LLMs, RAG, evaluation, tool calling, multimodal interactions, computer vision.</p></div>
          <div><strong>FULL-STACK DELIVERY</strong><p>React, TypeScript, Python, FastAPI, Supabase, APIs, Docker, Vercel, Railway.</p></div>
          <div><strong>AGENT SYSTEMS</strong><p>Hermes, deterministic workflows, private runtimes, multi-agent routing, human approval gates.</p></div>
          <div><strong>MOBILE & GAMES</strong><p>Unity 6, C#, iOS, haptics, analytics, gameplay systems, custom editor tooling.</p></div>
        </div>
      </section>
    </>
  )
}

function WritingSections() {
  return (
    <>
      <section id="writing" className="ft-hero ft-shell writing-hero ft-scroll-section ft-chapter-hero">
        <p className="ft-kicker">04 · NOTES FROM THE BUILD</p>
        <h2 className="ft-chapter-title">Writing about systems that feel alive.</h2>
        <p className="ft-hero-copy">Field notes from the strange middle—where AI becomes useful, experiments become products, and unusual ideas earn their place.</p>
      </section>
      <section className="ft-section ft-shell">
        <div className="ft-article-list">
          {articles.map((article, index) => (
            <a className="ft-article" href={article.href} target="_blank" rel="noopener noreferrer" key={article.href}>
              <span className="ft-article-number">0{index + 1}</span>
              <div><p className="ft-kicker">{article.date}</p><h2>{article.title}</h2><p>{article.summary}</p></div>
              <span className="ft-article-arrow" aria-hidden>↗</span>
            </a>
          ))}
        </div>
        <a className="ft-button" href="https://medium.com/@unicebondoc" target="_blank" rel="noopener noreferrer">Read everything on Medium ↗</a>
      </section>
    </>
  )
}

export default function FastTrackSite() {
  const [resumeOpen, setResumeOpen] = useState(false)
  const [coreOpen, setCoreOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('core-memories')
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
      const id = window.location.hash.slice(1) || 'core-memories'
      window.setTimeout(() => scrollToSection(id), 0)
    }
    window.addEventListener('popstate', handleHistoryNavigation)
    updateProgress()

    const initialSection = legacySection || window.location.hash.slice(1)
    const initialTarget = initialSection && document.getElementById(initialSection)
    const scrollTimer = initialTarget
      ? window.setTimeout(() => initialTarget.scrollIntoView({ behavior: 'instant', block: 'start' }), 80)
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
          <CoreMemoriesSection onLaunch={() => setCoreOpen(true)} />
          <WorkSections onLaunch={() => setCoreOpen(true)} />
          <AboutSections onResume={() => setResumeOpen(true)} />
          <WritingSections />
        </main>
        <a
          className={`ft-back-top ${scrollProgress > 0.06 ? 'visible' : ''} ${chatOpen ? 'chat-open' : ''}`}
          href="#core-memories"
          aria-label="Back to the top"
          onClick={(event) => {
            event.preventDefault()
            navigateToSection('core-memories')
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
