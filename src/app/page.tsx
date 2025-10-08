'use client';

import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect now simply decides where to go from the root path.
    // AuthGuard will handle all further logic.
    if (!loading) {
        router.replace('/dashboard');
    }
  }, [loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
