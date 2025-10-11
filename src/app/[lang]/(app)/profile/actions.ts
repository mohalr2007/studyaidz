
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateStudentProfile(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  const profileData = {
    full_name: formData.get('full_name') as string,
    date_of_birth: formData.get('date_of_birth') as string,
    field_of_study: formData.get('field_of_study') as string,
  };

  const { error } = await supabase
    .from('students')
    .update(profileData)
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile.' };
  }

  revalidatePath('/profile');
  return { error: null };
}
