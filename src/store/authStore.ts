import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  isOnboarded: boolean
  setUser: (user: User | null) => void
  setOnboarded: (v: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      clear: () => set({ user: null, isOnboarded: false }),
    }),
    { name: 'froker-auth' }
  )
)
