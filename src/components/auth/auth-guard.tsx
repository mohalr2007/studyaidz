
"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { syncUserAndCheckProfile } from '@/app/actions/user';
import { getRedirectResult } from 'firebase/auth';
import { getFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { auth } = getFirebase();

  const [isSyncing, setIsSyncing] = useState(true);

  const publicPages = ['/login', '/signup', '/verify-email'];
  const isAuthPage = publicPages.includes(pathname);
  const isProfilePage = pathname === '/complete-profile';
  const isHomePage = pathname === '/';

  useEffect(() => {
    // This effect handles the result from a Google Sign-In redirect.
    // It should run only once when the component mounts.
    const handleRedirectResult = async () => {
      setIsSyncing(true);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // If there's a result, it means the user just signed in via redirect.
          // The onAuthStateChanged listener in AuthProvider will handle the user state update.
          // We don't need to do anything else here, just let the main effect take over.
          console.log("Handled redirect result for user:", result.user.uid);
        }
      } catch (error: any) {
        console.error('Google Redirect Sign-In Error:', error);
        toast({
          title: 'Erreur de connexion',
          description: `Une erreur s'est produite lors de la connexion. Code: ${error.code}`,
          variant: 'destructive',
        });
      } finally {
        // We set isSyncing to false here to allow the main logic to proceed,
        // even if there was no redirect result to process.
        setIsSyncing(false);
      }
    };

    handleRedirectResult();
  }, [auth, toast]);


  useEffect(() => {
    // This is the main effect that enforces authentication and profile completion.
    // It depends on the user state from `useAuth`.
    if (loading) {
      // If auth state is still loading, wait.
      return; 
    }

    if (!firebaseUser) {
      // No user is logged in.
      setIsSyncing(false);
      if (!isAuthPage) {
        // If not on a public page, redirect to login.
        router.replace('/login');
      }
      return;
    }

    // User is authenticated via Firebase. Now check their profile status.
    setIsSyncing(true);
    syncUserAndCheckProfile(firebaseUser).then(profile => {
        if (!firebaseUser.emailVerified) {
            // User's email is not verified.
            if (pathname !== '/verify-email') {
                router.replace('/verify-email');
            }
        } else if (!profile.isProfileComplete) {
            // User's profile is incomplete.
            if (pathname !== '/complete-profile') {
                router.replace('/complete-profile');
            }
        } else { // Verified and profile complete, they are good to go.
            if (isAuthPage || isProfilePage || isHomePage) {
                // If they are on an auth page, profile page, or the root, redirect to dashboard.
                router.replace('/dashboard');
            }
        }
        setIsSyncing(false);
    }).catch(error => {
        console.error("AuthGuard sync failed:", error);
        toast({ title: "Error", description: "Could not verify user profile. Please try again.", variant: "destructive" });
        setIsSyncing(false);
        // If anything fails, send them back to login for safety.
        if (!isAuthPage) {
            router.replace('/login');
        }
    });

  }, [firebaseUser, loading, router, pathname, toast]);

  if (loading || isSyncing) {
    // Show a loading spinner while checking auth state or syncing the profile.
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- Render Logic ---
  // This logic determines whether to show the page content or nothing (while redirecting).
  
  if (!firebaseUser) {
    // If not logged in, only show auth pages.
    return isAuthPage ? <>{children}</> : null;
  }
  
  if (!firebaseUser.emailVerified) {
      // If email is not verified, only show the verification page.
      return pathname === '/verify-email' ? <>{children}</> : null;
  }

  if (user && !user.isProfileComplete) {
      // If profile is not complete, only show the profile completion page.
      return pathname === '/complete-profile' ? <>{children}</> : null;
  }

  if (user && user.isProfileComplete && !isAuthPage && !isProfilePage) {
    // If profile is complete and they are not on an auth/profile page, show the content.
    return <>{children}</>;
  }

  // In all other cases (e.g., a fully authenticated user on the login page),
  // show a loader while they are being redirected.
  return (
     <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
     </div>
  );
}
