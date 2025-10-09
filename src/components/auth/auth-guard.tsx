
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

  const publicPages = ['/login', '/signup'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    // This effect handles the result from a Google Sign-In redirect.
    if (auth) {
        getRedirectResult(auth)
          .then((result) => {
            if (result) {
              console.log("Handled redirect result for user:", result.user.uid);
              // The onAuthStateChanged listener in AuthProvider will handle the user state update.
            }
          })
          .catch((error) => {
            console.error('Google Redirect Sign-In Error:', error);
            toast({
              title: 'Erreur de connexion',
              description: `Une erreur s'est produite lors de la connexion. Code: ${error.code}`,
              variant: 'destructive',
            });
          });
    }

    if (loading) {
      setIsSyncing(true);
      return; 
    }
    
    if (!firebaseUser) {
      // No user is logged in.
      setIsSyncing(false);
      if (!isPublicPage) {
        // If not on a public page, redirect to login.
        router.replace('/login');
      }
      return;
    }

    // User is authenticated via Firebase. Now check their profile status.
    setIsSyncing(true);
    syncUserAndCheckProfile(firebaseUser).then(profile => {
        if (!firebaseUser.emailVerified) {
            if (pathname !== '/verify-email') {
                router.replace('/verify-email');
            }
        } else if (!profile.isProfileComplete) {
            if (pathname !== '/complete-profile') {
                router.replace('/complete-profile');
            }
        } else { // Verified and profile complete
            if (isPublicPage || pathname === '/complete-profile' || pathname === '/verify-email' || pathname === '/') {
                router.replace('/dashboard');
            }
        }
        setIsSyncing(false);
    }).catch(error => {
        console.error("AuthGuard sync failed:", error);
        toast({ title: "Error", description: "Could not verify user profile. Please try again.", variant: "destructive" });
        setIsSyncing(false);
        if (auth) {
            auth.signOut();
        }
        router.replace('/login');
    });

  }, [firebaseUser, loading, router, pathname, auth, isPublicPage, toast]);

  if (loading || isSyncing) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- Render Logic ---
  // If we are still here, it means we have a firebaseUser.
  // We now decide what to render based on their profile status.

  if (!firebaseUser.emailVerified) {
    // If email is not verified, only show the verify-email page.
    // All other pages will show a loader until redirection is complete.
    return pathname === '/verify-email' ? <>{children}</> : null;
  }
  
  if (user && !user.isProfileComplete) {
    // If profile is not complete, only show the complete-profile page.
    return pathname === '/complete-profile' ? <>{children}</> : null;
  }
  
  if (isPublicPage || pathname === '/verify-email' || pathname === '/complete-profile' || pathname === '/') {
      // If profile is complete but user is on a public/intermediate page,
      // show nothing while redirecting to dashboard.
      return null;
  }

  // If everything is complete and user is on a protected page, show the content.
  return <>{children}</>;
}
