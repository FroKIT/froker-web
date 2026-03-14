import { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import { ArrowLeftRight, SkipForward, Utensils } from 'lucide-react'

interface ChatBubbleProps {
  message: ChatMessage
}

function ActionCard({ action }: { action: NonNullable<ChatMessage['action']> }) {
  if (!action.updated) return null

  const isSwapSpecific = action.type === 'swap_specific'
  const isDietUpdate = action.type === 'diet_update'
  const isSkip = action.type === 'skip'
  const isHealth = action.type === 'health_context'

  const accentColor = isSwapSpecific ? '#E8602C' : isHealth ? '#48BB78' : '#1C1C1C'

  const label = isSwapSpecific ? 'Meal swapped'
    : isDietUpdate ? 'Meals updated'
    : isSkip ? 'Meal skipped'
    : 'Meals adjusted'

  const Icon = isSwapSpecific ? ArrowLeftRight : isSkip ? SkipForward : Utensils

  return (
    <div className="mt-2 rounded-2xl border border-[#EEEBE6] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}15` }}>
          <Icon size={12} style={{ color: accentColor }} />
        </div>
        <p className="text-[12px] font-semibold" style={{ color: accentColor }}>{label}</p>
      </div>

      {/* Swap rows */}
      {isSwapSpecific && action.from && action.meal && (
        <div className="px-3 pb-3">
          <SwapRow from={action.from} to={action.meal} />
        </div>
      )}

      {isDietUpdate && action.swaps?.length ? (
        <div className="px-3 pb-3 flex flex-col gap-1.5">
          {action.swaps.map((s, i) => (
            <div key={i}>
              <p className="text-[10px] font-semibold text-[#B8B4AF] uppercase tracking-wider mb-1">{s.meal_type}</p>
              <SwapRow from={s.from} to={s.to} />
            </div>
          ))}
        </div>
      ) : (isDietUpdate && !action.swaps?.length) ? (
        <p className="text-[12px] text-[#8A8480] px-3 pb-3">Your meals have been updated</p>
      ) : null}

      {(isSkip || isHealth) && (
        <p className="text-[12px] text-[#8A8480] px-3 pb-3">
          {isSkip ? 'Removed from your delivery' : 'Switched to lighter meals for you'}
        </p>
      )}
    </div>
  )
}

function SwapRow({ from, to }: { from: string; to: string }) {
  return (
    <div className="grid gap-x-2" style={{ gridTemplateColumns: '1fr 14px 1fr' }}>
      <span className="text-[12px] text-[#8A8480] line-through leading-relaxed">{from}</span>
      <ArrowLeftRight size={10} className="text-[#D0CCC8] self-start mt-1 mx-auto" />
      <span className="text-[12px] font-medium text-[#1C1C1C] leading-relaxed">{to}</span>
    </div>
  )
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
      <div className="max-w-[78%]">
        <div className={cn(
          'px-4 py-3 text-[14px] leading-relaxed',
          isUser
            ? 'bg-[#E8602C] text-white rounded-2xl rounded-br-sm'
            : 'bg-white text-[#1C1C1C] rounded-2xl rounded-bl-sm border border-[#EEEBE6]'
        )}>
          {message.content}
        </div>
        {!isUser && message.action && (
          <ActionCard action={message.action} />
        )}
      </div>
    </div>
  )
}
