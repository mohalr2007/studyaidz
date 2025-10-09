
"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { syncUserAndCheckProfile } from '@/app/actions/user';
import { getRedirectResult } from 'firebase/auth';
import { getFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { auth } = getFirebase();

  const [isSyncing, setIsSyncing] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/verify-email';
  const isProfilePage = pathname === '/complete-profile';
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          // The sync will be handled by the main useEffect listening to firebaseUser change.
        }
      } catch (error: any) {
        console.error('Google Redirect Sign-In Error:', error);
        if (error.code === 'auth/unauthorized-domain') {
             toast({
                title: 'Erreur de configuration',
                description: `Le domaine de cette application n'est pas autorisé. Veuillez l'ajouter aux "Domaines autorisés" dans votre console Firebase.`,
                variant: 'destructive',
                duration: 10000,
            });
        } else {
             toast({
                title: 'Erreur de connexion',
                description: `Une erreur s'est produite lors de la connexion. Code: ${error.code}`,
                variant: 'destructive',
            });
        }
      } finally {
         setIsSyncing(false);
      }
    };

    handleRedirectResult();
  }, [auth, toast]);


  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!firebaseUser) {
      setIsSyncing(false);
      if (!isAuthPage) {
        router.replace('/login');
      }
      return;
    }

    // User is authenticated via Firebase
    setIsSyncing(true);
    syncUserAndCheckProfile(firebaseUser).then(profile => {
        if (!firebaseUser.emailVerified) {
            if (pathname !== '/verify-email') {
                router.replace('/verify-email');
            }
        } else if (!profile.isProfileComplete) {
            if (pathname !== '/complete-profile') {
                router.replace('/complete-profile');
            }
        } else { // Verified and profile complete
            if (isAuthPage || isProfilePage || isHomePage) {
                router.replace('/dashboard');
            }
        }
        setIsSyncing(false);
    }).catch(error => {
        console.error("AuthGuard sync failed:", error);
        toast({ title: "Error", description: "Could not verify user profile. Please try again.", variant: "destructive" });
        setIsSyncing(false);
        // Fallback: redirect to login if sync fails
        if (!isAuthPage) {
            router.replace('/login');
        }
    });

  }, [firebaseUser, loading, router, pathname, toast]);

  if (loading || isSyncing) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- Render Logic ---

  if (!firebaseUser) {
    return isAuthPage ? <>{children}</> : null;
  }
  
  if (!firebaseUser.emailVerified) {
      return pathname === '/verify-email' ? <>{children}</> : null;
  }

  if (user && !user.isProfileComplete) {
      return pathname === '/complete-profile' ? <>{children}</> : null;
  }

  if (user && user.isProfileComplete && !isAuthPage && !isProfilePage) {
    return <>{children}</>;
  }

  return (
     <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
     </div>
  );
}
