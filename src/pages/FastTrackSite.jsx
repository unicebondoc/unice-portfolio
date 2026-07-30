import { useEffect, useState } from 'react'
import ResumePanel from '../components/ui/ResumePanel'
import '../styles/fast-track.css'

const PAGE_TITLE = 'Unice Bondoc — AI Engineer & Product Builder'
const PAGE_DESCRIPTION = 'AI, mobile, agent, game, and interactive products designed and shipped by Unice Bondoc.'

function scrollToSection(id, behavior = 'smooth') {
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

const secondaryProjects = [
  {
    name: 'Ninja Clan',
    eyebrow: 'LIVE SYSTEM · HERMES',
    description:
      'A self-hosted personal AI operating system spanning Telegram, Gmail, Calendar, TickTick, and a Mac build worker. It began as Ninja Butler on OpenClaw and a repurposed Linux iMac, moved to an always-on Linux VPS, then transitioned to Hermes and evolved into the wider Ninja Clan system.',
    proof: 'Multi-agent routing · private VPS runtime · read-only bridges · deterministic daily operations',
    image: '/projects/ninja-clan.png',
    imageAlt: 'Ninja Clan cat-ninja emblem',
    tone: 'violet',
    links: [{ label: 'View source', href: 'https://github.com/unicebondoc/ninja-butler' }],
  },
  {
    name: 'Boba Rush',
    eyebrow: 'TESTFLIGHT · UNITY 6',
    description:
      'A portrait casual mobile game about serving bubble tea under pressure, with customer patience, combo scoring, rewarded-ad recovery, analytics, haptics, and custom editor tooling.',
    proof: 'Unity 6 · C# · iOS · gameplay systems · mobile release pipeline',
    image: '/projects/boba-rush.jpg',
    imageAlt: 'Boba Rush gameplay showing a bubble tea order',
    tone: 'rose',
    links: [],
  },
  {
    name: 'LandLIT',
    eyebrow: 'IN DEVELOPMENT · PROPTECH',
    description:
      'A WhatsApp-native property-management product for rent reminders, lease-expiry alerts, tenant workflows, and operational visibility. Built as an active development project, not presented as a live production deployment.',
    proof: 'Next.js · TypeScript · Supabase · PostgreSQL · Twilio · OpenAI',
    tone: 'emerald',
    links: [{ label: 'View source', href: 'https://github.com/unicebondoc/landlit' }],
  },
]

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
          <small>AI · MOBILE · AGENT SYSTEMS</small>
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
        <p>Sydney, Australia · Available for product partnerships and thoughtful collaborations.</p>
      </div>
      <div className="ft-footer-links">
        <a href="https://www.linkedin.com/in/unicebondoc/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/unicebondoc" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:uniceabondoc@gmail.com">Email</a>
      </div>
    </footer>
  )
}

