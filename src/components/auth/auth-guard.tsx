"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/verify-email';
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (loading) {
      return; // Wait for the auth state to be determined.
    }

    // If there is no user, and they are not on a public auth page or the homepage,
    // redirect them to the login page.
    if (!firebaseUser) {
      if (!isAuthPage && !isHomePage) {
        router.replace('/login');
      }
      return;
    }
    
    // If we have a user
    if (!firebaseUser.emailVerified) {
      // and their email is not verified, redirect to verify-email page
      if (pathname !== '/verify-email') {
        router.replace('/verify-email');
      }
    } else if (isAuthPage || isHomePage) {
      // and their email is verified, and they are on an auth page or homepage,
      // redirect to the dashboard.
      router.replace('/dashboard');
    }

  }, [firebaseUser, loading, router, pathname, isAuthPage, isHomePage]);

  // While loading, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- Render Logic ---

  // If there's no user, only render public pages.
  if (!firebaseUser) {
    return isAuthPage || isHomePage ? <>{children}</> : null;
  }
  
  // If user is logged in but not verified, only render the verification page.
  if (!firebaseUser.emailVerified) {
    return pathname === '/verify-email' ? <>{children}</> : null;
  }

  // If user is logged in and verified, render the app content (but not auth pages).
  if (firebaseUser.emailVerified) {
     return !isAuthPage ? <>{children}</> : null;
  }

  // As a fallback while redirects are in flight, show a loader.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
