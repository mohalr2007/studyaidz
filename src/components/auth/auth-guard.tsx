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

    if (firebaseUser) {
      if (!firebaseUser.emailVerified) {
        // If user is logged in but email is not verified,
        // and they are not already on the verification page, redirect them.
        if (pathname !== '/verify-email') {
          router.replace('/verify-email');
        }
      } else if (isAuthPage || isHomePage) {
        // If user is logged in, email is verified, and they are on an auth page
        // or the root page, redirect them to the dashboard.
        router.replace('/dashboard');
      }
    } else {
      // If there is no user, and they are not on a public auth page,
      // redirect them to the login page.
      if (!isAuthPage) {
        router.replace('/login');
      }
    }
  }, [firebaseUser, loading, router, pathname, isAuthPage, isHomePage]);

  // --- Render Logic ---

  // While loading, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If there's no user, only render the login page.
  if (!firebaseUser && isAuthPage) {
    return <>{children}</>;
  }

  // If user is logged in but not verified, only render the verification page.
  if (firebaseUser && !firebaseUser.emailVerified && pathname === '/verify-email') {
    return <>{children}</>;
  }

  // If user is logged in and verified, render the app content (but not auth pages).
  if (firebaseUser && firebaseUser.emailVerified && !isAuthPage) {
    return <>{children}</>;
  }

  // As a fallback while redirects are in flight, show a loader.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
