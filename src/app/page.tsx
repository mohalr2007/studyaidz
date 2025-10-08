
'use client';

import { useRedirectIfAuthenticated } from '@/hooks/use-redirect-if-authenticated';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // The redirection logic is now handled by this hook.
  // This component will only be visible while the initial authentication check is in progress.
  useRedirectIfAuthenticated();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
