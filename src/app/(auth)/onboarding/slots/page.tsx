'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'

interface SlotOption {
  label: string
  time_start: string
  time_end: string
  time_range: string
}

const SLOT_OPTIONS: Record<string, SlotOption[]> = {
  breakfast: [{ label: 'Early Morning', time_start: '07:00', time_end: '09:00', time_range: '7:00 AM – 9:00 AM' }],
  lunch: [{ label: 'Midday', time_start: '12:00', time_end: '14:00', time_range: '12:00 PM – 2:00 PM' }],
  dinner: [{ label: 'Evening', time_start: '19:00', time_end: '21:00', time_range: '7:00 PM – 9:00 PM' }],
}

const MEAL_LABELS: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' }

export default function SlotsStep() {
  const router = useRouter()
  const stepStartRef = useRef<number>(Date.now())
  const [loading, setLoading] = useState(false)
  const [mealsPerDay, setMealsPerDay] = useState<number>(3)
  const [selected, setSelected] = useState<Record<string, SlotOption>>({
    breakfast: SLOT_OPTIONS.breakfast[0],
    lunch: SLOT_OPTIONS.lunch[0],
    dinner: SLOT_OPTIONS.dinner[0],
  })
  const [activeMeals, setActiveMeals] = useState<string[]>(['lunch', 'dinner'])

  useEffect(() => {
    // Read selected package from sessionStorage and look up meals_per_day
    const packageId = sessionStorage.getItem('froker_package_id')
    if (!packageId) return
    fetch('/api/packages')
      .then(r => r.json())
      .then(d => {
        const pkg = (d.packages || []).find((p: { id: string; meals_per_day: number }) => p.id === packageId)
        if (pkg?.meals_per_day) {
          setMealsPerDay(pkg.meals_per_day)
          if (pkg.meals_per_day === 1) setActiveMeals(['lunch'])
          else if (pkg.meals_per_day === 2) setActiveMeals(['lunch', 'dinner'])
          else setActiveMeals(['breakfast', 'lunch', 'dinner'])
        }
      }).catch(() => {})
  }, [])

  const toggleMeal = (meal: string) => {
    setActiveMeals(prev => {
      if (prev.includes(meal)) return prev.filter(m => m !== meal)
      if (prev.length >= mealsPerDay) {
        toast.error(`Your plan includes ${mealsPerDay} meal${mealsPerDay > 1 ? 's' : ''} per day`)
        return prev
      }
      return [...prev, meal]
    })
  }

  const handleContinue = async () => {
    if (activeMeals.length === 0) return toast.error('Select at least one meal')
    setLoading(true)
    try {
      const slots = activeMeals.map(meal => ({
        meal_type: meal,
        slot_label: selected[meal].label,
        time_start: selected[meal].time_start,
        time_end: selected[meal].time_end,
      }))
      const res = await fetch('/api/onboarding/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })
      if (!res.ok) throw new Error()
      const timeOnStep = Math.round((Date.now() - stepStartRef.current) / 1000)
      const { Analytics } = await import('@/lib/analytics/amplitude')
      Analytics.onboardingStepCompleted(5, 'delivery_slots', timeOnStep)
      router.push('/onboarding/meals')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepWrapper
      title="Delivery slots"
      subtitle="When should we deliver your meals?"
      step={5}
      totalSteps={6}
      backHref="/onboarding/packages"
    >
      <div className="flex flex-col gap-3 mt-6">
        <p className="text-[13px] font-medium text-[#8A8480] mb-1">
          Select up to {mealsPerDay} meal{mealsPerDay > 1 ? 's' : ''} per day
        </p>

        {Object.keys(SLOT_OPTIONS).map(mealType => {
          const isActive = activeMeals.includes(mealType)
          return (
            <div
              key={mealType}
              className={cn(
                'rounded-2xl border transition-all bg-white',
                isActive ? 'border-[#1C1C1C]' : 'border-[#EEEBE6]'
              )}
            >
              <button
                type="button"
                onClick={() => toggleMeal(mealType)}
                className="flex items-center justify-between w-full px-4 py-4"
              >
                <span className={cn('text-[15px] font-semibold', isActive ? 'text-[#1C1C1C]' : 'text-[#8A8480]')}>
                  {MEAL_LABELS[mealType]}
                </span>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all',
                  isActive ? 'border-[#1C1C1C] bg-[#1C1C1C]' : 'border-[#D0CCC8]'
                )} />
              </button>
              {isActive && (
                <div className="px-4 pb-4">
                  <p className="text-[13px] text-[#8A8480]">
                    {SLOT_OPTIONS[mealType][0].time_range}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full mt-2 bg-[#1C1C1C] text-white py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          )}
          Continue
        </button>
      </div>
    </StepWrapper>
  )
}
