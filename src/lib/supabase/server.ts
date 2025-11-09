
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers'
import { type Database } from '@/types/supabase';

// Define the structure of your environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

// The cookie object is passed in from the middleware or server components
export function createClient(cookieStore?: ReadonlyRequestCookies) {
    const store = cookieStore || cookies();
  
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get(name: string) {
            return store.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
            try {
                store.set({ name, value, ...options })
            } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
            }
            },
            remove(name: string, options: CookieOptions) {
            try {
                store.set({ name, value: '', ...options })
            } catch (error) {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
            }
            },
        },
        }
    )
}
