/**
 * Vercel serverless POST /api/chat
 * Memory Tree chatbot: system prompt + portfolio JSON + rolling summary + last 10 messages.
 * Set OPENAI_API_KEY or VITE_OPENAI_API_KEY in Vercel Environment Variables.
 */

import { SYSTEM_PROMPT } from '../lib/systemPrompt.js'
import { getPortfolioDataForAPI } from '../lib/portfolioData.js'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'
const MAX_RECENT_MESSAGES = 10

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

function buildRollingSummaryPrompt(existingSummary, oldMessages) {
  const recentBlock = oldMessages.map((m) => `${m.role}: ${m.content || m.text || ''}`).join('\n')
  return `Summarize this conversation in 2-3 concise sentences.
Keep only relevant context about what the visitor asked regarding Unice Bondoc, her work, projects, skills, story, or contact details.
Do not add any new facts.
Do not include off-topic details.

${existingSummary ? `Previous summary: ${existingSummary}` : ''}

Recent messages:
${recentBlock}`.trim()
}

async function generateRollingSummary(apiKey, existingSummary, oldMessages) {
  const prompt = buildRollingSummaryPrompt(existingSummary, oldMessages)
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.3,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim()
  return text || null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error:
        'Server configuration error: set OPENAI_API_KEY (or VITE_OPENAI_API_KEY) in Vercel Environment Variables',
    })
  }

  let body
  try {
    body = req.body && typeof req.body === 'object' ? req.body : {}
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body)
      } catch {
        body = {}
      }
    }
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { messages, conversationSummary: existingSummary } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  const conversationHistory = messages.map((m) => ({
    role: m.role,
    content: m.text || m.content || '',
  }))

  let rollingSummary = existingSummary || null
  if (conversationHistory.length > MAX_RECENT_MESSAGES) {
    const oldMessages = conversationHistory.slice(0, -MAX_RECENT_MESSAGES)
    rollingSummary = await generateRollingSummary(apiKey, existingSummary || null, oldMessages)
  }

  const systemContent = [
    SYSTEM_PROMPT,
    '',
    'PORTFOLIO KNOWLEDGE:',
    JSON.stringify(getPortfolioDataForAPI(), null, 2),
    rollingSummary ? `\nCONVERSATION SUMMARY SO FAR:\n${rollingSummary}` : '',
  ]
    .join('\n')
    .trim()

  const recentMessages = conversationHistory.slice(-MAX_RECENT_MESSAGES)
  const apiMessages = [
    { role: 'system', content: systemContent },
    ...recentMessages.map((m) => ({ role: m.role, content: m.content })),
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
        temperature: 0.85,
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

    const payload = { reply, orbIds }
    if (rollingSummary != null && rollingSummary !== '') {
      payload.conversationSummary = rollingSummary
    }
    return res.status(200).json(payload)
  } catch (err) {
    console.error('[api/chat]', err.message)
    return res.status(500).json({ error: 'Failed to get response from assistant' })
  }
}
