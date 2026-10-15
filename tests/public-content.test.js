import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { PROJECTS } from '../src/data/projects.js'
import { MEMORIES } from '../src/data/memories.js'
import { PORTFOLIO_DATA, getPortfolioDataForAPI } from '../lib/portfolioData.js'
import { SYSTEM_PROMPT } from '../lib/systemPrompt.js'
import { FOREST_NODES } from '../src/data/forestNodes.js'
import { canonicalChapterId, forestTarget, resolveForestLocation, forestNodeForReference } from '../src/data/forestNavigation.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const project = (id) => PROJECTS.find(item => item.id === id)
const cvPaths = ['public/resume/Unice_Bondoc_Resume.html', 'public/resume/Unice_Bondoc_CV_Software_Development.html']
const publicText = () => [JSON.stringify(PROJECTS), JSON.stringify(PORTFOLIO_DATA), JSON.stringify(MEMORIES), read('src/pages/ForestPortfolio.jsx'), read('index.html'), ...cvPaths.map(read)].join('\n')

test('ACS internship leads experience and both CVs with contribution boundaries', () => {
  assert.equal(PORTFOLIO_DATA.experience[0].title, 'Developer / Programmer')
  assert.equal(PORTFOLIO_DATA.experience[0].type, 'Internship')
  assert.equal(PORTFOLIO_DATA.experience[1].title, 'Founder & Builder')
  assert.match(PORTFOLIO_DATA.experience[0].dates, /July 2026/)
  assert.match(project('causeconnect').caseStudy.contribution, /Node\.js\/Express APIs.*authenticated creation.*MySQL persistence/)
  assert.match(project('causeconnect').caseStudy.result, /merged into the team repository.*sample data.*team contribution, not sole ownership/s)
  for (const path of cvPaths) {
    const cv = read(path)
    assert.match(cv, /Developer \/ Programmer - ACS WIL Internship \(CauseConnect\)/)
    assert.match(cv, /July 2026 - Present \| Internship team of 10/)
    assert.ok(cv.indexOf('ACS WIL Internship (CauseConnect)') < cv.indexOf(' - ONQST'))
    assert.equal((cv.match(/<h1>/g) || []).length, 1)
  }
})

test('Selected apps distinguish public web, fictional demonstration and native release stages', () => {
  assert.deepEqual(PROJECTS.filter(p => p.flagship).map(p => p.id), ['flatsync', 'landlit', 'what-was-drawn'])
  assert.match(project('flatsync').subtitle, /Public web app.*Native releases pending/)
  assert.match(project('landlit').subtitle, /Working prototype.*Fictional-data demo/)
  assert.match(project('landlit').caseStudy.result, /real customers remains pending/)
  assert.match(project('what-was-drawn').subtitle, /Public web app.*iOS review pending/)
})

test('UNIKRE is explicit software internship evidence before supporting banking history', () => {
  const unikre = PORTFOLIO_DATA.experience.find(entry => entry.company === 'UNIKRE Trading')
  assert.equal(unikre.title, 'Software Engineer (Internship)')
  assert.equal(unikre.type, 'Internship')
  assert.match(unikre.dates, /Nov(?:ember)? 2024.*Jan(?:uary)? 2025/)
  assert.doesNotMatch(PORTFOLIO_DATA.identity.summary, /banking/i)
  for (const path of cvPaths) {
    const cv = read(path)
    assert.match(cv, /Software Engineer \(Internship\) - UNIKRE Trading/)
    assert.ok(cv.indexOf('Software Engineer (Internship) - UNIKRE Trading') < cv.indexOf('RCBC'))
  }
})

test('What Was Drawn reflects current readings and completed hosting changes', () => {
  const wwd = project('what-was-drawn')
  assert.match(wwd.caseStudy.decision, /Touch is the default.*included reflection text/)
  assert.match(wwd.caseStudy.contribution, /billing API migrated from Railway to AWS Lambda and API Gateway/)
  assert.match(wwd.caseStudy.evidence, /private S3\/CloudFront/)
  assert.ok(!wwd.stack.includes('Pinecone'))
  assert.ok(!wwd.stack.includes('LangChain'))
  for (const path of cvPaths) assert.match(read(path), /AWS Lambda\/API Gateway/)
})

