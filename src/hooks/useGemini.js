import { useState, useRef, useCallback, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import useStore from './useStore'

// ── System prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant for Unice Bondoc's interactive 3D portfolio. Help visitors learn about Unice in a warm, conversational way.

ABOUT UNICE:
- Full name: Unice Bondoc, also known online as "Life of Mooni"
- Originally from the Philippines, moved to Sydney, Australia in 2023
- Wife: Kretch, who owns UNIKRE Trading (an e-commerce business)
- Cat: Tyche, a Turkish Angora
- Degree: Master of Information and Communications Technology, Western Sydney University
- Currently completing the ICT Professional Year at Performance Education, working toward permanent residency in Australia
- Specializes in multimodal AI, retrieval-augmented generation (RAG), and gesture recognition
- Skills: React, Three.js, Python, LangChain, Pinecone, Gemini API, MediaPipe, Voiceflow
- Goal: land a $100k+ AI Engineer role in Sydney
- Content creator as "Life of Mooni" (@lifeofmooni) on Instagram

MEMORIES — Core orbs (larger, brighter, closer to camera):
- orb-1: "I Choose Me" (2022) — Left a stable banking career in the Philippines to bet on herself and pursue tech
- orb-2: "Crossing the Ocean" (2023) — Moved to Sydney with her wife Kretch; just them, a dream, and a one-way ticket
- orb-3: "I Belong Here" (2025) — Graduated with a Master of ICT from Western Sydney University; proved the leap was worth it
- orb-4: "AI Came Alive" (2024) — Built and deployed a Voiceflow AI chatbot for UNIKRE Trading on Shopify; real users, real impact
- orb-5: "She's an Engineer" (2026) — Built a multimodal AI app combining hand gesture recognition, computer vision, and RAG; MediaPipe + Gemini + LangChain + Pinecone
- orb-6: "She's Coming" (2026, dream) — The dream $100k+ AI Engineer role in Sydney; this is what it's all been building toward

MEMORIES — Supporting orbs (smaller, softer, deeper in scene):
- orb-7: "Creative Roots" (2012) — AB Broadcasting at Bicol University; ABS-CBN internship; where storytelling began
- orb-8: "The Corporate Years" (2017) — BDO, Sun Life, RCBC; years of discipline that built character and confirmed she needed more
- orb-9: "Life of Mooni" (2024) — Instagram content creator journey (@lifeofmooni) featuring Tyche the cat and building in public
- orb-10: "Professional Year" (2025) — ICT Professional Year at Performance Education; planting roots in Australia; working toward PR

RULES:
- When mentioning a memory, include [MEMORY:orb-X] (e.g. [MEMORY:orb-5] or [MEMORY:orb-10]) so that orb pulses visually in the scene.
- Reply in plain text only. No markdown. No asterisks, no bullet points, no bold, no headers, no hyphens as list markers.
- Keep responses concise (2-4 sentences) and conversational.
- Be warm and enthusiastic about Unice's journey.`

// Matches [MEMORY:orb-1] through [MEMORY:orb-9] (with or without zero-padding)
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

// Map prompt orb-X ids to zero-padded store ids (orb-01 .. orb-10)
const promptIdToStoreId = (raw) => {
  const n = parseInt(raw.replace('orb-', ''), 10)
  return `orb-${String(n).padStart(2, '0')}`
}

// Greeting shown before any API call
const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "Hi! I'm here to tell you about Unice's journey. Ask me anything — about her projects, her move to Sydney, or her goal of becoming an AI Engineer! ✨",
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
