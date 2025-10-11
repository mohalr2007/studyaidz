

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
        const { data: student } = await supabase.from('students').select('is_profile_complete').eq('id', data.user.id).single();

        if (student && student.is_profile_complete) {
            return NextResponse.redirect(`${origin}/dashboard`);
        }
        return NextResponse.redirect(`${origin}/complete-profile`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=Could not process authentication`)
}
