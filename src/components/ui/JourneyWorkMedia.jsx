import { PROJECTS } from '../../data/projects.js'
import { forestTarget } from '../../data/forestNavigation.js'
import '../../styles/journey-work-media.css'

const PORTRAIT = '/profile-unice-approved.webp'
const PROJECT_ORDER = ['what-was-drawn', 'flatsync', 'landlit', 'steeped', 'princess-of-alemio', 'causeconnect']
const IMAGE_SIZES = {
  'what-was-drawn': [1280, 720],
  flatsync: [1170, 2532],
  landlit: [1440, 1841],
  steeped: [1280, 720],
  'princess-of-alemio': [1672, 941],
  causeconnect: [1280, 1606]
}

function JourneyLink({ target, navigate, className, children, ...props }) {
  const follow = event => {
    if (typeof navigate !== 'function' || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(target)
  }
  return <a href={forestTarget(target)} onClick={follow} className={className} {...props}>{children}</a>
}

function ProjectImage({ project, className = '' }) {
  const [width, height] = IMAGE_SIZES[project.id]
  return <img className={className} src={project.image} alt={project.imageAlt} width={width} height={height} loading="lazy" decoding="async" />
}

function ProjectsSpread({ navigate }) {
  const projects = PROJECT_ORDER.map(id => PROJECTS.find(project => project.id === id)).filter(Boolean)
  return <div className="jwm jwm-projects">
    <div className="jwm-project-spread">
      {projects.map(project => <JourneyLink key={project.id} target={{ kind: 'project', id: project.id }} navigate={navigate} className={`jwm-project jwm-project-${project.id}`} style={{ '--jwm-accent': project.color }}>
        <span className={`jwm-preview jwm-preview-${project.imageKind || 'wide'}`}><ProjectImage project={project} /></span>
        <span className="jwm-project-label"><strong>{project.title}</strong><span aria-hidden="true">↗</span></span>
        <span className="jwm-stage">{project.subtitle}</span>
      </JourneyLink>)}
    </div>
  </div>
}

function NowSpread({ navigate }) {
  const causeconnect = PROJECTS.find(project => project.id === 'causeconnect')
  return <div className="jwm jwm-now">
    <div className="jwm-now-spread">
      <div className="jwm-now-portrait">
        <img src={PORTRAIT} alt="Unice Bondoc wearing a taupe blazer, pearl earrings and diamond pendant" width="768" height="768" loading="lazy" decoding="async" />
      </div>
      <div className="jwm-work-strands">
        <a href="https://onqst.com/" target="_blank" rel="noopener noreferrer" className="jwm-studio-strand">
          <strong className="jwm-studio-name">ONQST</strong>
          <span className="jwm-strand-role">Founder &amp; Builder</span>
          <span className="jwm-stage">Personal product work</span>
          <span className="jwm-strand-action">Visit ONQST <span aria-hidden="true">↗</span></span>
        </a>
        {causeconnect && <JourneyLink target={{ kind: 'project', id: causeconnect.id }} navigate={navigate} className="jwm-team-strand" style={{ '--jwm-accent': causeconnect.color }}>
          <span className="jwm-strand-label">Selected experience</span>
          <strong className="jwm-team-name">{causeconnect.title}</strong>
          <span className="jwm-strand-role">Developer / Programmer</span>
          <span className="jwm-stage">React · Node.js/Express · MySQL</span>
          <span className="jwm-strand-action">My contribution <span aria-hidden="true">↗</span></span>
        </JourneyLink>}
      </div>
    </div>
  </div>
}

export default function JourneyWorkMedia({ kind, navigate }) {
  if (kind === 'projects') return <ProjectsSpread navigate={navigate} />
  if (kind === 'now') return <NowSpread navigate={navigate} />
  return null
}
