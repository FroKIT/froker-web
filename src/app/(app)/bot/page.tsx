'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Volume2, VolumeX } from 'lucide-react'
import { ChatBubble } from '@/components/bot/ChatBubble'
import { VoiceButton } from '@/components/bot/VoiceButton'
import { useBot } from '@/hooks/useBot'
import { cn } from '@/lib/utils'

const SUGGESTED_PROMPTS = [
  "I want to be vegetarian today",
  "I'm feeling feverish, update my meals",
  "Increase my protein tomorrow",
  "What's in today's lunch?",
  "Switch me to vegan for this week",
  "Skip my breakfast today",
]

export default function BotPage() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    messages,
    loading,
    historyLoaded,
    isListening,
    isSpeaking,
    sendMessage,
    toggleListening,
    stopSpeaking,
    loadHistory,
  } = useBot()

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className="fixed inset-x-0 top-0 mx-auto max-w-md flex flex-col bg-[#F7F4F0]" style={{ bottom: '64px' }}>
      {/* Header */}
      <div className="bg-white border-b border-[#EEEBE6] px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1C1C1C] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <div>
              <p className="text-[12px] text-[#8A8480]">Your personal chef</p>
              <h2 className="text-[15px] font-semibold text-[#1C1C1C]">Froker AI</h2>
            </div>
          </div>
          {isSpeaking ? (
            <button onClick={stopSpeaking} className="text-[#E8602C] p-2">
              <VolumeX size={20} />
            </button>
          ) : (
            <Volume2 size={20} className="text-[#D0CCC8] p-2" />
          )}
        </div>
      </div>

      {/* Messages — only this scrolls */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!historyLoaded && (
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex justify-end"><div className="h-10 w-48 bg-[#EEEBE6] rounded-2xl animate-pulse" /></div>
            <div className="flex gap-2"><div className="w-8 h-8 bg-[#EEEBE6] rounded-full animate-pulse shrink-0" /><div className="h-16 w-64 bg-[#EEEBE6] rounded-2xl animate-pulse" /></div>
            <div className="flex justify-end"><div className="h-10 w-36 bg-[#EEEBE6] rounded-2xl animate-pulse" /></div>
          </div>
        )}
        {historyLoaded && messages.length === 0 &&(
          <div className="flex flex-col items-center pt-8 pb-4">
            <div className="w-14 h-14 bg-[#1C1C1C] rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <p className="text-[12px] text-[#8A8480] mb-0.5">Your personal chef</p>
            <h3 className="text-[16px] font-semibold text-[#1C1C1C] mb-3">Froker AI</h3>
            <p className="text-[13px] text-[#8A8480] text-center mb-6 max-w-[260px]">
              Update meals, check nutrition, or adapt to how you feel today.
            </p>
            <div className="w-full flex flex-col gap-2">
              <p className="text-[11px] font-semibold text-[#B8B4AF] uppercase tracking-wider mb-1">Suggestions</p>
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestion(prompt)}
                  className="text-left px-4 py-3 bg-white rounded-xl text-[13px] text-[#1C1C1C] border border-[#EEEBE6] active:bg-[#F7F4F0] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map(message => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {loading && (
          <div className="flex mb-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#1C1C1C] flex items-center justify-center mr-2 shrink-0 mt-1">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-[#EEEBE6]">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-[#D0CCC8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#D0CCC8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#D0CCC8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — fixed at bottom, never scrolls */}
      <div className="bg-white border-t border-[#EEEBE6] px-4 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <VoiceButton isListening={isListening} onToggle={toggleListening} />
          <div className="flex-1 flex items-center bg-[#F7F4F0] rounded-full px-4 py-2.5 border border-[#EEEBE6]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI Chef..."
              className="flex-1 bg-transparent text-[14px] text-[#1C1C1C] placeholder:text-[#B8B4AF] focus:outline-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all',
              input.trim() && !loading
                ? 'bg-[#E8602C] text-white active:scale-95'
                : 'bg-[#F0EDE8] text-[#B8B4AF]'
            )}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
