import { NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data: packages, error } = await adminSupabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price_inr')

    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ packages })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
