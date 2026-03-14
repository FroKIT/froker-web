import { Meal } from '@/types'
import { MacroBadge } from './MacroBadge'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MealCardProps {
  meal: Meal
  mealType?: string
  onSwap?: () => void
  onSkip?: () => void
  onUnskip?: () => void
  compact?: boolean
  skipped?: boolean
  className?: string
}

export function MealCard({ meal, mealType, onSwap, onSkip, onUnskip, compact, skipped, className }: MealCardProps) {
  if (skipped) {
    return (
      <div className={cn('bg-white border border-[#EEEBE6] rounded-2xl overflow-hidden', className)}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            {mealType && <p className="text-[10px] font-semibold text-[#B8B4AF] uppercase tracking-widest">{mealType}</p>}
            <p className="text-[14px] font-medium text-[#B8B4AF] line-through">{meal.name}</p>
          </div>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            {onUnskip && (
              <button onClick={onUnskip} className="text-[11px] font-medium text-[#E8602C] border border-[#E8602C]/30 px-2.5 py-1 rounded-full active:opacity-70">
                Restore
              </button>
            )}
            <span className="text-[11px] font-medium text-[#B8B4AF] border border-[#EEEBE6] px-2.5 py-1 rounded-full">Skipped</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white border border-[#EEEBE6] rounded-2xl overflow-hidden', className)}>
      {meal.image_url && !compact && (
        <div className="relative h-44 w-full">
          <Image src={meal.image_url} alt={meal.name} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {mealType && <p className="text-[11px] font-semibold text-[#E8602C] uppercase tracking-widest mb-1">{mealType}</p>}
            <h3 className="text-[15px] font-semibold text-[#1C1C1C]">{meal.name}</h3>
            {!compact && <p className="text-[13px] text-[#8A8480] mt-0.5 line-clamp-2">{meal.description}</p>}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <MacroBadge label="Cal" value={meal.calories} unit="kcal" />
          <MacroBadge label="Protein" value={meal.protein_g} />
          <MacroBadge label="Carbs" value={meal.carbs_g} />
          <MacroBadge label="Fat" value={meal.fat_g} />
        </div>
        {(onSwap || onSkip) && (
          <div className="flex gap-2 mt-3">
            {onSwap && (
              <button onClick={onSwap} className="flex-1 py-2 rounded-full bg-[#E8602C] text-white text-sm font-medium active:opacity-80">
                Swap
              </button>
            )}
            {onSkip && (
              <button onClick={onSkip} className="flex-1 py-2 rounded-full bg-[#F0EDE8] text-[#8A8480] text-sm font-medium active:opacity-80">
                Skip
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
