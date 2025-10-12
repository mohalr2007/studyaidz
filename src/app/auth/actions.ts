
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
  // We revalidate and redirect to the callback handler, passing the lang.
  revalidatePath("/", "layout");
  return redirect(`/${lang}/auth/callback?lang=${lang}`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const lang = await getLocale();
  const origin = headers().get("origin");
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // We need to include the callback URL for email confirmation
  const { error } = await supabase.auth.signUp({
      ...data,
      options: {
          emailRedirectTo: `${origin}/${lang}/auth/callback?lang=${lang}`
      }
  });

  if (error) {
    console.error("Signup Error:", error.message);
    if (error.message.includes('Password should be at least 6 characters')) {
      return redirect(`/${lang}/?error=Password should be at least 6 characters`);
    }
    return redirect(`/${lang}/?error=Could not authenticate user`);
  }
  
  // After signup, we immediately direct them to complete their profile.
  revalidatePath("/", "layout");
  return redirect(`/${lang}/complete-profile`);
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

  // The redirectTo URL must include the locale to work with the i18n setup.
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
  // We perform a redirect which will be caught by the middleware to direct to the correct locale page.
  // The client-side logout handler will force a page reload.
  redirect(`/${lang}`);
}
