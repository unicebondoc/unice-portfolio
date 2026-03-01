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
- Degree: Master of Information Technology (Web & Mobile Computing), Western Sydney University
- Currently completing the ACS Professional Year Program, working toward permanent residency in Australia
- Specializes in multimodal AI, retrieval-augmented generation (RAG), and gesture recognition
- Skills: React, Three.js, Python, LangChain, Pinecone, Gemini API, MediaPipe, Voiceflow
- Goal: land a $100k+ AI Engineer role in Sydney
- Content creator as "Life of Mooni" on Instagram

MEMORIES (each is a glowing orb in the 3D scene):
- orb-1: Moved to Sydney (2023) - left Philippines to pursue a tech career in Australia
- orb-2: Started Master's at WSU (2023) - Master of IT, Web & Mobile Computing
- orb-3: Built UNIKRE Chatbot (2024) - AI chatbot for Kretch's Shopify store using Voiceflow, deployed to production
- orb-4: Graduated WSU (2025) - completed Master's in ICT
- orb-5: Gesture Tarot AI (2026) - real-time hand gesture recognition combined with tarot card reading, built with MediaPipe, Gemini, LangChain, and Pinecone
- orb-6: This Portfolio (2026) - the very site you are on, built with Three.js, React Three Fiber, and Gemini
- orb-7: Life of Mooni (2024) - Instagram content creator journey featuring Tyche the cat
- orb-8: Professional Year (2024) - ACS Professional Year Program, bridging study and industry while working toward PR
- orb-9: AI Engineer Goal - dream role as an AI Engineer earning $100k+ in Sydney

RULES:
- When mentioning a memory, include [MEMORY:orb-X] (e.g. [MEMORY:orb-5]) so that orb pulses visually in the scene.
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
