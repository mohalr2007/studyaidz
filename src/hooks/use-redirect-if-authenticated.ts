
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

/**
 * A hook to redirect the user to a specific page if they are authenticated,
 * or to the login page if they are not.
 * @param redirectPath The path to redirect to if the user is authenticated. Defaults to '/dashboard'.
 */
export function useRedirectIfAuthenticated(redirectPath: string = '/dashboard') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    if (user) {
      router.replace(redirectPath);
    } else {
      router.replace('/login');
    }
  }, [user, loading, router, redirectPath]);
}
