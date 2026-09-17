import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PROJECTS } from '../src/data/projects.js'
import { MEMORIES } from '../src/data/memories.js'
import { PORTFOLIO_DATA, getPortfolioDataForAPI } from '../lib/portfolioData.js'
import { SYSTEM_PROMPT } from '../lib/systemPrompt.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Core Memories describes its actual primary implementation language', () => {
  const core = PROJECTS.find((project) => project.id === 'core-memories')
  assert.ok(core.stack.includes('JavaScript / JSX'))
  assert.ok(!core.stack.includes('TypeScript'))
})

test('Unbuilt projects are excluded from every public text source', () => {
  const surfaces = [JSON.stringify(PROJECTS), JSON.stringify(PORTFOLIO_DATA), JSON.stringify(MEMORIES),
    read('src/pages/FastTrackSite.jsx'), read('public/resume/Unice_Bondoc_Resume.html'), read('index.html')].join('\n')
  assert.doesNotMatch(surfaces, /LandLIT|Boba Rush|landlit|boba-rush|Steeped|Claim Zero/i)
})

test('Project links do not send visitors to private repositories', () => {
  assert.ok(PROJECTS.filter(project => project.id !== 'causeconnect').every(project => !project.links.github))
  assert.equal(PROJECTS.find(project => project.id === 'causeconnect').links.github, 'https://github.com/acs-wil-wd-team1/social-awareness-web-app')
  assert.equal(PORTFOLIO_DATA.projects.find(project => project.id === 'causeconnect').githubUrl, 'https://github.com/acs-wil-wd-team1/social-awareness-web-app')
  assert.match(read('src/pages/FastTrackSite.jsx'), /href=\{project.links.github\}[^>]+>View team repository/)
  assert.doesNotMatch(read('src/pages/FastTrackSite.jsx'), /github\.com\/unicebondoc\//)
})

test('AI guide uses the shared project facts and client entrypoints cannot drift', () => {
  assert.equal(getPortfolioDataForAPI(), PORTFOLIO_DATA)
  assert.deepEqual(PORTFOLIO_DATA.projects.map((project) => project.description), PROJECTS.map((project) => project.description))
  assert.match(read('src/data/portfolioData.ts'), /export \{ PORTFOLIO_DATA \} from '\.\.\/\.\.\/lib\/portfolioData.js'/)
  assert.match(read('src/data/systemPrompt.ts'), /export \{ SYSTEM_PROMPT \} from '\.\.\/\.\.\/lib\/systemPrompt.js'/)
  assert.match(SYSTEM_PROMPT, /Do not invent metrics/)
})

test('Unverified headline claims are absent from the draft public surfaces', () => {
  const surfaces = [JSON.stringify(PORTFOLIO_DATA), JSON.stringify(MEMORIES), SYSTEM_PROMPT,
    read('src/pages/FastTrackSite.jsx'), read('public/resume/Unice_Bondoc_Resume.html'), read('index.html')].join('\n')
  assert.doesNotMatch(surfaces, /165%|82%|registered sole trader|Stripe-ready|Next\.js 15|Alignerr|TestFlight/i)
})

test('Founder positioning and semantic homepage title stay aligned', () => {
  assert.match(PORTFOLIO_DATA.identity.headline, /Founder & Builder at ONQST/)
  assert.equal((read('src/pages/FastTrackSite.jsx').match(/<h1>/g) || []).length, 1)
  for (const path of ['index.html', 'work/index.html', 'about/index.html', 'writing/index.html']) {
    assert.match(read(path), /Founder & Builder \| ONQST/)
  }
})

test('Public project set does not accidentally publish additional upcoming work', () => {
  assert.deepEqual(PROJECTS.map((project) => project.id), ['what-was-drawn', 'flatsync', 'core-memories', 'unikre', 'ninja-butler', 'causeconnect'])
})
test('Lead projects and contribution boundaries follow the approved selection', () => {
  assert.deepEqual(PROJECTS.filter(p => p.flagship).map(p => p.id), ['what-was-drawn', 'flatsync', 'core-memories'])
  assert.match(PROJECTS.find(p => p.id === 'flatsync').subtitle, /In testing/)
  assert.match(PROJECTS.find(p => p.id === 'causeconnect').caseStudy.result, /teammates/)
  assert.match(PROJECTS.find(p => p.id === 'causeconnect').subtitle, /ACS internship · Developer \/ Programmer/)
  assert.match(PROJECTS.find(p => p.id === 'causeconnect').description, /team of 10/)
  assert.match(read('public/resume/Unice_Bondoc_Resume.html'), /CauseConnect - Developer \/ Programmer/)
  assert.match(read('public/resume/Unice_Bondoc_Resume.html'), /ACS internship \| Team of 10/)
  assert.match(PROJECTS.find(p => p.id === 'unikre').caseStudy.result, /My contribution/)
  assert.match(PROJECTS.find(p => p.id === 'ninja-butler').description, /current Hermes runtime is on a Mac/)
})

test('Public copy omits private UNIKRE relationships and accurately dates the internship', () => {
  const resume = read('public/resume/Unice_Bondoc_Resume.html')
  const publicText = [JSON.stringify(PROJECTS), JSON.stringify(PORTFOLIO_DATA), JSON.stringify(MEMORIES), SYSTEM_PROMPT, resume, read('src/pages/FastTrackSite.jsx'), read('index.html')].join('\n')
  assert.doesNotMatch(publicText, /family[ -]business|family commerce|wife.?s|spouse/i)
  assert.match(resume, /Jul 2026 - Present/)
  assert.match(resume, /Expected completion: Oct 2026/)
})

test('Resume explains every project before listing implementation details', () => {
  const resume = read('public/resume/Unice_Bondoc_Resume.html')
  const projects = [...resume.matchAll(/<article class="entry" data-project="([^"]+)">([\s\S]*?)<\/article>/g)]
  assert.equal(projects.length, 6)
  for (const [, name, body] of projects) {
    assert.match(body, /<p class="context">[^<]+<\/p>/, name)
    assert.ok(body.indexOf('class="context"') < body.indexOf('<ul>'), name)
  }
  assert.match(resume, /discovering and exploring social-awareness campaigns/)
  assert.doesNotMatch(resume, /more than 100|100\+|contribution-cost|money rules|source of truth/)
  assert.equal((resume.match(/<h1>/g) || []).length, 1)
})