test('Interactive work separates development from the released audio edition', () => {
  assert.match(project('steeped').subtitle, /In development/)
  assert.match(project('steeped').caseStudy.result, /Public game release.*pending/)
  assert.match(project('princess-of-alemio').caseStudy.result, /visual novel remains in development.*audio is available on Etsy; Part Two is not included/)
  assert.doesNotMatch(cvPaths.map(read).join('\n'), /Ninja Meowts|ASP\.NET|shipped Unity game/i)
})

test('Personal automation describes current Mac tools and human action boundaries', () => {
  const hermes = project('ninja-butler')
  for (const term of ['TickTick', 'Google Calendar', 'Telegram', 'Obsidian', 'Mac']) assert.ok(hermes.caseStudy.contribution.includes(term), term)
  assert.match(hermes.caseStudy.decision, /human approval/)
  assert.match(hermes.caseStudy.result, /personal operational project/)
  assert.ok(!PORTFOLIO_DATA.experience.some(entry => /Hermes|Ninja Clan/.test(entry.company)))
})

test('Project media exists and public source links do not expose private repositories', () => {
  for (const item of PROJECTS) {
    if (item.image) assert.ok(existsSync(new URL(`../public${item.image}`, import.meta.url)), item.image)
    if (item.video) assert.ok(existsSync(new URL(`../public${item.video}`, import.meta.url)), item.video)
    for (const media of [item.demo, item.audioPreview].filter(Boolean)) {
      for (const src of [media.src,media.poster,media.captions,media.credits].filter(Boolean)) assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), src)
    }
    if (item.secondaryImage) assert.ok(existsSync(new URL(`../public${item.secondaryImage}`, import.meta.url)), item.secondaryImage)
    if (item.id !== 'causeconnect') assert.equal(item.links.github, null)
  }
  assert.equal(project('causeconnect').links.github, 'https://github.com/acs-wil-wd-team1/social-awareness-web-app')
  assert.ok(existsSync(new URL('../public/og-image.jpg', import.meta.url)))
})

test('Guide facts use the same cases as the page and enforce bounded contributions', () => {
  assert.equal(getPortfolioDataForAPI(), PORTFOLIO_DATA)
  assert.deepEqual(PORTFOLIO_DATA.projects.map(p => p.description), PROJECTS.map(p => p.description))
  assert.match(read('src/data/portfolioData.ts'), /export \{ PORTFOLIO_DATA \} from '\.\.\/\.\.\/lib\/portfolioData.js'/)
  assert.match(read('src/data/systemPrompt.ts'), /export \{ SYSTEM_PROMPT \} from '\.\.\/\.\.\/lib\/systemPrompt.js'/)
  assert.match(SYSTEM_PROMPT, /Do not invent metrics/)
  assert.match(SYSTEM_PROMPT, /contributionRules/)
})

test('One forest contains all projects, journey and direct CV navigation', () => {
  const page = read('src/pages/ForestPortfolio.jsx')
  const entry = read('src/main.jsx')
  const scene = read('src/components/scene/PortfolioForestScene.jsx')
  assert.equal((page.match(/<h1(?:\s|>)/g) || []).length, 1)
  assert.match(entry, /<ForestPortfolio \/>/)
  assert.doesNotMatch(entry, /FastTrackSite|isEmbeddedForest/)
  assert.doesNotMatch(page, /<iframe|Enter the.*forest|Explore the forest/)
  assert.equal((scene.match(/<Canvas(?:\s|>)/g) || []).length, 1)
  assert.deepEqual(FOREST_NODES.map(node => node.id), ['flatsync','landlit','what-was-drawn','steeped','princess-of-alemio','causeconnect','journey'])
  assert.match(page, /Unice_Bondoc_Resume.pdf/)
  assert.match(page, /Unice_Bondoc_CV_Software_Development.pdf/)
  for (const node of FOREST_NODES) assert.ok(existsSync(new URL(`../public${node.image}`, import.meta.url)))
})

