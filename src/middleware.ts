

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // AI FIX: Prevent middleware crashes and handle missing environment variables.
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // AI FIX: Skip supabase client creation if keys are missing to prevent crashes.
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
    // AI FIX: Always return a valid response even on error to avoid crashing the request.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  // AI FIX: Limit middleware to authenticated routes for better performance and reduced risk.
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
