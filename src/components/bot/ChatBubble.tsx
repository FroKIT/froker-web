import { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#1C1C1C] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-white text-xs font-bold">F</span>
        </div>
      )}
      <div className={cn(
        'max-w-[78%] px-4 py-3 text-[14px] leading-relaxed',
        isUser
          ? 'bg-[#E8602C] text-white rounded-2xl rounded-br-sm'
          : 'bg-white text-[#1C1C1C] rounded-2xl rounded-bl-sm border border-[#EEEBE6]'
      )}>
        {message.content}
      </div>
    </div>
  )
}
