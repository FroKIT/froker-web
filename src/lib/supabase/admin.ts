import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — only created at runtime, not at build time
let _client: SupabaseClient | null = null

export const adminSupabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) {
      _client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    }
    const value = (_client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(_client) : value
  },
})
