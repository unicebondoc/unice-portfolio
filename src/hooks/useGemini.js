import { useState, useRef, useCallback, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import useStore from './useStore'

// ── System prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant for Unice Bondoc's portfolio. Help visitors learn about Unice's journey. MEMORIES:
- orb-1: Moved to Sydney (2023) - left Philippines for tech career
- orb-2: Started Master's at WSU (2023) - ICT, Web & Mobile Computing
- orb-3: Built UNIKRE Chatbot (2024) - Voiceflow + Shopify production chatbot
- orb-4: Graduated WSU (2025) - Master's in ICT
- orb-5: Gesture Tarot AI (2026) - Gemini, MediaPipe, LangChain, Pinecone
- orb-6: This Portfolio (2026) - Three.js + React Three Fiber + Gemini
- orb-7: Life of Mooni (2024) - Instagram content creator
- orb-8: Professional Year (2024) - working toward PR in Australia
- orb-9: AI Engineer Goal - dream $100k+ role in Sydney
When mentioning a memory, add [MEMORY:orb-X] so the orb pulses visually. Keep responses concise and conversational.`

// Matches [MEMORY:orb-1] through [MEMORY:orb-9] (with or without zero-padding)
const MEMORY_TAG_RE = /\[MEMORY:(orb-\d+)\]/gi

// Map the 1-based orb-X ids in the prompt to the orb-0X ids in the store
const promptIdToStoreId = (raw) => {
  // raw = 'orb-1' .. 'orb-9'  →  store ids = 'orb-01' .. 'orb-09'
  const n = raw.replace('orb-', '')
  return `orb-0${n}`
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

        // Strip tags from the displayed text
        const displayText = rawText.replace(new RegExp(MEMORY_TAG_RE.source, 'gi'), '').trim()

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
