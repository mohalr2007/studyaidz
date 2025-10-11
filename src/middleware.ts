

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // added by AI — safe fix: Prevent middleware crashes
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // added by AI — safe fix: Skip supabase client creation if keys are missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase URL or Anon Key is missing in environment variables. Skipping middleware logic.');
      return response;
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    await supabase.auth.getSession()

    return response;
  } catch (err) {
    console.error("Middleware crash prevented:", err);
    // added by AI — safe fix: Always return a valid response even on error
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  // added by AI — safe fix: Limit middleware to authenticated routes
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/summaries/:path*',
    '/chat/:path*',
    '/quizzes/:path*',
    '/community/:path*',
    '/complete-profile',
  ],
}
