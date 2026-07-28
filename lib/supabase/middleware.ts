import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({
              name,
              value,
              ...options,
            })
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes here if needed (e.g., /profile)
  const pathname = request.nextUrl.pathname
  const isProtectedRoute = pathname.includes('/profile') || pathname.includes('/community/new') || pathname.includes('/admin')
  const isAdminRoute = pathname.includes('/admin')
  
  if (isProtectedRoute && !user) {
    // Redirect to login page with original intent
    const url = request.nextUrl.clone()
    url.pathname = `/${pathname.split('/')[1]}/login` // Keep locale
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && user) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()

    if (!adminProfile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = `/${pathname.split('/')[1]}`
      return NextResponse.redirect(url)
    }
  }

  return response
}
