'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { MealCard } from '@/components/meals/MealCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { Meal } from '@/types'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'High Protein', value: 'high_protein' },
  { label: 'Low Calorie', value: 'low_cal' },
  { label: 'Vegan', value: 'vegan' },
]

export default function SwapMealPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const mealType = searchParams.get('meal_type') || 'lunch'
  const mealPlanId = params.id as string

  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [swapping, setSwapping] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/meals?meal_type=${mealType}`)
      .then(r => r.json())
      .then(d => { setMeals(d.meals || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [mealType])

  const filteredMeals = meals.filter(meal => {
    if (filter === 'vegetarian') return meal.is_vegetarian
    if (filter === 'vegan') return meal.is_vegan
    if (filter === 'high_protein') return meal.protein_g >= 25
    if (filter === 'low_cal') return meal.calories <= 400
    return true
  })

  const handleSwap = async (meal: Meal) => {
    setSwapping(meal.id)
    try {
      const res = await fetch('/api/plan/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal_plan_id: mealPlanId, new_meal_id: meal.id }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Swapped to ${meal.name}`)
      router.back()
    } catch {
      toast.error('Failed to swap meal')
    } finally {
      setSwapping(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4F0]">
      <Header title="Swap Meal" backHref="/plan" />

      {/* Filter chips */}
      <div className="bg-white px-5 py-3 border-b border-[#EEEBE6]">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium border transition-all',
                filter === f.value
                  ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                  : 'bg-white text-[#8A8480] border-[#EEEBE6]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-[12px] text-[#8A8480]">{filteredMeals.length} options</p>
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
        ) : (
          filteredMeals.map(meal => (
            <div key={meal.id} onClick={() => handleSwap(meal)} className="cursor-pointer">
              <MealCard
                meal={meal}
                className={swapping === meal.id ? 'pointer-events-none' : ''}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
