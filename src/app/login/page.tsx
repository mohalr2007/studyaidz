
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
import { LanguageToggle } from '@/components/layout/language-toggle';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ar from '@/lib/locales/ar.json';
import en from '@/lib/locales/en.json';
import fr from '@/lib/locales/fr.json';

const translations = { ar, en, fr };

export default function LoginPage() {
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const { firebaseUser, loading } = useAuth();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'ar' | 'en' | 'fr'>('ar');

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam === 'en' || langParam === 'fr' || langParam === 'ar') {
      setLang(langParam);
      document.documentElement.lang = langParam;
      document.documentElement.dir = langParam === 'ar' ? 'rtl' : 'ltr';
    }
  }, [searchParams]);

  const t = translations[lang].login;
  
  if (loading || firebaseUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-muted-foreground">
          {loading ? t.checkingAuth : t.redirecting}
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
            <LanguageToggle />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center py-12">
            <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <Logo className="justify-center" />
                    <CardTitle className="text-3xl font-bold font-headline">
                        {t.welcome}
                    </CardTitle>
                    <CardDescription>
                        {t.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GoogleSignInButton buttonText={t.signInWithGoogle} />
                </CardContent>
            </Card>
        </div>
        </div>
    </AuthGuard>
  );
}
