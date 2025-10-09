'use client';

import Image from 'next/image';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { Logo } from '@/components/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/firebase';
import { syncUser } from '../actions/user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const router = useRouter();
  const { toast } = useToast();
  const { firebaseUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the user is already authenticated, redirect them away.
    if (firebaseUser) {
      router.replace('/dashboard');
      return;
    }

    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          await syncUser(result.user);
          // The AuthGuard will handle the redirect to the dashboard.
          // No need to router.push here, which can cause race conditions.
        } else {
          // No redirect result, so just show the login page.
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Google Redirect Sign-In Error:', error);
        toast({
          title: 'Erreur de connexion',
          description: `Une erreur s'est produite lors de la connexion. Code: ${error.code}`,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    checkRedirect();
  }, [firebaseUser, router, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-muted-foreground">Vérification de la connexion...</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-4 text-center">
            <Logo className="justify-center" />
            <h1 className="text-3xl font-bold font-headline">
              أهلاً بك في StudyAI DZ
            </h1>
            <p className="text-balance text-muted-foreground">
              Bوابتك الذكية للنجاح الدراسي. سجل دخولك وابدأ رحلتك.
            </p>
          </div>
          <GoogleSignInButton />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginHeroImage && (
          <Image
            src={loginHeroImage.imageUrl}
            alt={loginHeroImage.description}
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            data-ai-hint={loginHeroImage.imageHint}
          />
        )}
      </div>
    </div>
  );
}
