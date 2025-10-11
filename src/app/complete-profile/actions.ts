
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getLocale } from '@/lib/locales/get-locale';

export async function completeUserProfile(formData: FormData) {
  const supabase = createClient();
  const lang = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This should ideally not happen if the user is on this page
    return redirect(`/${lang}/?error=User not found`);
  }

  const userData = {
    id: user.id, // Ensure id is included for upsert
    username: formData.get('username') as string,
    full_name: formData.get('full_name') as string,
    gender: formData.get('gender') as 'male' | 'female',
    date_of_birth: formData.get('dateOfBirth') as string,
    field_of_study: formData.get('fieldOfStudy') as string,
    is_profile_complete: true,
  };
  
  // Upsert the student profile. 'upsert' will create the row if it doesn't exist (e.g., social login),
  // or update it if it does (e.g., email signup where the row might be partially created).
  const { error } = await supabase.from('students').upsert(userData);


  if (error) {
    console.error('Error completing profile:', error);
    // Redirect back to the form with a specific error message
    return redirect(`/complete-profile?error=${encodeURIComponent(error.message)}`);
  }

  // Revalidate user-related data across the app
  revalidatePath('/', 'layout');
  // Redirect to the dashboard in their selected language
  redirect(`/${lang}/dashboard`);
}
