
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// This component protects routes by checking for an active user session.
// It also checks if the user's profile is complete.

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      // 1. If no user, redirect to /auth unless already there
      if (!user) {
        if (pathname !== '/auth') {
          router.replace('/auth');
        }
        setLoading(false);
        return;
      }

      // 2. If user exists, check for profile completion
      const { data: studentProfile } = await supabase
        .from('students')
        .select('is_profile_complete')
        .eq('id', user.id)
        .single();
        
      const isProfileComplete = studentProfile?.is_profile_complete ?? false;

      // 3. If profile is not complete, redirect to /complete-profile unless already there
      if (!isProfileComplete) {
        if (pathname !== '/complete-profile') {
          router.replace('/complete-profile');
        }
        setLoading(false);
        return;
      }

      // 4. If profile is complete, redirect to /dashboard if on /auth or /complete-profile
      if (isProfileComplete && (pathname === '/auth' || pathname === '/complete-profile')) {
        router.replace('/dashboard');
        setLoading(false);
        return;
      }

      // 5. If everything is fine, stop loading
      setLoading(false);
    };

    checkSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Re-run the check whenever the auth state changes
      checkSessionAndProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
