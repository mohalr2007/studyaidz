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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        if (pathname !== '/auth') {
            router.replace('/auth');
        }
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Check if profile is complete
      const { data: studentProfile, error } = await supabase
        .from('students')
        .select('is_profile_complete')
        .eq('id', currentUser.id)
        .single();
        
      // If there's an error (other than no row found), or if the profile doesn't exist,
      // assume the profile is not complete and redirect to the completion page.
      // After adding RLS policies, the main error would be the profile not existing yet.
      const isProfileComplete = studentProfile?.is_profile_complete ?? false;

      if (error && error.code !== 'PGRST116') { // PGRST116: row not found
        // This case is now less likely with RLS, but as a fallback, we go to complete profile.
         if (pathname !== '/complete-profile') {
            router.replace('/complete-profile');
         }
         setLoading(false);
         return;
      }

      if (!isProfileComplete) {
         if (pathname !== '/complete-profile') {
            router.replace('/complete-profile');
         }
      } else {
         if (pathname === '/complete-profile' || pathname === '/auth') {
            router.replace('/dashboard');
         }
      }
      setLoading(false);
    }

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser && pathname !== '/auth') {
            router.replace('/auth');
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [router, supabase, pathname]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  // If there's no user and we are on the auth page, show the auth page.
  if (!user && pathname === '/auth') {
    return <>{children}</>;
  }

  // If there is a user and the profile is not complete, show the complete-profile page
  if (user && pathname === '/complete-profile') {
      return <>{children}</>;
  }

  // If there is a user and the profile is complete, show the protected content.
  if (user && pathname !== '/auth' && pathname !== '/complete-profile') {
    return <>{children}</>;
  }

  // Otherwise, we are likely still loading or in a redirect state.
  return (
    <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
    </div>
  );
}
