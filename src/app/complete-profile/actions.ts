'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/?error=User not found')
  }

  const profileData = {
    id: user.id,
    full_name: formData.get('full_name') as string,
    username: formData.get('username') as string,
    gender: formData.get('gender') as 'male' | 'female',
    date_of_birth: formData.get('date_of_birth') as string,
    field_of_study: formData.get('field_of_study') as string,
    is_profile_complete: true,
  }

  const { error } = await supabase.from('students').upsert(profileData)

  if (error) {
    console.error('Error updating profile:', error)
    return redirect('/complete-profile?error=Could not update profile')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
