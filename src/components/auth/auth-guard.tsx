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

    const isAuthPage = pathname === '/login' || pathname === '/verify-email';

    if (!user || !firebaseUser) {
      if (!isAuthPage) {
        router.replace('/login');
      }
      return;
    }

    if (!firebaseUser.emailVerified) {
      if (pathname !== '/verify-email') {
        router.replace('/verify-email');
      }
      return;
    }

    if (user && firebaseUser.emailVerified && isAuthPage) {
        router.replace('/dashboard');
    }

  }, [user, firebaseUser, loading, router, pathname]);
  

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user && firebaseUser?.emailVerified) {
    // Prevent rendering children on auth pages when logged in and verified
    const isAuthPage = pathname === '/login' || pathname === '/verify-email';
    if(isAuthPage) return null;
    return <>{children}</>;
  }

  if (!user && (pathname === '/login' || pathname === '/verify-email')) {
    return <>{children}</>;
  }

  // While redirecting, return null to avoid rendering anything.
  return null;
}
