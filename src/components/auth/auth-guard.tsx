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

  const [isSyncing, setIsSyncing] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/verify-email';
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          await syncUser(result.user);
          // The main useEffect will handle redirection.
        }
      } catch (error: any) {
        console.error('Google Redirect Sign-In Error:', error);
        if (error.code === 'auth/unauthorized-domain') {
             toast({
                title: 'Erreur de configuration',
                description: `Le domaine de cette application n'est pas autorisé. Veuillez l'ajouter aux "Domaines autorisés" dans votre console Firebase.`,
                variant: 'destructive',
                duration: 10000,
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
    };

    handleRedirectResult();
  }, [toast]);


  useEffect(() => {
    // Wait until both Firebase Auth state is loaded and the redirect check is complete.
    if (loading || isSyncing) {
      return; 
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