function WorkSections() {
  return (
    <>
      <section id="work" className="ft-hero ft-shell ft-scroll-section">
        <div className="ft-hero-grid">
          <div className="ft-hero-content">
            <p className="ft-kicker">02 · SELECTED WORK · 2024—2026</p>
            <h1>Products with a pulse.</h1>
            <p className="ft-hero-copy">
              I design and ship AI, mobile, agent, and game systems end to end—combining technical depth with experiences people can feel.
            </p>
            <div className="ft-hero-actions">
              <a className="ft-button primary" href="#flagships">See the work</a>
              <a className="ft-button" href="#about">Meet the builder</a>
            </div>
          </div>
          <a className="ft-hero-art ft-work-art" href="#flagships" aria-label="Explore Unice's selected product work">
            <span className="ft-art-orbit" aria-hidden />
            <img
              src="/projects/what-was-drawn.jpg"
              alt="What Was Drawn gesture-controlled oracle experience"
              fetchPriority="high"
            />
            <span className="ft-art-caption"><strong>SELECTED WORK</strong> LIVE AI · MOBILE · INTERACTIVE PRODUCTS <b>EXPLORE ↓</b></span>
          </a>
        </div>
        <div className="ft-proof-row" aria-label="Portfolio overview">
          <span><strong>02</strong> live customer experiences</span>
          <span><strong>01</strong> private agent operating system</span>
          <span><strong>01</strong> iOS game in TestFlight</span>
        </div>
      </section>

      <section id="flagships" className="ft-section ft-shell">
        <div className="ft-section-heading">
          <p className="ft-kicker">THE QUIET WHISKERS UNIVERSE</p>
          <h2>One product world, two live experiences.</h2>
          <p>UNIKRE is the brand and physical-product home. What Was Drawn turns the same oracle world into a gesture-controlled AI experience, with native iOS upcoming.</p>
        </div>

        <div className="ft-flagship-grid">
          <article className="ft-flagship-card gold">
            <div className="ft-card-media wwd">
              <img src="/projects/what-was-drawn.jpg" alt="What Was Drawn oracle card web experience" />
              <span className="ft-status">WEB LIVE · iOS UPCOMING</span>
            </div>
            <div className="ft-card-body">
              <p className="ft-kicker">GESTURE AI · RAG · COMPUTER VISION</p>
              <h3>What Was Drawn</h3>
              <p>Draw oracle cards with real-time hand gestures and receive a personalised three-card reading through a full retrieval-augmented generation pipeline.</p>
              <ul className="ft-evidence-list">
                <li>MediaPipe hand tracking with tap-based mobile fallback</li>
                <li>FastAPI, LangChain, Pinecone, OpenAI, Docker</li>
                <li>Live web product with a native iOS experience upcoming</li>
              </ul>
              <div className="ft-card-actions">
                <a className="ft-text-link" href="https://www.whatwasdrawn.com/" target="_blank" rel="noopener noreferrer">Visit live site ↗</a>
                <a className="ft-text-link muted" href="https://github.com/unicebondoc/whatwasdrawn" target="_blank" rel="noopener noreferrer">Source ↗</a>
              </div>
            </div>
          </article>

          <article className="ft-flagship-card amber">
            <div className="ft-card-media unikre">
              <img src="/projects/unikre-box.jpg" alt="The Quiet Whiskers Oracle deck by UNIKRE" />
              <span className="ft-status">LIVE BRAND WEBSITE</span>
            </div>
            <div className="ft-card-body">
              <p className="ft-kicker">BRAND · 3D COMMERCE · PHYSICAL PRODUCT</p>
              <h3>UNIKRE</h3>
              <p>A cinematic commerce and brand experience for The Quiet Whiskers Oracle—a 44-card deck and guidebook connected directly to the digital reading experience.</p>
              <ul className="ft-evidence-list">
                <li>Interactive 3D product presentation with a real deck render</li>
                <li>Next.js, React Three Fiber, motion, analytics, commerce CTAs</li>
                <li>Connects the physical deck, Etsy storefront, and What Was Drawn</li>
              </ul>
              <div className="ft-card-actions">
                <a className="ft-text-link" href="https://unikre.com.au/" target="_blank" rel="noopener noreferrer">Visit live site ↗</a>
                <a className="ft-text-link muted" href="https://github.com/unicebondoc/unikre-website" target="_blank" rel="noopener noreferrer">Source ↗</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="ft-section ft-shell">
        <div className="ft-section-heading compact">
          <p className="ft-kicker">SYSTEMS & EXPERIMENTS</p>
          <h2>Built beyond the browser.</h2>
        </div>
        <div className="ft-project-grid">
          {secondaryProjects.map((project) => (
            <article className={`ft-project-card ${project.tone}`} key={project.name}>
              {project.image ? (
                <div className="ft-project-image"><img src={project.image} alt={project.imageAlt} /></div>
              ) : (
                <div className="ft-project-sigil" aria-hidden>{project.name.slice(0, 2).toUpperCase()}</div>
              )}
              <div>
                <p className="ft-kicker">{project.eyebrow}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p className="ft-proof">{project.proof}</p>
                {project.links.map((link) => (
                  <a
                    className="ft-text-link"
                    href={link.href}
                    key={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >{link.label} ↗</a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ft-cta ft-shell">
        <p className="ft-kicker">NEXT · THE BUILDER BEHIND THE WORK</p>
        <h2>Products are the output. Curiosity is the operating system.</h2>
        <div className="ft-hero-actions">
          <a className="ft-button primary" href="#about">Meet Unice</a>
          <a className="ft-button" href="#writing">Read the build notes</a>
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
          <p className="ft-kicker">01 · CORE MEMORIES · INTERACTIVE ORIGIN</p>
          <h2>A portfolio you enter, not just read.</h2>
          <p className="ft-core-lede">
            Core Memories turns my path—from Manila to Sydney, from operations to AI engineering—into a living forest. Each light is a chapter. Each artifact opens a project. Tyche is the AI familiar who helps visitors find the thread connecting it all.
          </p>
          <div className="ft-core-features" aria-label="Core Memories experience features">
            <div><strong>07</strong><span>memory orbs</span></div>
            <div><strong>LIVE</strong><span>WebGL world</span></div>
            <div><strong>AI</strong><span>Tyche guide</span></div>
          </div>
          <div className="ft-hero-actions">
            <button className="ft-button primary ft-launch-button" type="button" onClick={onLaunch}>Launch interactive forest</button>
            <a className="ft-button" href="#work">See what I build ↓</a>
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
        <p className="ft-kicker">03 · ABOUT UNICE</p>
        <h2 className="ft-chapter-title">Story first. Systems always.</h2>
        <p className="ft-hero-copy">I’m an independent AI engineer and product builder based in Sydney. My path runs from broadcasting and banking operations to research, full-stack delivery, agent systems, and mobile games.</p>
      </section>

      <section className="ft-section ft-shell about-grid">
        <div className="ft-about-copy">
          <h2>I build across the whole product.</h2>
          <p>Research, architecture, interfaces, deployment, evaluation, and the awkward final ten percent where a prototype becomes something another person can actually use.</p>
          <p>My Master of ICT capstone at Western Sydney University tested AI-generated content against human-written content in a live commerce setting. The AI content produced 165% more page views and 82% longer time on page; the work received 88/100, High Distinction.</p>
          <p>Today I’m building an interconnected portfolio: customer-facing AI products, an evolving private agent operating system, and mobile game experiments.</p>
        </div>
        <aside className="ft-now-card">
          <p className="ft-kicker">NOW</p>
          <h3>Independent AI Engineer</h3>
          <ul>
            <li>Shipping UNIKRE and What Was Drawn</li>
            <li>Developing Ninja Clan on Hermes</li>
            <li>Testing Boba Rush on iOS</li>
            <li>Completing the ACS Professional Year</li>
          </ul>
          <button type="button" className="ft-text-link ft-inline-button" onClick={onResume}>View résumé ↗</button>
        </aside>
      </section>

      <section className="ft-section ft-shell">
        <div className="ft-section-heading compact">
          <p className="ft-kicker">EVOLUTION OF AN AGENT SYSTEM</p>
          <h2>Ninja Butler became Ninja Clan.</h2>
          <p>What began as a local assistant on a repurposed iMac became a dependable private operating system. Each migration solved a real constraint: local experimentation, always-on availability, safer routing, and finally a wider clan of specialised agents.</p>
        </div>
        <div className="ft-timeline">
          <div><span>01 · LOCAL FOUNDATION</span><strong>A Linux iMac</strong><p>A retired iMac was converted into an always-available Linux machine: the first private home for experiments, bots, and automation.</p></div>
          <div><span>02 · FIRST ASSISTANT</span><strong>Ninja Butler on OpenClaw</strong><p>A Telegram-first assistant connected conversations, memory, daily operations, and early automation into one working system.</p></div>
          <div><span>03 · INFRASTRUCTURE</span><strong>Moved to a Linux VPS</strong><p>The runtime migrated to Hetzner for reliable 24/7 operation, systemd services, persistent logs, SSH boundaries, and remote access.</p></div>
          <div><span>04 · CURRENT SYSTEM</span><strong>Hermes and Ninja Clan</strong><p>OpenClaw gave way to Hermes, while Butler grew into specialised agents spanning tasks, email, calendar, research, memory, and Mac build workers.</p></div>
        </div>
      </section>

      <section className="ft-section ft-shell">
        <div className="ft-section-heading compact"><p className="ft-kicker">CORE CAPABILITIES</p><h2>Depth with range.</h2></div>
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
        <p className="ft-hero-copy">Field notes on AI models, product experiments, creative engineering, and the strange decisions behind building technology with a point of view.</p>
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

  const navigateToSection = (id) => {
    const nextHash = `#${id}`
    if (window.location.hash !== nextHash) window.history.pushState(null, '', nextHash)
    scrollToSection(id)
  }

  useEffect(() => {
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
    }
  }, [])

  return (
    <>
      <div className="fast-track-site" inert={resumeOpen || coreOpen ? true : undefined} aria-hidden={resumeOpen || coreOpen || undefined}>
        <div className="ft-scroll-progress" aria-hidden style={{ transform: `scaleX(${scrollProgress})` }} />
        <a className="ft-skip" href="#content">Skip to content</a>
        <SiteHeader activeSection={activeSection} onNavigate={navigateToSection} onResume={() => setResumeOpen(true)} />
        <main id="content">
          <CoreMemoriesSection onLaunch={() => setCoreOpen(true)} />
          <WorkSections />
          <AboutSections onResume={() => setResumeOpen(true)} />
          <WritingSections />
        </main>
        <a
          className={`ft-back-top ${scrollProgress > 0.06 ? 'visible' : ''}`}
          href="#core-memories"
          aria-label="Back to the top"
          onClick={(event) => {
            event.preventDefault()
            navigateToSection('core-memories')
          }}
        >↑ <span>Top</span></a>
        <Footer />
      </div>
      {resumeOpen && <ResumePanel onClose={() => setResumeOpen(false)} />}
      {coreOpen && <CoreMemoriesModal onClose={() => setCoreOpen(false)} />}
    </>
  )
}
