import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const COOKIE_NAME = 'froker_session'
const EXPIRY_DAYS = 30

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!)
}

export async function createSession(
  response: NextResponse,
  userId: string,
  phone: string
): Promise<void> {
  const token = await new SignJWT({ phone })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(getSecret())

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: EXPIRY_DAYS * 24 * 60 * 60,
    path: '/',
  })
}

export function clearSession(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

export async function verifySession(token: string): Promise<{ id: string; phone: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return { id: payload.sub as string, phone: payload.phone as string }
  } catch {
    return null
  }
}
