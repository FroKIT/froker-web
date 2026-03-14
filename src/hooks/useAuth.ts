'use client'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { useCallback } from 'react'

export function useAuth() {
  const { user, isOnboarded, setUser, setOnboarded, clear } = useAuthStore()

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clear()
  }, [clear])

  return { user, isOnboarded, setUser, setOnboarded, signOut }
}
