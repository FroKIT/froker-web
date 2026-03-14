'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { Button } from '@/components/ui/Button'
import { MealCard } from '@/components/meals/MealCard'
import { Skeleton } from '@/components/ui/Skeleton'
import type { MealPlanEntry } from '@/types'

export default function MealsPreviewStep() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<MealPlanEntry[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch('/api/onboarding/preview-plan')
      .then(r => r.json())
      .then(d => {
        setPlan(d.plan || [])
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [])

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const packageId = sessionStorage.getItem('froker_package_id')
      const res = await fetch('/api/onboarding/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: packageId }),
      })
      if (!res.ok) throw new Error()
      toast.success('Your meal plan is ready!')
      router.push('/home')
    } catch {
      toast.error('Failed to confirm. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StepWrapper
      title="Your first week"
      subtitle="AI-curated just for you. Swap anything anytime."
      step={7}
      totalSteps={7}
      backHref="/onboarding/slots"
    >
      <div className="flex flex-col gap-3 mt-6">
        {fetching ? (
          Array(3)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : plan.length > 0 ? (
          plan.slice(0, 3).map(
            entry =>
              entry.meal && (
                <MealCard
                  key={entry.id}
                  meal={entry.meal}
                  mealType={entry.meal_type}
                  compact
                />
              )
          )
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Generating your personalised plan...</p>
          </div>
        )}

        {!fetching && plan.length > 3 && (
          <p className="text-sm text-center text-gray-400">
            +{plan.length - 3} more meals this week
          </p>
        )}

        <div className="bg-orange-50 rounded-2xl p-4 mt-2">
          <p className="text-sm text-orange-800">
            <span className="font-semibold">Tip:</span> You can swap any meal right up
            to 10 PM the night before delivery. Your AI chef is always on standby.
          </p>
        </div>

        <Button size="full" loading={loading} onClick={handleConfirm} className="mt-2">
          Confirm &amp; Start Plan
        </Button>
      </div>
    </StepWrapper>
  )
}
