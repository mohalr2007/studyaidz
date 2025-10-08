"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    const isAuthFlowPage = pathname === '/login' || pathname === '/verify-email';

    // If not authenticated, redirect to login page, unless already there.
    if (!firebaseUser) {
      if (!isAuthFlowPage) {
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

    // If authenticated and email is verified, and trying to access login/verify page, redirect to dashboard.
    if (isAuthFlowPage) {
      router.replace('/dashboard');
    }

  }, [firebaseUser, loading, router, pathname]);

  // While loading or redirecting, show a loader to prevent flicker
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthFlowPage = pathname === '/login' || pathname === '/verify-email';
  
  // If authenticated and verified, show children unless it's an auth flow page (handled by redirect).
  if (firebaseUser && firebaseUser.emailVerified) {
    if(isAuthFlowPage) return null; // Wait for redirect to complete
    return <>{children}</>;
  }

  // If not authenticated, show children only if it's an auth flow page.
  if (!firebaseUser) {
    if(isAuthFlowPage) return <>{children}</>;
    return null; // Wait for redirect to complete
  }

  // If authenticated but not verified, show children only if it's the verify email page.
  if(firebaseUser && !firebaseUser.emailVerified) {
    if(pathname === '/verify-email') return <>{children}</>;
    return null; // Wait for redirect to complete
  }

  return null;
}
