"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/verify-email';
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (loading) {
      return; // Wait for the auth state to be determined.
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
  }, [user, firebaseUser, loading, router, pathname, isAuthPage, isHomePage]);

  // While loading, or if a redirect is in progress, show a loader.
  if (loading) {
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