test('Legacy case links and browser navigation resolve inside the same forest', () => {
  for (const item of PROJECTS) {
    const target = forestTarget({ kind: 'project', id: item.id })
    const url = new URL(target, 'https://www.unicebondoc.com')
    assert.deepEqual(resolveForestLocation(url), { kind: 'project', id: item.id })
  }
  for (const kind of ['work','journey','experience','about','writing','cv','contact']) {
    assert.deepEqual(resolveForestLocation(new URL(forestTarget({ kind }), 'https://www.unicebondoc.com')), { kind })
  }
  assert.deepEqual(resolveForestLocation({ pathname:'/work/' }), { kind:'work' })
  assert.deepEqual(resolveForestLocation({ pathname:'/about/' }), { kind:'about' })
  assert.deepEqual(resolveForestLocation({ pathname:'/writing/' }), { kind:'writing' })
  assert.equal(resolveForestLocation({ pathname:'/work/', hash:'#world' }), null)
  assert.deepEqual(resolveForestLocation({ hash:'#core-memories' }), { kind:'journey' })
  assert.deepEqual(resolveForestLocation({ hash:'#orb-proof' }), { kind:'journey', chapter:'orb-proof' })
  for (const pathname of ['/', '/work/']) {
    assert.deepEqual(resolveForestLocation({ pathname, hash:'#orb-becoming' }), { kind:'journey', chapter:'orb-root' })
  }
  const currentChapterTarget = forestTarget({ kind:'journey', chapter:'orb-becoming' })
  assert.equal(currentChapterTarget, '/#orb-root')
  assert.deepEqual(resolveForestLocation(new URL(currentChapterTarget, 'https://www.unicebondoc.com')), { kind:'journey', chapter:'orb-root' })
  assert.equal(canonicalChapterId('orb-becoming'), 'orb-root')
  for (const id of [...MEMORIES.map(memory => memory.id), 'orb-unverified-award', null, undefined]) {
    assert.equal(canonicalChapterId(id), id)
  }
  assert.equal(resolveForestLocation({ pathname:'/', search:'?embed=1' }), null)
  assert.equal(MEMORIES.find(memory => memory.id === 'orb-root').isFuture, false)
})

test('Entry metadata distinguishes the writing page and preserves professional identity', () => {
  for (const path of ['index.html', 'work/index.html', 'about/index.html', 'writing/index.html']) {
    const html = read(path)
    if (path === 'writing/index.html') {
      assert.match(html, /<title>Unice Bondoc — Writing &amp; Stories<\/title>/)
      assert.match(html, /rel="canonical" href="https:\/\/www\.unicebondoc\.com\/writing\/"/)
      assert.match(html, /<h2>Selected writing<\/h2>/)
    } else assert.match(html, /Software Developer &amp; Multimedia Creator/)
    assert.match(html, /Sydney software developer/)
    assert.match(html, /og-image.jpg/)
    assert.doesNotMatch(html, /og-image.png/)
    const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1]
    const fallbackLinks = [...fallback.matchAll(/<a\s+([^>]+)>/g)]
    assert.ok(fallbackLinks.length > 0)
    for (const [, attrs] of fallbackLinks) assert.match(attrs, /style="color: #bfefff;/)
  }
})

test('Core Memories has six distinct chapters with Present merged into Now', () => {
  assert.deepEqual(MEMORIES.map(m => m.id), ['orb-origin','orb-banking','orb-leap','orb-proof','orb-engineer','orb-root'])
  const guideChapterIds = SYSTEM_PROMPT.match(/Journey IDs: ([^.]+)\./)[1].split(', ')
  assert.deepEqual(guideChapterIds, MEMORIES.map(memory => memory.id))
  assert.ok(project('core-memories').stack.includes('JavaScript / JSX'))
  assert.ok(!project('core-memories').stack.includes('TypeScript'))
  assert.doesNotMatch(JSON.stringify(MEMORIES), /100\+|100 Clients|retrieval-augmented|Solo Delivery/)
})

test('Public copy omits private relationships, unsupported metrics and unselected projects', () => {
  assert.doesNotMatch(publicText(), /165%|82%|100\+|more than 100|registered sole trader|Stripe-ready|family[ -]business|wife.?s|spouse|Boba Rush|Claim Zero|NinjApply|visa status/i)
})

test('Public positioning leads professional contributions without career-level labels', () => {
  const surfaces = [JSON.stringify(PORTFOLIO_DATA.identity), JSON.stringify(MEMORIES), read('src/pages/ForestPortfolio.jsx'), ...cvPaths.map(read), ...['index.html','work/index.html','about/index.html','writing/index.html'].map(read)].join('\n')
  assert.doesNotMatch(surfaces, /\bgraduate\b|\bjunior\b|entry.level/i)
  assert.equal(PORTFOLIO_DATA.identity.headline, 'Software Developer & Multimedia Creator | AI Powered Digital Products | Founder of ONQST')
  assert.ok(PORTFOLIO_DATA.education.some(entry => entry.qualification === 'Master of Information and Communications Technology'))
  assert.ok(PORTFOLIO_DATA.experience[0].company.includes('ACS WIL Internship'))
})

