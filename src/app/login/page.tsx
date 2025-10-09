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
import AuthGuard from '@/components/auth/auth-guard';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function LoginPage() {
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const { firebaseUser, loading } = useAuth();
  
  if (loading || firebaseUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-muted-foreground">
          {loading ? "Vérification de la connexion..." : "Redirection en cours..."}
        </p>
      </div>
    );
  }

  return (
    <AuthGuard>
        <div className="relative min-h-screen w-full">
        {loginHeroImage && (
            <Image
                src={loginHeroImage.imageUrl}
                alt={loginHeroImage.description}
                fill
                className="object-cover dark:brightness-[0.2] dark:grayscale"
                data-ai-hint={loginHeroImage.imageHint}
            />
            )}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            <ThemeToggle />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center py-12">
            <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <Logo className="justify-center" />
                    <CardTitle className="text-3xl font-bold font-headline">
                        أهلاً بك في StudyAI DZ
                    </CardTitle>
                    <CardDescription>
                        Bوابتك الذكية للنجاح الدراسي. سجل دخولك وابدأ رحلتك.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GoogleSignInButton />
                </CardContent>
            </Card>
        </div>
        </div>
    </AuthGuard>
  );
}
