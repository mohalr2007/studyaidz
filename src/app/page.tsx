'use client';

import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page remains as a loading fallback while the initial redirect happens in AuthGuard.
export default function HomePage() {
  const { loading, firebaseUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (firebaseUser) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, firebaseUser, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
