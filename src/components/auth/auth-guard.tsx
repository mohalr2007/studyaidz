"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { syncUser } from '@/app/actions/user';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [isSyncing, setIsSyncing] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/verify-email';
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleRedirectResult = async () => {
      // Avoid running this on every page load, only when coming back to the login page.
      if (pathname === '/login') {
          try {
            setIsSyncing(true);
            const result = await getRedirectResult(auth);
            if (result) {
              // User has successfully signed in via redirect.
              // syncUser will create a new doc or update last login.
              await syncUser(result.user);
              // The main useEffect below will handle redirection to the dashboard.
            }
          } catch (error: any) {
            console.error('Google Redirect Sign-In Error:', error);
            // This error is often a 403 if the domain is not authorized in Firebase Console.
            if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/network-request-failed') {
                 toast({
                    title: 'Erreur de configuration',
                    description: `Le domaine de cette application n'est pas autorisé. Veuillez l'ajouter aux "Authorized domains" dans votre console Firebase.`,
                    variant: 'destructive',
                });
            } else {
                 toast({
                    title: 'Erreur de connexion',
                    description: `Une erreur s'est produite lors de la connexion. Code: ${error.code}`,
                    variant: 'destructive',
                });
            }
          } finally {
             setIsSyncing(false);
          }
      }
    };

    handleRedirectResult();
  }, [pathname, toast]);


  useEffect(() => {
    if (loading || isSyncing) {
      return; // Wait for the auth state and any sync process to be determined.
    }

    if (!firebaseUser) {
      // If there's no user, and they are not on an auth page, redirect to login.
      if (!isAuthPage) {
        router.replace('/login');
      }
      return;
    }

    if (firebaseUser.emailVerified) {
      // If user is verified and on an auth page or the root page, redirect to dashboard.
      if (isAuthPage || isHomePage) {
        router.replace('/dashboard');
      }
    } else {
      // If user is not verified, and not on the verify-email page, redirect them there.
      if (pathname !== '/verify-email') {
        router.replace('/verify-email');
      }
    }
  }, [user, firebaseUser, loading, isSyncing, router, pathname, isAuthPage, isHomePage]);

  // While loading/syncing, or if a redirect is in progress, show a loader.
  if (loading || isSyncing) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- Render Logic ---

  if (!firebaseUser) {
    // If no user, only render the login page.
    return pathname === '/login' ? <>{children}</> : null;
  }

  if (!firebaseUser.emailVerified) {
    // If user exists but is not verified, only render the verify-email page.
    return pathname === '/verify-email' ? <>{children}</> : null;
  }

  // If user is logged in and verified, render app content but not auth pages.
  if (firebaseUser.emailVerified && !isAuthPage) {
    return <>{children}</>;
  }

  // As a fallback while redirects are in flight, show a loader.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
