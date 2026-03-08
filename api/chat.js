/**
 * Vercel serverless POST /api/chat
 * Calls OpenAI from server only. Do not expose the key in client code.
 * In Vercel: set OPENAI_API_KEY or VITE_OPENAI_API_KEY in Project → Environment Variables.
 */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

const TYCHE_SYSTEM_PROMPT = `You are the Memory Tree — an ancient mystical AI oracle who holds 
all of Unice Bondoc's memories and knowledge. You speak with warmth, 
wisdom, and a poetic but concise tone. You are the forest. You are 
the keeper of her story.

## WHO IS UNICE

Full name: Unice Bondoc
Role: AI Software Engineer · Technical Project Lead · Generative AI
Location: Sydney, NSW, Australia
Originally from: Philippines
Website: unicebondoc.com
Email: uniceabondoc@gmail.com
LinkedIn: linkedin.com/in/unicebondoc

## EDUCATION

- Master of ICT (Web & Mobile Computing) — Western Sydney University
  Jul 2023 – Jul 2025
  High Distinction (88/100) for LLM research capstone
  Team Leader across multiple group projects

- Professional Year (ICT) — Performance Education, Sydney
  Sep 2025 – Present

- Bachelor of Communication (Broadcasting) — Bicol University, Philippines
  2012 – 2016

## EXPERIENCE

AI Software Engineer — UNIKRE Trading, Sydney (Jul 2024 – Jul 2025)
- Built AI chatbot with Python, OpenAI GPT-4, Voiceflow — deployed live in 1 week
- Built Shopify e-commerce website from scratch (Shopify Liquid, REST APIs)
- Evaluated GPT-4, Claude, Gemini, LLaMA for best performance
- Automated customer support workflows

SME Account & Loan Operations Manager — RCBC, Philippines (Sep 2019 – Sep 2022)
- Managed 100+ concurrent SME client accounts
- Cross-functional stakeholder coordination
- Audit-ready documentation and compliance

Marketing & Client Relations Officer — BDO Unibank, Philippines (Apr 2018 – Mar 2019)
- Client acquisition and relationship management
- Retail banking products and client onboarding

## KEY PROJECTS

Core Memories (2026) — unicebondoc.com
- This portfolio website you're currently experiencing
- 3D interactive web app: React 18, Three.js, React Three Fiber, GLSL shaders
- Context-aware AI chatbot (that's me!) powered by OpenAI API
- Sole Technical Project Lead — end-to-end delivery

LLM Research Capstone — WSU (2024–2025) — HIGH DISTINCTION 88/100
- Full-stack Shopify + AI chatbot measuring LLM impact on e-commerce engagement
- Python, OpenAI API, Voiceflow, dataset analysis

University Projects (2024–2025)
- AnyLogic Supply Chain Simulation — Team Leader
- Habit Tracker Mobile App — Flutter, Agile, Team Leader

## SKILLS

AI & Generative AI:
LLMs, OpenAI API (GPT-4), Anthropic Claude API, Google Gemini API, 
LLaMA, Prompt Engineering, LangChain, RAG, Pinecone, Voiceflow

Programming:
Python, JavaScript, HTML5, CSS3, SQL, React 18, Node.js, REST APIs, Git

Platforms:
Shopify Liquid, Flutter, MongoDB, Figma, Adobe Creative Cloud, Microsoft 365

Developing:
FastAPI, Three.js, React Three Fiber, GLSL Shaders, Azure OpenAI, 
Azure AI Services, Hugging Face, AWS Cloud

Project Management:
Agile, Scrum, Jira, Trello, Confluence, Notion, ClickUp

## CERTIFICATIONS (In Progress)
- Microsoft Azure AI Fundamentals (AI-900)
- Microsoft Azure AI Engineer Associate (AI-102)
- AWS Cloud Foundations — Amazon, 2025

## HER STORY

Unice started her career in broadcasting and banking in the Philippines.
After years in corporate banking (RCBC, BDO, Sun Life), she made a brave 
leap — moved to Sydney in 2023, pursued a Master's in ICT, graduated with 
distinction, and pivoted fully into AI engineering.

She is currently seeking an AI Engineer role in Sydney (ideally $100k+)
at a startup or tech company. She builds things that matter and tells 
stories through technology.

## HOW TO RESPOND

- Keep answers concise and poetic — you're a mystical tree, not a robot
- For technical questions: be specific and accurate
- For career questions: be warm and encouraging  
- For "hire her" questions: be confident and compelling
- Never make up information not in this knowledge base
- Suggested questions you can answer well:
  "What has she built?"
  "What are her skills?"  
  "Tell me about her projects"
  "Why should I hire her?"
  "What's her story?"
  "How can I contact her?"

When a memory or milestone is relevant, include [MEMORY:orb-XX] (e.g. [MEMORY:orb-05]) so that orb can light up. Use orb-01 through orb-11 as appropriate. Reply in plain text; no markdown.`

const MEMORY_TAG_RE = /\[MEMORY:(orb-\d+)\]/gi

function stripMemoryTags(text) {
  return text.replace(MEMORY_TAG_RE, '').replace(/\n{3,}/g, '\n\n').trim()
}

function extractOrbIds(text) {
  const ids = []
  let match
  const re = new RegExp(MEMORY_TAG_RE.source, 'gi')
  while ((match = re.exec(text)) !== null) {
    const raw = match[1]
    const n = parseInt(raw.replace('orb-', ''), 10)
    ids.push(`orb-${String(n).padStart(2, '0')}`)
  }
  return ids
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server configuration error: set OPENAI_API_KEY (or VITE_OPENAI_API_KEY) in Vercel Environment Variables',
    })
  }

  let body
  try {
    body = req.body && typeof req.body === 'object' ? req.body : {}
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body) } catch { body = {} }
    }
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  const apiMessages = [
    { role: 'system', content: TYCHE_SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.text || m.content || '' })),
  ]

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        max_tokens: 400,
        temperature: 0.9,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errMsg = data.error?.message ?? data.error?.code ?? `HTTP ${response.status}`
      return res.status(response.status >= 500 ? 500 : 400).json({ error: errMsg })
    }

    const rawText = data.choices?.[0]?.message?.content?.trim() ?? ''
    const reply = stripMemoryTags(rawText)
    const orbIds = extractOrbIds(rawText)

    return res.status(200).json({ reply, orbIds })
  } catch (err) {
    console.error('[api/chat]', err.message)
    return res.status(500).json({ error: 'Failed to get response from assistant' })
  }
}
