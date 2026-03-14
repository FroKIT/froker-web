import { create } from 'zustand'
import { MealPlanEntry } from '@/types'

interface MealState {
  todaysPlan: MealPlanEntry[]
  weekPlan: Record<string, MealPlanEntry[]>
  setTodaysPlan: (plan: MealPlanEntry[]) => void
  setWeekPlan: (plan: Record<string, MealPlanEntry[]>) => void
  skipMeal: (entryId: string) => void
  unskipMeal: (entryId: string) => void
}

export const useMealStore = create<MealState>((set) => ({
  todaysPlan: [],
  weekPlan: {},
  setTodaysPlan: (todaysPlan) => set({ todaysPlan }),
  setWeekPlan: (weekPlan) => set({ weekPlan }),
  skipMeal: (entryId) =>
    set((state) => ({
      todaysPlan: state.todaysPlan.map((e) =>
        e.id === entryId ? { ...e, is_skipped: true } : e
      ),
    })),
  unskipMeal: (entryId) =>
    set((state) => ({
      todaysPlan: state.todaysPlan.map((e) =>
        e.id === entryId ? { ...e, is_skipped: false } : e
      ),
    })),
}))
