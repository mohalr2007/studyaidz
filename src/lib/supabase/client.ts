

import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '@/types/supabase'

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
  // These variables are set in your .env.local file or environment variables
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // This ensures the session is persisted in cookies, making it available
        // to server components and server-side rendering.
        persistSession: true,
        autoRefreshToken: true,
        // This is crucial for OAuth flows, as it detects the session from the URL
        detectSessionInUrl: true,
      },
    }
  )
}
