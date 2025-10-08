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

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    // If not authenticated, redirect to login page.
    if (!firebaseUser) {
      if (!isAuthPage) {
        router.replace('/login');
      }
      return;
    }

    // If authenticated but email is not verified, redirect to verify-email page.
    if (!firebaseUser.emailVerified) {
      if (pathname !== '/verify-email') {
        router.replace('/verify-email');
      }
      return;
    }

    // If authenticated and verified, and trying to access an auth page, redirect to dashboard.
    if (isAuthPage) {
      router.replace('/dashboard');
    }

  }, [firebaseUser, loading, router, pathname, isAuthPage]);


  // While loading, show a loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Determine what to render
  if (!firebaseUser && isAuthPage) {
    return <>{children}</>; // Show login/verify page if not logged in
  }

  if (firebaseUser && !firebaseUser.emailVerified && pathname === '/verify-email') {
    return <>{children}</>; // Show verify page if logged in but not verified
  }

  if (firebaseUser && firebaseUser.emailVerified && !isAuthPage) {
    return <>{children}</>; // Show app content if logged in and verified
  }

  // In all other cases (e.g., waiting for redirect), show a loader to prevent flicker.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
