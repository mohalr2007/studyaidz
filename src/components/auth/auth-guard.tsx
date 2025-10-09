
"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { syncUserAndCheckProfile } from '@/app/actions/user';
import { getFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { auth } = getFirebase();

  const [isSyncing, setIsSyncing] = useState(true);

  const publicPages = ['/login', '/signup'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (loading) {
      setIsSyncing(true);
      return;
    }

    if (!firebaseUser) {
      setIsSyncing(false);
      if (!isPublicPage) {
        router.replace('/login');
      }
      return;
    }

    // User is authenticated, now sync and check profile
    setIsSyncing(true);
    syncUserAndCheckProfile(firebaseUser)
      .then(profile => {
        // Double-check firebaseUser as state can change
        if (!firebaseUser) {
          setIsSyncing(false);
          return;
        }

        // REDIRECTION LOGIC
        if (!profile.isProfileComplete) {
          if (pathname !== '/complete-profile') {
            router.replace('/complete-profile');
          }
        } else { // Profile is complete
          if (isPublicPage || pathname === '/complete-profile' || pathname === '/') {
            router.replace('/dashboard');
          }
        }
        setIsSyncing(false);
      })
      .catch(error => {
        console.error("AuthGuard sync failed:", error);
        toast({ title: "Error", description: "Could not verify user profile. Please try again.", variant: "destructive" });
        setIsSyncing(false);
        if (auth) {
          auth.signOut(); // Sign out on error
        }
        router.replace('/login');
      });

  }, [firebaseUser, loading, pathname, router, auth, toast, isPublicPage]);
  
  if (loading || isSyncing) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // While any redirection logic is processing, show a loader
  if (firebaseUser) {
      if (user && !user.isProfileComplete && pathname !== '/complete-profile') {
          return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
      }
      if (isPublicPage || pathname === '/complete-profile' && user?.isProfileComplete) {
          return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
      }
  }

  if (!firebaseUser && !isPublicPage) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }

  // Render the page content
  return <>{children}</>;
}
