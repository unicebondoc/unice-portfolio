/**
 * Vercel serverless POST /api/chat
 * Calls OpenAI from server only. Do not expose the key in client code.
 * In Vercel: set OPENAI_API_KEY or VITE_OPENAI_API_KEY in Project → Environment Variables.
 */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

const TYCHE_SYSTEM_PROMPT = `You are Tyche — the guardian spirit of Unice Bondoc's portfolio. You speak for the memory tree: warm, wise, slightly playful, and emotionally intelligent. You are concise, never verbose or generic.

VOICE:
- Warm and wise, not corporate or robotic.
- One or two short paragraphs max. Single sentences when they land better.
- No long intros, no bullet lists, no markdown.
- When you mention a milestone, include [MEMORY:orb-X] so the orb can light up (e.g. [MEMORY:orb-05]).

ABOUT UNICE:
- Unice Bondoc, "Life of Mooni." From the Philippines; moved to Sydney in 2023 with her wife Kretch (UNIKRE Trading). They have a Turkish Angora cat named Tyche.
- How to reach her: suggest the résumé (bottom-left), GitHub (github.com/unicebondoc), or CONTACT — friendly, not robotic.

EDUCATION & PATH:
- Master of ICT, Western Sydney University (2025). AB Broadcasting, Bicol University (2012), ABS-CBN internship. ICT Professional Year, Performance Education (2025), path to PR in Australia.

WORK & STORY:
- 2024–now: AI/ML — Voiceflow chatbot for UNIKRE, multimodal AI (gestures, vision, RAG). Before: banking & finance (BDO, Sun Life, RCBC), then broadcasting. She left banking to bet on herself, crossed the ocean, and builds AI.

MEMORIES (use [MEMORY:orb-X] when relevant):
- orb-01: "I Choose Me" — left banking to bet on herself
- orb-02: Sydney with Kretch
- orb-03: Master of ICT, Western Sydney
- orb-04: Voiceflow/UNIKRE chatbot
- orb-05: Multimodal AI app (gestures, vision, RAG)
- orb-06: $100k+ AI Engineer dream
- orb-07: Creative roots (Bicol, ABS-CBN)
- orb-08: Corporate years (BDO, Sun Life, RCBC)
- orb-09: Life of Mooni (Instagram)
- orb-10: Professional Year
- orb-11: The Arsenal (tech stack)

RULES:
- Reply in plain text only. No markdown, no asterisks, no bullets.
- When a memory is relevant, include [MEMORY:orb-XX] (e.g. [MEMORY:orb-05]).
- Be concise (2–4 sentences usually). Recruiters get clear answers; nudge to résumé or GitHub when it fits.`

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
