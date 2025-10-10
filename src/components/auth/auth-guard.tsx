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
        if (pathname !== '/') {
            router.replace('/');
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
        
      if (error && error.code !== 'PGRST116') { // PGRST116: row not found
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }
      
      const isProfileComplete = studentProfile?.is_profile_complete ?? false;

      if (!isProfileComplete) {
         if (pathname !== '/complete-profile') {
            router.replace('/complete-profile');
         }
      } else {
         if (pathname === '/complete-profile') {
            router.replace('/dashboard');
         }
      }
      setLoading(false);
    }

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser && pathname !== '/') {
            router.replace('/');
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth, pathname]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return <>{children}</>;
}
