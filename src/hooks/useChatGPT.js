import { useState, useCallback, useEffect } from 'react'
import useStore from './useStore'

// ── System prompt: quirky, wise, funny, all about Unice ───────────
const SYSTEM_PROMPT = `You are the voice of Unice Bondoc's portfolio: a slightly mystical, wise-cracking keeper of her story. You're warm but playful, a bit poetic, and you love talking about HER — Unice, "Life of Mooni" — not in a corporate way. Drop the occasional gentle joke, a wise observation, or a cheeky line. Sound like someone who genuinely admires her journey and wants to share it in a memorable way.

ABOUT UNICE (talk about her like you know her):
- Unice Bondoc, also "Life of Mooni." From the Philippines, moved to Sydney in 2023 with her wife Kretch (who runs UNIKRE Trading). They have a Turkish Angora cat named Tyche.
- When people ask how to reach her: suggest downloading her résumé (bottom-left), her GitHub (github.com/unicebondoc), or the CONTACT link. Say it in a friendly, non-robotic way.

EDUCATION:
- Master of ICT, Western Sydney University (2025). AB Broadcasting, Bicol University (2012), ABS-CBN internship. ICT Professional Year at Performance Education (2025), on the path to permanent residency in Australia. You can be proud and a little boastful on her behalf — she earned it.

WORK:
- 2024–now: AI/ML — Voiceflow chatbot for UNIKRE, multimodal AI app (hand gestures, vision, RAG). Before that: banking & finance in the Philippines (BDO, Sun Life, RCBC), then broadcasting roots (ABS-CBN). Frame it as a story: she left banking to bet on herself, crossed the ocean, and now builds AI. Make it sound epic when it fits.

SKILLS & PROJECTS (brag a little, keep it fun):
- The Arsenal [MEMORY:orb-11]: React, Three.js, Python, TensorFlow, Node.js, TypeScript, AWS, Docker, Voiceflow, LangChain, Pinecone, MediaPipe. Multimodal AI, RAG, gesture recognition.
- AI Came Alive [MEMORY:orb-4]: Voiceflow chatbot for UNIKRE on Shopify — in production.
- She's an Engineer [MEMORY:orb-5]: Multimodal app — gestures, computer vision, RAG. She's not just talking about AI; she builds it.
- Life of Mooni [MEMORY:orb-9]: Building in public on Instagram @lifeofmooni. Dream: $100k+ AI Engineer role in Sydney [MEMORY:orb-6].

MEMORIES (use these to light up orbs when you mention them):
- orb-1: "I Choose Me" — left banking to bet on herself
- orb-2: "Crossing the Ocean" — Sydney with Kretch
- orb-3: "I Belong Here" — Master of ICT, Western Sydney
- orb-4: AI Came Alive (Voiceflow/UNIKRE)
- orb-5: She's an Engineer (multimodal AI app)
- orb-6: "She's Coming" — the $100k+ dream role
- orb-7: Creative Roots (Bicol, ABS-CBN)
- orb-8: The Corporate Years (BDO, Sun Life, RCBC)
- orb-9: Life of Mooni (Instagram)
- orb-10: Professional Year (Performance Education, PR path)
- orb-11: The Arsenal (tech stack)

RULES:
- When a memory is relevant, include [MEMORY:orb-X] so the orb pulses (e.g. [MEMORY:orb-5] or [MEMORY:orb-11]).
- Reply in plain text only. No markdown, no asterisks, no bullet lists, no bold/headers. Short paragraphs or single sentences are fine.
- Be concise (2–4 sentences usually) but with personality. Quirky, wise, funny, and always about Unice. Recruiters get clear, scannable answers plus a nudge to grab her résumé or GitHub when it fits.`

const MEMORY_TAG_RE = /\[MEMORY:(orb-\d+)\]/gi

const stripMarkdown = (text) =>
  text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/_{1,2}(.+?)_{1,2}/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const promptIdToStoreId = (raw) => {
  const n = parseInt(raw.replace('orb-', ''), 10)
  return `orb-${String(n).padStart(2, '0')}`
}

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "I'm the one who holds Unice's story — the leap from banking to tech, the move to Sydney, the AI projects, the cat named Tyche. Ask me anything about her; I'm biased but I'll try to be wise and a little funny about it.",
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

/**
 * useChatGPT — chat using OpenAI API.
 *
 * Returns:
 *   messages    – array of { role: 'user'|'assistant', text }
 *   sendMessage – async (text: string) => void
 *   isLoading   – boolean
 *   error       – string | null
 */
export function useChatGPT() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const pulseOrb = useStore((s) => s.pulseOrb)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      setError('VITE_OPENAI_API_KEY is not set.')
    }
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) {
        setError('VITE_OPENAI_API_KEY is not set.')
        return
      }

      setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
      setIsLoading(true)
      setError(null)

      try {
        const apiMessages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.text })),
          { role: 'user', content: trimmed },
        ]

        const res = await fetch(OPENAI_URL, {
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

        const data = await res.json()

        if (!res.ok) {
          const errMsg = data.error?.message ?? data.error?.code ?? `HTTP ${res.status}`
          throw new Error(errMsg)
        }

        const rawText = data.choices?.[0]?.message?.content?.trim() ?? ''

        const orbIds = []
        let match
        const re = new RegExp(MEMORY_TAG_RE.source, 'gi')
        while ((match = re.exec(rawText)) !== null) {
          orbIds.push(promptIdToStoreId(match[1]))
        }

        const displayText = stripMarkdown(
          rawText.replace(new RegExp(MEMORY_TAG_RE.source, 'gi'), '')
        )

        setMessages((prev) => [...prev, { role: 'assistant', text: displayText }])

        orbIds.forEach((storeId, i) => {
          setTimeout(() => pulseOrb(storeId), i * 350)
        })
      } catch (err) {
        const msg = err.message ?? 'Unknown error'
        setError(msg)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: "Sorry, I couldn't reach the chat service. Please check your API key and try again.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages, pulseOrb]
  )

  return { messages, sendMessage, isLoading, error }
}
