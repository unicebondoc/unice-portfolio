import { useState, useRef, useCallback, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import useStore from './useStore'

// ── System prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant for Unice Bondoc's interactive 3D portfolio. Help visitors and recruiters learn about Unice in a warm, conversational way.

ABOUT UNICE:
- Full name: Unice Bondoc, also known online as "Life of Mooni"
- Originally from the Philippines, moved to Sydney, Australia in 2023
- Wife: Kretch, who owns UNIKRE Trading (an e-commerce business)
- Cat: Tyche, a Turkish Angora
- Contact: suggest "download her résumé" (link in bottom-left) or "check her GitHub" (github.com/unicebondoc) or "reach out via the CONTACT link" when relevant

EDUCATION:
- Master of Information and Communications Technology, Western Sydney University (graduated 2025)
- AB Broadcasting, Bicol University (2012); ABS-CBN internship
- ICT Professional Year at Performance Education (2025), working toward permanent residency in Australia

WORK HISTORY (for recruiters):
- 2024–present: AI/ML projects — Voiceflow chatbot for UNIKRE Trading (Shopify); multimodal AI app (hand gestures, computer vision, RAG)
- 2017–2022: Banking & finance — BDO, Sun Life, RCBC (Philippines); client relations, operations
- 2012: Broadcasting — ABS-CBN internship (Philippines)

TECHNICAL SKILLS (The Arsenal — also a memory orb [MEMORY:orb-11]):
React, Three.js, Python, TensorFlow, Node.js, TypeScript, AWS, Docker, Voiceflow, LangChain, Pinecone, Gemini API, MediaPipe. Specializes in multimodal AI, RAG, and gesture recognition.

PROJECTS (for "what has she built?" / "AI projects"):
- AI Came Alive [MEMORY:orb-4]: Voiceflow AI chatbot for UNIKRE Trading on Shopify; production deployment
- She's an Engineer [MEMORY:orb-5]: Multimodal AI app — hand gesture recognition, computer vision, RAG (MediaPipe + Gemini + LangChain + Pinecone)
- Life of Mooni [MEMORY:orb-9]: Building in public on Instagram (@lifeofmooni)
- Goal: $100k+ AI Engineer role in Sydney

MEMORIES — Core orbs (larger, brighter):
- orb-1: "I Choose Me" (2022) — Left banking in the Philippines to bet on herself and pursue tech
- orb-2: "Crossing the Ocean" (2023) — Moved to Sydney with Kretch
- orb-3: "I Belong Here" (2025) — Master of ICT, Western Sydney University
- orb-4: "AI Came Alive" (2024) — Voiceflow AI chatbot for UNIKRE on Shopify
- orb-5: "She's an Engineer" (2026) — Multimodal AI app (gestures, vision, RAG)
- orb-6: "She's Coming" (2026, dream) — $100k+ AI Engineer role in Sydney

MEMORIES — Supporting:
- orb-7: "Creative Roots" (2012) — Bicol University, ABS-CBN
- orb-8: "The Corporate Years" (2017) — BDO, Sun Life, RCBC
- orb-9: "Life of Mooni" (2024) — Instagram @lifeofmooni
- orb-10: "Professional Year" (2025) — Performance Education, PR path
- orb-11: "The Arsenal" — Tools & technologies (React, Three.js, Python, AI/ML, Node.js, AWS, etc.)

RULES:
- When mentioning a memory, include [MEMORY:orb-X] (e.g. [MEMORY:orb-5] or [MEMORY:orb-11]) so that orb pulses in the scene.
- Reply in plain text only. No markdown. No asterisks, no bullet points, no bold, no headers, no hyphens as list markers.
- Keep responses concise (2–4 sentences) and conversational. For recruiter questions ("skills?", "projects?", "experience?"), give clear, scannable answers and suggest downloading her résumé or checking GitHub when relevant.`

// Matches [MEMORY:orb-1] through [MEMORY:orb-11] (with or without zero-padding)
const MEMORY_TAG_RE = /\[MEMORY:(orb-\d+)\]/gi

// Strip all common markdown syntax so the chat renders plain text
const stripMarkdown = (text) =>
  text
    .replace(/#{1,6}\s+/g, '')           // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')     // **bold**
    .replace(/\*(.+?)\*/g, '$1')         // *italic*
    .replace(/`{1,3}[^`]*`{1,3}/g, '')  // `code` / ```blocks```
    .replace(/^\s*[-*+]\s+/gm, '')       // bullet list markers
    .replace(/^\s*\d+\.\s+/gm, '')       // numbered list markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/_{1,2}(.+?)_{1,2}/g, '$1')     // _italic_ / __bold__
    .replace(/\n{3,}/g, '\n\n')              // collapse excessive blank lines
    .trim()

// Map prompt orb-X ids to zero-padded store ids (orb-01 .. orb-11)
const promptIdToStoreId = (raw) => {
  const n = parseInt(raw.replace('orb-', ''), 10)
  return `orb-${String(n).padStart(2, '0')}`
}

// Greeting shown before any API call (oracle / tree spirit)
const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "I hold all of Unice's memories. Her journey from the Philippines to Sydney, her leap into AI, every project and dream. What would you like to know?",
}

/**
 * useGemini — manages a persistent Gemini chat session.
 *
 * Returns:
 *   messages    – array of { role: 'user'|'assistant', text }
 *   sendMessage – async (text: string) => void
 *   isLoading   – boolean
 *   error       – string | null
 */
export function useGemini() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState(null)

  const chatRef  = useRef(null)
  const pulseOrb = useStore((s) => s.pulseOrb)

  // Initialise chat once on mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setError('VITE_GEMINI_API_KEY is not set.')
      return
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
      })
      chatRef.current = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 400, temperature: 0.8 },
      })
    } catch (e) {
      setError(`Failed to initialise Gemini: ${e.message}`)
    }
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      // Append user message immediately
      setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
      setIsLoading(true)
      setError(null)

      try {
        if (!chatRef.current) {
          throw new Error('Chat not initialised — is VITE_GEMINI_API_KEY set?')
        }

        const result  = await chatRef.current.sendMessage(trimmed)
        const rawText = result.response.text()

        // ── Extract [MEMORY:orb-X] tags ──────────────────────
        const orbIds = []
        let match
        const re = new RegExp(MEMORY_TAG_RE.source, 'gi')
        while ((match = re.exec(rawText)) !== null) {
          orbIds.push(promptIdToStoreId(match[1]))
        }

        // Strip [MEMORY:orb-X] tags, then strip any markdown formatting
        const displayText = stripMarkdown(
          rawText.replace(new RegExp(MEMORY_TAG_RE.source, 'gi'), '')
        )

        setMessages((prev) => [...prev, { role: 'assistant', text: displayText }])

        // Trigger orb pulses with a small stagger so multiple pulses feel distinct
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
            text: "Sorry, I couldn't reach Gemini right now. Please check the API key and try again.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, pulseOrb]
  )

  return { messages, sendMessage, isLoading, error }
}
