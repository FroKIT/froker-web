'use client'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceButtonProps {
  isListening: boolean
  onToggle: () => void
}

export function VoiceButton({ isListening, onToggle }: VoiceButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0',
        isListening
          ? 'bg-[#E8602C] text-white animate-pulse'
          : 'bg-[#F0EDE8] text-[#8A8480] active:bg-[#EEEBE6]'
      )}
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  )
}
