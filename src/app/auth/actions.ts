
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Provider } from '@supabase/supabase-js'
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const supabase = createClient();
  const lang = formData.get('lang') || 'ar';

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // TODO: Add better error handling and display to user
    console.error("Login Error:", error.message);
    return redirect(`/${lang}/?error=Could not authenticate user`);
  }

  revalidatePath("/", "layout");
  return redirect(`/${lang}/dashboard`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const lang = formData.get('lang') || 'ar';
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup Error:", error.message);
    if (error.message.includes('Password should be at least 6 characters')) {
      return redirect(`/${lang}/?error=Password should be at least 6 characters`);
    }
    return redirect(`/${lang}/?error=Could not authenticate user`);
  }

  revalidatePath("/", "layout");
  return redirect(`/${lang}/complete-profile`);
}


export async function loginWithProvider(formData: FormData) {
  const provider = formData.get('provider') as Provider | null;
  const lang = formData.get('lang') || 'ar';
  if (!provider) {
    return redirect(`/${lang}/?error=No provider selected`);
  }

  const supabase = createClient();
  
  // AI FIX: Safe origin fallback for OAuth to avoid undefined redirect in preview environments.
  const origin = headers().get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

  if (!origin) {
    console.error("OAuth Error: Could not determine origin for redirectTo. Please set NEXT_PUBLIC_SITE_URL environment variable.");
    return redirect(`/${lang}/?error=Configuration error with authentication provider`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth Error:', error);
    return redirect(`/${lang}/?error=Could not authenticate with provider`);
  }

  return redirect(data.url);
}

export async function logout(formData: FormData) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const lang = formData.get('lang') || 'ar';
  redirect(`/${lang}`);
}
