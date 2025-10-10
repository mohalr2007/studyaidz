
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

      // Public routes that don't need auth
      const isPublicRoute = ['/auth'].includes(pathname);
       // The route for completing the profile, which requires a user but not a complete profile
      const isProfileCompletionRoute = pathname === '/complete-profile';


      // 1. If no user session, and the route is not public, redirect to /auth
      if (!user && !isPublicRoute) {
        router.replace('/auth');
        return;
      }

      // 2. If a user session exists
      if (user) {
        // Check for profile completion
        const { data: studentProfile } = await supabase
          .from('students')
          .select('is_profile_complete')
          .eq('id', user.id)
          .single();
          
        const isProfileComplete = studentProfile?.is_profile_complete ?? false;

        // If profile is not complete, and we are NOT on the completion page, redirect there
        if (!isProfileComplete && !isProfileCompletionRoute) {
            router.replace('/complete-profile');
            return;
        }

        // If profile IS complete, and we are on a public or profile completion page, redirect to dashboard
        if (isProfileComplete && (isPublicRoute || isProfileCompletionRoute)) {
            router.replace('/dashboard');
            return;
        }
      }

      // If none of the above conditions were met, stop loading and show the page
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
