
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/locales/get-locale';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // The lang is now in the URL, but we still have a fallback just in case.
  const lang = await getLocale().catch(() => 'ar');
  
  const supabase = createClient();
  let session;

  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback session exchange error:', error);
      return NextResponse.redirect(`${origin}/${lang}/?error=Authentication failed`);
    }
    session = data.session;
  } else {
    // For password-based login, session is already in cookies
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }
  
  if (session?.user) {
      // Check if student profile exists and is complete
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('is_profile_complete')
        .eq('id', session.user.id)
        .single();
      
      if (studentError && studentError.code !== 'PGRST116') { // 'PGRST116' means no rows found
        console.error('Error fetching student profile:', studentError);
        return NextResponse.redirect(`${origin}/${lang}/?error=Could not verify profile`);
      }

      // If student exists and profile is complete, go to dashboard
      if (student && student.is_profile_complete) {
          return NextResponse.redirect(`${origin}/${lang}/dashboard`);
      }
      
      // Otherwise, user needs to complete their profile
      // The /complete-profile page is outside the [lang] directory structure.
      return NextResponse.redirect(`${origin}/complete-profile`);
  }

  // If no user session, redirect to home with an error
  return NextResponse.redirect(`${origin}/${lang}/?error=Could not process authentication`);
}