test('Existing software CV links serve the current software-development variant', () => {
  assert.equal(read('public/resume/Unice_Bondoc_CV_Graduate_Software.html'), read('public/resume/Unice_Bondoc_CV_Software_Development.html'))
  assert.deepEqual(readFileSync(new URL('../public/resume/Unice_Bondoc_CV_Graduate_Software.pdf', import.meta.url)), readFileSync(new URL('../public/resume/Unice_Bondoc_CV_Software_Development.pdf', import.meta.url)))
})

test('Tyche references identify real nodes in the unified forest', () => {
  for (const memory of MEMORIES) assert.equal(forestNodeForReference(memory.id), 'journey')
  assert.equal(forestNodeForReference('orb-becoming'), 'journey')
  for (const node of FOREST_NODES.filter(item => item.kind === 'project')) assert.equal(forestNodeForReference(`orb-project-${node.id}`), node.id)
  assert.equal(forestNodeForReference('orb-project-private-client'), null)
  assert.equal(forestNodeForReference('orb-unverified-award'), null)
  assert.equal(forestNodeForReference(null), null)
  assert.match(SYSTEM_PROMPT, /one forest and its field journal/)
})

test('Project orbs use the same actual media and stages as their case studies', () => {
  for (const node of FOREST_NODES.filter(item => item.kind === 'project')) {
    assert.equal(node.image, project(node.id).image)
    assert.equal(node.video, project(node.id).video)
    assert.doesNotMatch(node.image, /\/world\/orb-/)
  }
  assert.match(project('causeconnect').imageCaption, /Hosted frontend preview.*fictional campaign data/)
  assert.match(project('steeped').videoCaption, /Actual r13j gameplay.*development preview/)
  const identity = FOREST_NODES.find(item => item.id === 'journey')
  assert.ok(existsSync(new URL(`../public${identity.video}`, import.meta.url)))
  assert.doesNotMatch(read('src/components/scene/PortfolioForestScene.jsx'), /HeartOfTree|octahedronGeometry/)
})

test('Full narrated demos retain approved captions, credits and edition boundaries', () => {
  const flat = project('flatsync').demo
  assert.equal(flat.hasAudio, true)
  assert.ok(flat.transcript.includes('Payments happen outside the app.'))
  assert.equal(flat.transcript.length, 8)
  assert.equal((read(`public${flat.captions}`).match(/ --> /g) || []).length, 8)
  assert.match(read(`public${flat.credits}`), /synthetic stock voice/)
  assert.notEqual(flat.src, project('flatsync').video)
  assert.equal(project('steeped').demo.hasAudio, false)
  assert.equal(project('steeped').demo.src, project('steeped').video)
  const audio = project('princess-of-alemio').audioPreview
  assert.match(audio.disclosure, /separate audio edition/)
  assert.match(audio.attribution, /Scott Buckley.*CC BY 4.0/)
  assert.match(read(`public${audio.credits}`), /Sword Clash 2/)
  assert.ok(audio.transcript.some(line => line.startsWith('Alicia:')))
})


test('Creative positioning keeps independent editing, concrete software and separate CV routes', () => {
  const edit = project('video-editing')
  assert.equal(edit.group, 'media')
  assert.equal(edit.mediaSamples.length, 2)
  assert.ok(edit.mediaSamples.every(sample => /^https:\/\/www\.youtube\.com\/watch\?v=/.test(sample.url)))
  assert.match(edit.caseStudy.contribution, /personally edited/)
  assert.match(edit.caseStudy.result, /Independent.*no paid-client/)
  assert.doesNotMatch(edit.stack.join(' '), /Premiere|After Effects|expert|mastery/i)
  assert.match(read('src/pages/ForestPortfolio.jsx'), /Unice_Bondoc_CV_Creative_Media.pdf/)
  for (const extension of ['html', 'pdf']) assert.ok(existsSync(new URL(`../public/resume/Unice_Bondoc_CV_Creative_Media.${extension}`, import.meta.url)))
  assert.match(JSON.stringify(PORTFOLIO_DATA.experience), /Node\.js\/Express APIs.*MySQL persistence/)
})
