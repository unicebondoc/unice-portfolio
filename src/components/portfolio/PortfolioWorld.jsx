import { useRef, useState } from 'react'
import { PROJECTS } from '../../data/projects'
import '../../styles/portfolio-world.css'

const WORLD_LAYOUT = [
  { id: 'flatsync', x: 20, y: 35, mobileX: 25, mobileY: 23, chapter: '01', kind: 'Household app', orb: 'flatsync', memory: 'A home that works together.' },
  { id: 'landlit', x: 43, y: 24, mobileX: 74, mobileY: 23, chapter: '02', kind: 'Property systems', orb: 'landlit', memory: 'Bringing scattered records into focus.' },
  { id: 'what-was-drawn', x: 74, y: 32, mobileX: 25, mobileY: 50, chapter: '03', kind: 'Reflection companion', orb: 'what-was-drawn', memory: 'A moment to pause. A space to reflect.' },
  { id: 'steeped', x: 26, y: 70, mobileX: 74, mobileY: 50, chapter: '04', kind: 'Tea & focus game', orb: 'steeped', memory: 'A quieter world, one cup at a time.' },
  { id: 'princess-of-alemio', x: 58, y: 72, mobileX: 25, mobileY: 77, chapter: '05', kind: 'Story world', orb: 'alemio', memory: 'A story becomes somewhere you can go.' },
  { id: 'core-memories', x: 84, y: 66, mobileX: 74, mobileY: 77, chapter: '06', kind: 'Interactive forest', orb: 'core-memories', memory: 'The longer story, hidden among the trees.' },
]

const WORLDS = WORLD_LAYOUT.map((layout) => ({ ...PROJECTS.find((project) => project.id === layout.id), ...layout }))

const FIRELIGHTS = Array.from({ length: 14 }, (_, index) => ({
  x: 8 + ((index * 23) % 85),
  y: 16 + ((index * 17) % 73),
  delay: `${(index % 6) * -1.7}s`,
  duration: `${6 + (index % 5)}s`,
}))

function Compass() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="currentColor" opacity=".4" />
      <circle cx="24" cy="24" r="15" stroke="currentColor" opacity=".15" />
      <path d="m24 6 5 18-5 18-5-18Z" fill="currentColor" opacity=".75" />
      <path d="m6 24 18-4 18 4-18 4Z" fill="currentColor" opacity=".35" />
      <circle cx="24" cy="24" r="2.5" fill="#071622" />
    </svg>
  )
}

