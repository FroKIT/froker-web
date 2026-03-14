import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { adminSupabase } from '@/lib/supabase/admin'

interface SlotRow {
  meal_type: string
  slot_label: string
  time_start: string
  time_end: string
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { slots } = await request.json()
    const rows = slots.map((s: SlotRow) => ({ user_id: user.id, ...s }))

    const { error } = await adminSupabase
      .from('delivery_slots')
      .upsert(rows, { onConflict: 'user_id,meal_type' })

    if (error) return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
