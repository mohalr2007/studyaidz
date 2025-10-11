
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/locales/get-locale';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const lang = searchParams.get('lang') || await getLocale().catch(() => 'ar');
  
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
    // This case might be for password-based logins if they ever get redirected here,
    // though typically they won't. It's a safe fallback.
    const { data } = await supabase.auth.getSession();
    session = data.session;
    if (!session) {
      console.warn("Callback handled but no session found, redirecting to login.");
      return NextResponse.redirect(`${origin}/${lang}/?error=Could not process authentication`);
    }
  }
  
  if (session?.user) {
      // Now that we have a session, check if their profile is complete
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('is_profile_complete')
        .eq('id', session.user.id)
        .single();
      
      if (studentError && studentError.code !== 'PGRST116') { // 'PGRST116' means no rows found, which is expected for new users
        console.error('Error fetching student profile:', studentError);
        return NextResponse.redirect(`${origin}/${lang}/?error=Could not verify profile`);
      }

      // If a student record exists and the profile is complete, send to dashboard.
      if (student && student.is_profile_complete) {
          return NextResponse.redirect(`${origin}/${lang}/dashboard`);
      }
      
      // For any other case (new user, or existing user who didn't finish), send to complete-profile.
      return NextResponse.redirect(`${origin}/complete-profile`);
  }

  // Fallback: If no user session for any reason, redirect to home with an error
  console.error("Callback handled but session could not be established.");
  return NextResponse.redirect(`${origin}/${lang}/?error=Authentication session failed`);
}
