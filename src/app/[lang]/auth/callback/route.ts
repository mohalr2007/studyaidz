
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/locales/get-locale';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/';
  
  // Fallback to 'ar' if the locale is not in the search params for some reason
  const lang = searchParams.get('lang') || await getLocale().catch(() => 'ar');
  
  if (code) {
    const supabase = createClient();
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
        // Now that we have a session, check if their profile is complete
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('is_profile_complete')
        .eq('id', session.user.id)
        .single();
      
      if (studentError && studentError.code !== 'PGRST116') { // 'PGRST116' means no rows found
        console.error('Error fetching student profile:', studentError);
        // Redirect to home with an error if we can't check the profile
        return NextResponse.redirect(`${origin}/${lang}/?error=Could not verify profile`);
      }

      // If a student record exists and the profile is complete, send to dashboard.
      if (student && student.is_profile_complete) {
          return NextResponse.redirect(`${origin}/${lang}/dashboard`);
      }
      
      // For any other case (new user, or existing user who didn't finish), send to complete-profile.
      return NextResponse.redirect(`${origin}/${lang}/complete-profile`);
    }

    if (error) {
        console.error('Auth callback session exchange error:', error);
    }
  }

  // Fallback: If no code or an error occurred, redirect to home with an error message
  console.warn("Callback handled but no session could be established or code was missing.");
  return NextResponse.redirect(`${origin}/${lang}/?error=Authentication session failed`);
}
