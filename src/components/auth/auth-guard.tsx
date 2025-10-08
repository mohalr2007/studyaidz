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
      return; // Do nothing while loading.
    }

    if (firebaseUser) {
      if (!firebaseUser.emailVerified) {
        if (pathname !== '/verify-email') {
          router.replace('/verify-email');
        }
      } else if (isAuthPage || isHomePage) {
        // If logged in, verified, and on an auth page or the root, go to dashboard.
        router.replace('/dashboard');
      }
    } else {
      // If not logged in, and not already on an auth page, go to login.
      if (!isAuthPage) {
        router.replace('/login');
      }
    }
  }, [firebaseUser, loading, router, pathname, isAuthPage, isHomePage]);

  // While loading, or if the logic above is about to redirect, show a loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Render logic to prevent flicker and show the correct page.
  if (!firebaseUser && isAuthPage) {
      return <>{children}</>; // User is not logged in, show the auth page.
  }
  
  if (firebaseUser && !firebaseUser.emailVerified && pathname === '/verify-email') {
      return <>{children}</>; // User is logged in but not verified, show the verify page.
  }
  
  if (firebaseUser && firebaseUser.emailVerified && !isAuthPage && !isHomePage) {
      return <>{children}</>; // User is logged in and verified, show the protected app page.
  }

  // For any other transient state (e.g., waiting for redirect), show a loader.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
