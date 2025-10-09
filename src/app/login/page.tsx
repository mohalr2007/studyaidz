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
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const { firebaseUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-muted-foreground">Vérification de la connexion...</p>
      </div>
    );
  }

  // If a user is already authenticated, the AuthGuard will handle redirection.
  // This page is only for unauthenticated users. If firebaseUser exists, AuthGuard will
  // redirect them, so we can show a loader while that happens.
  if (firebaseUser) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-muted-foreground">Redirection en cours...</p>
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
