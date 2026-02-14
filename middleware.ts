import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isLoginPage = path === '/login'
  const isBookmarksPage = path.startsWith('/bookmarks')

  if (!user && isBookmarksPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/bookmarks', request.url))
  }

  return response
}

export const config = {
  matcher: ['/login', '/bookmarks/:path*'],
}
