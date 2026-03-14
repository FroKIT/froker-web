'use client'
import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '@/types'

export function useBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-6),
        }),
      })
      const data = await res.json()

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])

      // Auto-play TTS response
      await playTTS(data.message)

      return data
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  const playTTS = async (text: string) => {
    try {
      setIsSpeaking(true)
      const res = await fetch('/api/bot/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) return

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = () => setIsSpeaking(false)
      await audio.play()
    } catch {
      setIsSpeaking(false)
    }
  }

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      alert('Voice input not supported in this browser. Please use Chrome.')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
    }

    recognition.start()
  }, [sendMessage])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsSpeaking(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/bot/history')
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages.map((m: { id: string; role: 'user' | 'assistant'; content: string; created_at: string }) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.created_at,
        })))
      }
    } catch {}
    finally { setHistoryLoaded(true) }
  }, [])

  return {
    messages,
    loading,
    historyLoaded,
    isListening,
    isSpeaking,
    sendMessage,
    toggleListening,
    stopSpeaking,
    loadHistory,
  }
}
