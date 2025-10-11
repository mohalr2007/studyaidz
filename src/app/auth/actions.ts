
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Provider } from '@supabase/supabase-js'
import { headers } from "next/headers";
import { getLocale } from "@/lib/locales/get-locale";

export async function login(formData: FormData) {
  const supabase = createClient();
  const lang = await getLocale();

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

  // After a successful login, the callback logic will handle redirection.
  // We revalidate and redirect to the callback handler.
  revalidatePath("/", "layout");
  return redirect(`/${lang}/auth/callback`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const lang = await getLocale();
  const origin = headers().get("origin");
  
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

  // After signup, the user still needs to confirm their email,
  // but we immediately direct them to complete their profile.
  // The session will be available upon the next login or after email confirmation callback.
  revalidatePath("/", "layout");
  // AI: Redirect to the absolute URL for the complete-profile page to avoid 404 errors.
  return redirect(`${origin}/complete-profile`);
}


export async function loginWithProvider(formData: FormData) {
  const provider = formData.get('provider') as Provider | null;
  const lang = await getLocale();

  if (!provider) {
    return redirect(`/${lang}/?error=No provider selected`);
  }

  const supabase = createClient();
  
  const origin = headers().get("origin");

  if (!origin) {
    console.error("OAuth Error: Could not determine origin for redirectTo.");
    return redirect(`/${lang}/?error=Configuration error with authentication provider`);
  }

  // AI FIX: The redirectTo URL must include the locale to work with the i18n setup.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/${lang}/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth Error:', error);
    return redirect(`/${lang}/?error=Could not authenticate with provider`);
  }

  return redirect(data.url);
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  const lang = await getLocale();
  redirect(`/${lang}`);
}
