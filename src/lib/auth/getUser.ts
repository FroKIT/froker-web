import { NextRequest } from 'next/server'
import { verifySession } from './session'

export interface SessionUser {
  id: string
  phone: string
}

export async function getUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get('froker_session')?.value
  if (!token) return null
  return verifySession(token)
}
