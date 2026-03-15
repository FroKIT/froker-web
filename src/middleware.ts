import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = ['/', '/login']
  const isPublicPath = publicPaths.some(p => pathname === p || (p !== '/' && pathname.startsWith(p)))
  const isApiPath = pathname.startsWith('/api')
  const isOnboardingPath = pathname.startsWith('/onboarding')
  const isStaticPath = pathname.startsWith('/_next') || pathname.includes('.')

  if (isApiPath || isStaticPath) return NextResponse.next()

  const token = request.cookies.get('froker_session')?.value
  const user = token ? await verifySession(token) : null

  if (!user && !isPublicPath && !isOnboardingPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isPublicPath) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
