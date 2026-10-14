import { useRef } from 'react'

function GuideSteps({ steps, className = '' }) {
  return <ol className={`pf-guide-steps ${className}`}>
    {steps.map((step, index) => <li key={step.title}>
      <span className="pf-guide-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><h4>{step.title}</h4><p>{step.text}</p></div>
    </li>)}
  </ol>
}

export default function ProjectGuide({ project, children }) {
  const demoRef = useRef(null)
  const workflowRef = useRef(null)
  const builtRef = useRef(null)
  const { guide } = project
  const hasVideo = Boolean(project.demo?.src)
  const previewLabel = hasVideo ? (project.id === 'steeped' ? 'Recorded gameplay' : 'Demo video') : project.audioPreview ? 'Scene & audio preview' : 'Interface preview'
  const jumpTo = ref => {
    ref.current?.focus({ preventScroll: true })
    ref.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  return <div className="pf-project-guide">
    <nav className="pf-guide-nav" aria-label={`${project.title} guide sections`}>
      <button type="button" onClick={() => jumpTo(demoRef)}>{previewLabel} <span aria-hidden="true">↓</span></button>
      <button type="button" onClick={() => jumpTo(workflowRef)}>How it works <span aria-hidden="true">↓</span></button>
      <button type="button" onClick={() => jumpTo(builtRef)}>What I built <span aria-hidden="true">↓</span></button>
    </nav>

    <section className="pf-guide-section" aria-labelledby={`${project.id}-guide-demo`}>
      <h3 id={`${project.id}-guide-demo`} ref={demoRef} tabIndex={-1}>{previewLabel}</h3>
      <p>{guide.demo.intro}</p>
      {children}
      {project.links.live && <a className="pf-guide-preview-link" href={project.links.live} target="_blank" rel="noopener noreferrer">{project.id === 'landlit' ? 'Open the fictional-data demo' : project.id === 'princess-of-alemio' ? 'Explore the editions at ONQST' : project.id === 'steeped' ? 'Explore the development site' : 'Try the web app'} <span aria-hidden="true">↗</span></a>}
      {hasVideo && <><h4 className="pf-guide-walkthrough-title">What to notice</h4><GuideSteps steps={guide.demo.steps} /></>}
    </section>

    <section className="pf-guide-section" aria-labelledby={`${project.id}-guide-built`}>
      <h3 id={`${project.id}-guide-built`} ref={builtRef} tabIndex={-1}>What I built</h3>
      <dl className="pf-guide-built">{guide.built.map(item => <div key={item.area}><dt>{item.area}</dt><dd>{item.text}</dd></div>)}</dl>
    </section>

    <section className="pf-guide-section" aria-labelledby={`${project.id}-guide-workflow`}>
      <h3 id={`${project.id}-guide-workflow`} ref={workflowRef} tabIndex={-1}>How it works</h3>
      <GuideSteps steps={guide.workflow} />
      <details className="pf-guide-technical">
        <summary>Explore the technical details</summary>
        <div>{guide.technical.map(item => <section key={item.title}><h4>{item.title}</h4><p>{item.text}</p></section>)}</div>
      </details>
    </section>

    <section className="pf-guide-section pf-guide-evidence" aria-label="Decisions, evidence and current stage">
      <dl className="pf-case-facts">
        <div><dt>A decision that mattered</dt><dd>{project.caseStudy.decision}</dd></div>
        <div><dt>Evidence</dt><dd>{project.caseStudy.evidence}</dd></div>
        <div><dt>Where it stands</dt><dd>{guide.status}</dd></div>
      </dl>
    </section>
  </div>
}
