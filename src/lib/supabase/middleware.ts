import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't need auth
  const publicPaths = ['/login', '/verify']
  const isPublicPath = publicPaths.some(p => pathname.startsWith(p))
  const isOnboardingPath = pathname.startsWith('/onboarding')
  const isApiPath = pathname.startsWith('/api')

  if (isApiPath) return supabaseResponse

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isPublicPath) {
    // Check if onboarded
    const { data: userData } = await supabase
      .from('users')
      .select('is_onboarded')
      .eq('id', user.id)
      .single()

    if (!userData?.is_onboarded && !isOnboardingPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/profile'
      return NextResponse.redirect(url)
    }

    if (userData?.is_onboarded) {
      const url = request.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