function WayfinderCat() {
  const [showArtwork, setShowArtwork] = useState(true)
  if (showArtwork) return <img src="/world/tyche-guide.webp" alt="" width="120" height="120" onError={() => setShowArtwork(false)} />
  return (
    <svg viewBox="0 0 72 66" fill="none" aria-hidden="true">
      <ellipse cx="35" cy="59" rx="27" ry="4" fill="currentColor" opacity=".2" />
      <path d="M44 41c11-7 16-3 18 3 3 11-8 15-13 8" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M14 32 17 12l12 11 12-10 7 20c4 9 2 17-6 21-6 3-16 3-22-1-8-5-9-13-6-21Z" fill="currentColor" />
      <path d="m20 24 1-6 5 6M34 25l6-7 2 8" fill="#b1eff5" opacity=".65" />
      <ellipse cx="25" cy="36" rx="2.3" ry="3" fill="#072938" />
      <ellipse cx="37" cy="36" rx="2.3" ry="3" fill="#072938" />
      <path d="m29 42 2 2 2-2" stroke="#072938" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M23 52v5m15-5v5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function WorldPaths({ explored, selectedId, mobile = false }) {
  const origin = mobile ? { x: 49, y: 91 } : { x: 51, y: 89 }
  return (
    <svg className={`pw-paths ${mobile ? 'pw-paths-mobile' : 'pw-paths-desktop'}`} viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none" aria-hidden="true">
      {WORLDS.map((world) => {
        const x = mobile ? world.mobileX : world.x
        const y = mobile ? world.mobileY : world.y
        const d = `M${origin.x * 10} ${origin.y * 10} Q${(origin.x + x) * 5} ${(y + 15) * 10} ${x * 10} ${y * 10}`
        return (
          <g key={world.id} className={`${explored.includes(world.id) ? 'is-explored' : ''} ${selectedId === world.id ? 'is-selected' : ''}`} style={{ '--pw-world-color': world.color }}>
            <path className="pw-path-glow" d={d} vectorEffect="non-scaling-stroke" />
            <path className="pw-path-line" d={d} vectorEffect="non-scaling-stroke" />
          </g>
        )
      })}
      <circle className="pw-path-origin" cx={origin.x * 10} cy={origin.y * 10} r="5" />
    </svg>
  )
}

export default function PortfolioWorld({ onCaseStudy, onForest, onResume }) {
  const [selectedId, setSelectedId] = useState(null)
  const [explored, setExplored] = useState([])
  const portalRefs = useRef([])
  const selected = WORLDS.find((world) => world.id === selectedId)

  const selectWorld = (id) => {
    setSelectedId(id)
    setExplored((previous) => previous.includes(id) ? previous : [...previous, id])
  }

  const navigatePortals = (event, currentIndex) => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    const mobile = window.matchMedia('(max-width: 700px)').matches
    const current = WORLDS[currentIndex]
    const xKey = mobile ? 'mobileX' : 'x'
    const yKey = mobile ? 'mobileY' : 'y'
    const nearest = WORLDS.map((world, index) => {
      const dx = world[xKey] - current[xKey]
      const dy = world[yKey] - current[yKey]
      const forward = dx * direction[0] + dy * direction[1]
      const sideways = Math.abs(dx * direction[1] - dy * direction[0])
      return { index, forward, distance: Math.hypot(dx, dy) + sideways * 1.5 }
    }).filter((world) => world.forward > 0).sort((a, b) => a.distance - b.distance)[0]
    if (nearest) portalRefs.current[nearest.index]?.focus()
  }

  return (
    <section id="intro" className="pw-world ft-scroll-section" aria-labelledby="pw-title" style={{ '--pw-active-color': selected?.color ?? '#7eddf2' }}>
      <div className="pw-identity ft-shell">
        <img className="pw-portrait" src="/profile-unice-approved.webp" alt="Unice Bondoc" width="72" height="72" fetchPriority="high" />
        <div className="pw-identity-copy">
          <strong>Unice Bondoc</strong>
          <p>Software Developer <span aria-hidden="true">|</span> AI Automation, Apps & Games</p>
          <span>Founder of ONQST · Sydney</span>
        </div>
        <a className="pw-team-link" href="#experience"><span className="pw-status-light" aria-hidden="true" /><span>Building with an ACS team<small>Explore my experience ↗</small></span></a>
      </div>

      <div className="pw-opening ft-shell">
        <div>
          <p className="pw-eyebrow">THE LIVING ARCHIVE · UNICE BONDOC</p>
          <h1 id="pw-title">Welcome to <em>my world.</em></h1>
          <p className="pw-introduction">Useful apps, connected systems, and stories you can step inside.<br className="pw-desktop-break" /> Every glowing memory holds a world I’m building.</p>
        </div>
        <div className="pw-direct-links">
          <button className="pw-action" type="button" onClick={onResume}><span aria-hidden="true">◇</span> View my CV</button>
          <a href="#work">View all work <span aria-hidden="true">↓</span></a>
        </div>
      </div>

      <div className="pw-map-shell">
        <div className={`pw-map ${selected ? 'has-memory-selected' : ''}`} aria-label="The Living Archive, an interactive forest of six project memories">
          <img className="pw-forest-image" src="/world/memory-grove.webp" alt="" width="1672" height="941" fetchPriority="high" onError={(event) => { if (!event.currentTarget.dataset.fallback) { event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = '/background-optimized.jpg' } }} />
          <div className="pw-map-vignette" aria-hidden="true" />
          <div className="pw-map-hud">
            <div className="pw-location"><Compass /><div><span>THE MEMORY GROVE</span><small>Six worlds. One curious builder.</small></div></div>
            <div className="pw-exploration" aria-label={`${explored.length} of 6 memories explored this visit`}><span>{String(explored.length).padStart(2, '0')}<i> / 06</i></span><small>MEMORIES EXPLORED</small><div className="pw-progress" aria-hidden="true">{WORLDS.map((world) => <span key={world.id} className={explored.includes(world.id) ? 'is-explored' : ''} />)}</div></div>
          </div>

          <WorldPaths explored={explored} selectedId={selectedId} />
          <WorldPaths explored={explored} selectedId={selectedId} mobile />
          <div className="pw-firelights" aria-hidden="true">{FIRELIGHTS.map((light, index) => <span key={index} style={{ left: `${light.x}%`, top: `${light.y}%`, animationDelay: light.delay, animationDuration: light.duration }} />)}</div>

          <div className="pw-portals" role="group" aria-label="Choose a project world" aria-describedby="pw-map-instructions">
            {WORLDS.map((world, index) => (
              <button
                type="button"
                key={world.id}
                ref={(element) => { portalRefs.current[index] = element }}
                className={`pw-portal ${selectedId === world.id ? 'is-selected' : ''} ${explored.includes(world.id) ? 'is-explored' : ''}`}
                style={{ '--pw-x': `${world.x}%`, '--pw-y': `${world.y}%`, '--pw-mobile-x': `${world.mobileX}%`, '--pw-mobile-y': `${world.mobileY}%`, '--pw-world-color': world.color }}
                aria-label={`${world.title} — ${world.kind}`}
                aria-pressed={selectedId === world.id}
                aria-controls="pw-world-details"
                onClick={() => selectWorld(world.id)}
                onKeyDown={(event) => navigatePortals(event, index)}
              >
                <span className="pw-portal-orbit" aria-hidden="true" />
                <span className="pw-portal-window"><img src={`/world/orb-${world.orb}.webp`} alt="" loading="eager" width="240" height="240" className="pw-memory-object" onError={(event) => { if (!event.currentTarget.dataset.fallback) { event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = world.image; event.currentTarget.classList.add('pw-memory-fallback') } }} /><span className="pw-portal-sheen" aria-hidden="true" /></span>
                <span className="pw-portal-chapter" aria-hidden="true">{explored.includes(world.id) ? '✓' : world.chapter}</span>
                <span className="pw-portal-label"><strong>{world.title}</strong><small>{world.kind}</small></span>
              </button>
            ))}
          </div>

          <div className={`pw-wayfinder ${selected ? 'has-destination' : ''}`} style={{ '--pw-cat-x': `${selected ? selected.x < 50 ? selected.x + 13 : selected.x - 13 : 45}%`, '--pw-cat-y': `${selected ? selected.y < 50 ? selected.y + 10 : selected.y + 2 : 86}%`, '--pw-cat-mobile-x': '49%', '--pw-cat-mobile-y': `${selected?.mobileY ?? 88}%`, '--pw-cat-color': selected?.color ?? '#7eddf2' }} aria-hidden="true"><WayfinderCat /></div>
          <div className={`pw-map-footer ${selected ? 'has-open-memory' : ''}`}><p id="pw-map-instructions"><span className="pw-instruction-spark" aria-hidden="true">✧</span> {selected ? selected.memory : 'Choose a memory. Follow your curiosity.'}</p>{selected ? <a className="pw-open-memory" href="#pw-world-details" aria-label={`Open ${selected.title} memory details`}>Open this memory <span aria-hidden="true">↓</span></a> : <span className="pw-keyboard-note">Tab to explore · Enter to select</span>}</div>
        </div>
      </div>

      <div className="pw-details-wrap ft-shell">
        <p className="sr-only" role="status">{selected ? `${selected.title} selected. Project details follow the map. ${explored.length} of 6 worlds explored.` : 'Choose any project. All case studies and the CV are also available through direct links.'}</p>
        {selected ? (
          <article key={selected.id} id="pw-world-details" className="pw-details is-selected" style={{ '--pw-world-color': selected.color }} aria-labelledby="pw-detail-title">
            <div className="pw-detail-art"><img src={selected.image} alt={selected.imageAlt} width="680" height="450" className={`pw-detail-${selected.imageKind || 'wide'}`} /><span>WORLD {selected.chapter} <span aria-hidden="true">/</span> {selected.kind}</span></div>
            <div className="pw-detail-copy">
              <p className="pw-detail-kicker">{selected.subtitle}</p>
              <h2 id="pw-detail-title">{selected.title}</h2>
              <p className="pw-detail-purpose">{selected.description}</p>
              <div className="pw-detail-facts"><div><h3>My contribution</h3><p>{selected.caseStudy.contribution}</p></div><div><h3>Where it stands</h3><p>{selected.caseStudy.result}</p></div></div>
              <ul className="pw-stack" aria-label="Tools and technologies">{selected.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              <div className="pw-detail-actions"><button className="pw-action primary" type="button" onClick={() => selected.id === 'core-memories' ? onForest() : onCaseStudy(selected.id)}>{selected.id === 'core-memories' ? 'Enter the 3D forest' : 'View case study'} <span aria-hidden="true">↗</span></button><a href="#work">Browse every project ↓</a></div>
            </div>
          </article>
        ) : (
          <div id="pw-world-details" className="pw-details pw-details-empty">
            <span className="pw-empty-compass"><Compass /></span>
            <div><p className="pw-eyebrow">YOUR NEXT DISCOVERY</p><h2>Open a memory. Discover a world.</h2><p>Each one reveals a real project, my contribution and where the work stands today.</p></div>
            <a href="#work">Go straight to the case studies <span aria-hidden="true">↗</span></a>
          </div>
        )}
      </div>
    </section>
  )
}
