'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'

const GOALS = [
  { value: 'weight_loss', label: 'Lose weight', desc: 'Calorie-controlled, satisfying meals' },
  { value: 'muscle_gain', label: 'Build muscle', desc: 'High protein, balanced nutrition' },
  { value: 'maintenance', label: 'Stay healthy', desc: 'Balanced meals, steady energy' },
  { value: 'medical', label: 'Medical diet', desc: 'Condition-specific meal planning' },
]

export default function GoalsStep() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [goal, setGoal] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const handleContinue = async () => {
    if (!goal) return toast.error('Select a goal to continue')
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          height_cm: height ? parseFloat(height) : null,
          weight_kg: weight ? parseFloat(weight) : null,
        }),
      })
      if (!res.ok) throw new Error()
      router.push('/onboarding/packages')
    } catch {
      toast.error('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepWrapper
      title="What's your goal?"
      subtitle="This shapes your meal plan and calorie targets"
      step={3}
      totalSteps={7}
      backHref="/onboarding/health"
    >
      <div className="flex flex-col gap-6 mt-6">

        {/* Goal cards */}
        <div className="flex flex-col gap-2">
          {GOALS.map(g => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={cn(
                'w-full text-left px-4 py-4 rounded-2xl border transition-all bg-white',
                goal === g.value ? 'border-[#1C1C1C]' : 'border-[#EEEBE6]'
              )}
            >
              <p className={cn('text-[15px] font-semibold transition-all', goal === g.value ? 'text-[#1C1C1C]' : 'text-[#8A8480]')}>{g.label}</p>
              <p className="text-[13px] text-[#8A8480] mt-0.5">{g.desc}</p>
            </button>
          ))}
        </div>

        {/* Body metrics */}
        <div>
          <p className="text-[13px] font-medium text-[#8A8480] mb-3">
            Body metrics <span className="font-normal">— optional, improves accuracy</span>
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center bg-white border border-[#EEEBE6] rounded-xl overflow-hidden">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Height"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="flex-1 px-4 py-3.5 text-[15px] text-[#1C1C1C] placeholder:text-[#C8C3BC] bg-transparent focus:outline-none"
              />
              <span className="pr-4 text-[13px] text-[#8A8480] font-medium">cm</span>
            </div>
            <div className="flex items-center bg-white border border-[#EEEBE6] rounded-xl overflow-hidden">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Weight"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="flex-1 px-4 py-3.5 text-[15px] text-[#1C1C1C] placeholder:text-[#C8C3BC] bg-transparent focus:outline-none"
              />
              <span className="pr-4 text-[13px] text-[#8A8480] font-medium">kg</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#1C1C1C] text-white py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
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
