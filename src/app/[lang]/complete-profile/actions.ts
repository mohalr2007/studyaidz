
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { type Locale } from '@/i18n-config';

export async function completeUserProfile(formData: FormData) {
  const supabase = createClient();
  const lang = formData.get('lang') as Locale | null;

  if (!lang) {
      return { error: 'Language not provided.' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  const studentData = {
    id: user.id,
    username: formData.get('username') as string,
    full_name: formData.get('full_name') as string,
    gender: (formData.get('gender') as "male" | "female"),
    field_of_study: formData.get('fieldOfStudy') as string,
    date_of_birth: (formData.get('dateOfBirth') as string),
    is_profile_complete: true,
    avatar_url: formData.get('avatar_url') as string,
  };
  
    // Check if a student record already exists
  const { data: existingStudent, error: selectError } = await supabase
    .from('students')
    .select('id')
    .eq('id', user.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking for existing student:', selectError);
    return { error: 'Failed to process profile.' };
  }

  let error;
  if (existingStudent) {
    // Update existing record
    const { error: updateError } = await supabase
      .from('students')
      .update({ ...studentData, id: undefined }) // Don't update the ID
      .eq('id', user.id);
    error = updateError;
  } else {
    // Insert new record
    const { error: insertError } = await supabase
      .from('students')
      .insert(studentData);
    error = insertError;
  }


  if (error) {
    console.error('Error saving profile:', error);
    return { error: 'Failed to save profile.' };
  }

  revalidatePath(`/${lang}/complete-profile`);
  redirect(`/${lang}/dashboard`);
}
