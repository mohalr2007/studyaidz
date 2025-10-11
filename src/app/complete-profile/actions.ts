
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
    return redirect(`/${lang}/?error=User not found`);
  }

  const userData = {
    id: user.id, // Ensure id is included for upsert
    username: formData.get('username') as string,
    full_name: formData.get('name') as string,
    gender: formData.get('gender') as 'male' | 'female',
    date_of_birth: formData.get('dateOfBirth') as string,
    field_of_study: formData.get('fieldOfStudy') as string,
    is_profile_complete: true,
  };
  
  // Upsert the student profile
  const { error } = await supabase.from('students').upsert(userData);


  if (error) {
    console.error('Error updating profile:', error);
    return redirect(`/${lang}/complete-profile?error=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect(`/${lang}/dashboard`);
}
