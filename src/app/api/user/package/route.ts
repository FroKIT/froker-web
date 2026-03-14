import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ meals_per_day: 3 })
}
