

import { createBrowserClient } from '@supabase/ssr'

// Define the structure of your environment variables
// This ensures that TypeScript knows about these environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  // These variables are set in Vercel's environment variables settings
  // AI FIX: Enable session persistence to ensure the user remains logged in across browser sessions.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}
