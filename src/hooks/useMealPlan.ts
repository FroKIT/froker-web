'use client'
import { useMealStore } from '@/store/mealStore'
import { useCallback } from 'react'

export function useMealPlan() {
  const { todaysPlan, weekPlan, setTodaysPlan, setWeekPlan, skipMeal } = useMealStore()

  const fetchTodaysPlan = useCallback(async () => {
    const res = await fetch('/api/plan')
    const data = await res.json()
    setTodaysPlan(data.plan ?? [])
  }, [setTodaysPlan])

  return { todaysPlan, weekPlan, fetchTodaysPlan, setWeekPlan, skipMeal }
}
