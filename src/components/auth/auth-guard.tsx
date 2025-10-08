"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !firebaseUser) {
        router.replace('/login');
      } else if (!firebaseUser.emailVerified) {
        router.replace('/verify-email');
      }
    }
  }, [user, firebaseUser, loading, router]);
  

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user && firebaseUser?.emailVerified) {
    return <>{children}</>;
  }

  return null;
}
