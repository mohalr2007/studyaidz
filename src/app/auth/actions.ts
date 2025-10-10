
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Provider } from '@supabase/supabase-js'
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // TODO: Add better error handling and display to user
    console.error("Login Error:", error.message);
    redirect("/auth?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup Error:", error.message);
    if (error.message.includes('Password should be at least 6 characters')) {
      return redirect('/auth?error=Password should be at least 6 characters');
    }
    return redirect("/auth?error=Could not authenticate user");
  }

  // A new user is created, but their profile is not.
  // The AuthGuard will redirect them to /complete-profile
  revalidatePath("/", "layout");
  redirect("/dashboard");
}


export async function loginWithProvider(formData: FormData) {
  const provider = formData.get('provider') as Provider | null;
  if (!provider) {
    return redirect('/auth?error=No provider selected');
  }

  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth Error:', error);
    return redirect('/auth?error=Could not authenticate with provider');
  }

  return redirect(data.url);
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
