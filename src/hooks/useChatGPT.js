import { useState, useCallback, useRef } from 'react'
import useStore from './useStore'

const MEMORY_TAG_RE = /\[MEMORY:(orb-\d+)\]/gi

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "I'm Tyche — guardian of this forest. Ask me about Unice's work, her story, or why she belongs on your team.",
}

/**
 * useChatGPT — chat via server /api/chat (OpenAI on server only).
 * Returns: messages, sendMessage, isLoading, error, pendingReply (for typing effect).
 */
export function useChatGPT() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pendingReply, setPendingReply] = useState(null)
  const conversationSummaryRef = useRef(null)
  const pulseOrb = useStore((s) => s.pulseOrb)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
      setIsLoading(true)
      setError(null)
      setPendingReply(null)

      try {
        const apiMessages = messagesRef.current.map((m) => ({ role: m.role, text: m.text }))
        apiMessages.push({ role: 'user', text: trimmed })

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            conversationSummary: conversationSummaryRef.current || undefined,
          }),
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          throw new Error(data.error || `Request failed (${res.status})`)
        }

        const reply = (data.reply || '').trim()
        const orbIds = Array.isArray(data.orbIds) ? data.orbIds : []
        if (data.conversationSummary != null && data.conversationSummary !== '') {
          conversationSummaryRef.current = data.conversationSummary
        }

        if (reply) {
          setPendingReply(reply)
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: "I'm here, but the roots are quiet. Try again in a moment." },
          ])
        }

        orbIds.forEach((storeId, i) => {
          setTimeout(() => pulseOrb(storeId), i * 350)
        })
      } catch (err) {
        const msg = err.message || 'Unknown error'
        setError(msg)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: "The tree couldn't reach the depths just now. Check your connection, or try again in a moment.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, pulseOrb]
  )

  const commitPendingReply = useCallback(() => {
    if (pendingReply) {
      setMessages((prev) => [...prev, { role: 'assistant', text: pendingReply }])
      setPendingReply(null)
    }
  }, [pendingReply])

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE])
    setPendingReply(null)
    setError(null)
    conversationSummaryRef.current = null
  }, [])

  return { messages, sendMessage, isLoading, error, pendingReply, setPendingReply, commitPendingReply, clearMessages }
}
