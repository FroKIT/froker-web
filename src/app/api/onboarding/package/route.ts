import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const { package_id } = await request.json()
    if (!package_id) return NextResponse.json({ message: 'Package ID required' }, { status: 400 })
    // package_id is stored client-side in sessionStorage and sent to the confirm route
    return NextResponse.json({ success: true, package_id })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
