
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/locales/get-locale';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // The lang might not be in the URL, so we fallback to the default
  const lang = await getLocale().catch(() => i18n.defaultLocale);
  
  if (code) {
    const supabase = createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
        const { data: student } = await supabase.from('students').select('is_profile_complete').eq('id', data.user.id).single();

        if (student && student.is_profile_complete) {
            return NextResponse.redirect(`${origin}/${lang}/dashboard`);
        }
        // Redirect to a lang-less route for profile completion
        return NextResponse.redirect(`${origin}/complete-profile`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/${lang}/?error=Could not process authentication`)
}
