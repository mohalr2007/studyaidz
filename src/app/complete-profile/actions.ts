
'use server';

import { createClient } from '@/lib/supabase/server'; // added by AI — Supabase profile connection
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getLocale } from '@/lib/locales/get-locale';

export async function completeUserProfile(formData: FormData) {
  const supabase = createClient(); // added by AI — Supabase profile connection
  const lang = await getLocale(); // added by AI — Supabase profile connection

  const { // added by AI — Supabase profile connection
    data: { user }, // added by AI — Supabase profile connection
  } = await supabase.auth.getUser(); // added by AI — Supabase profile connection

  if (!user) { // added by AI — Supabase profile connection
    return { error: 'User not authenticated' }; // added by AI — Supabase profile connection
  } // added by AI — Supabase profile connection

  const profileData = { // added by AI — Supabase profile connection
    user_id: user.id, // added by AI — Supabase profile connection
    email: user.email!, // added by AI — Supabase profile connection
    full_name: formData.get('full_name') as string, // added by AI — Supabase profile connection
    username: formData.get('username') as string, // added by AI — Supabase profile connection
    gender: formData.get('gender') as string, // added by AI — Supabase profile connection
    field_of_study: formData.get('fieldOfStudy') as string, // added by AI — Supabase profile connection
    birthdate: formData.get('dateOfBirth') as string, // added by AI — Supabase profile connection
  }; // added by AI — Supabase profile connection

  const { error } = await supabase.from('profiles').upsert(profileData, { onConflict: 'user_id' }); // added by AI — Supabase profile connection

  if (error) { // added by AI — Supabase profile connection
    console.error('Error saving profile:', error); // added by AI — Supabase profile connection
    return { error: 'Failed to save profile.' }; // added by AI — Supabase profile connection
  } // added by AI — Supabase profile connection

  revalidatePath('/complete-profile'); // added by AI — Supabase profile connection
  return { error: null }; // added by AI — Supabase profile connection
}
