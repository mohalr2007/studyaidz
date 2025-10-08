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
    // Wait until the loading is finished before doing anything.
    if (loading) {
      return;
    }

    // If there is a user
    if (firebaseUser) {
      // And their email is not verified
      if (!firebaseUser.emailVerified) {
        // And they are not already on the verify-email page, redirect them.
        if (pathname !== '/verify-email') {
          router.replace('/verify-email');
        }
      } 
      // If their email is verified
      else {
        // And they are on an auth page or the root page, send them to the dashboard.
        if (isAuthPage || isHomePage) {
          router.replace('/dashboard');
        }
      }
    } 
    // If there is no user
    else {
      // And they are not on a public auth page, send them to the login page.
      if (!isAuthPage) {
        router.replace('/login');
      }
    }
  }, [firebaseUser, loading, router, pathname, isAuthPage, isHomePage]);

  // Show a loader while we are determining the auth state and redirecting.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Logic to prevent "flickering" content while redirecting.
  // We only show children if the user is in the "correct" state for the current page.

  // If not logged in, only show the login/verify pages.
  if (!firebaseUser && isAuthPage) {
      return <>{children}</>;
  }
  
  // If logged in but not verified, only show the verify page.
  if (firebaseUser && !firebaseUser.emailVerified && pathname === '/verify-email') {
      return <>{children}</>;
  }
  
  // If logged in and verified, show any page that is NOT an auth page.
  if (firebaseUser && firebaseUser.emailVerified && !isAuthPage) {
      return <>{children}</>;
  }

  // In any other case (e.g., waiting for the redirect to complete), show the loader.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
