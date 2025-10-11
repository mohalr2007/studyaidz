

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
        // added by AI — safe fix: Redirect to complete profile after first login
        return NextResponse.redirect(`${origin}/complete-profile`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=Could not process authentication`)
}
