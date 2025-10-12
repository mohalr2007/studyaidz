
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
  
  const avatarUrl = formData.get('avatar_url') as string;

  // Update user metadata which is used across the app (e.g., in the UserNav)
  const { error: userUpdateError } = await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl }
  })

  if (userUpdateError) {
      console.error('Error updating user metadata:', userUpdateError);
      return redirect(`/complete-profile?error=${encodeURIComponent(userUpdateError.message)}`);
  }

  // Then, upsert the student's profile data
  const studentData = {
    id: user.id,
    username: formData.get('username') as string,
    full_name: formData.get('full_name') as string,
    gender: formData.get('gender') as 'male' | 'female',
    date_of_birth: formData.get('dateOfBirth') as string,
    field_of_study: formData.get('fieldOfStudy') as string,
    is_profile_complete: true,
    avatar_url: avatarUrl, // Also save it in the students table
  };
  
  const { error } = await supabase.from('students').upsert(studentData);


  if (error) {
    console.error('Error completing profile:', error);
    return redirect(`/complete-profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/', 'layout');
  redirect(`/${lang}/dashboard`);
}
