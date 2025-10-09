
'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import { useEffect, useState, Suspense } from 'react';
import ar from '@/lib/locales/ar.json';
import en from '@/lib/locales/en.json';
import fr from '@/lib/locales/fr.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const translations = { ar, en, fr };

function LoginPageContent() {
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const { firebaseUser, loading } = useAuth();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { auth } = getFirebase();

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam === 'en' || langParam === 'fr' || langParam === 'ar') {
      setLang(langParam);
      if (typeof window !== 'undefined') {
        document.documentElement.lang = langParam;
        document.documentElement.dir = langParam === 'ar' ? 'rtl' : 'ltr';
      }
    }
  }, [searchParams]);

  const t = translations[lang].login;

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) {
        toast({ title: "Erreur", description: "Le service d'authentification n'est pas disponible.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        toast({ title: "Erreur", description: "Veuillez entrer l'email et le mot de passe.", variant: "destructive"});
        setIsLoading(false);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // AuthGuard will handle redirection
    } catch (error: any) {
        console.error("Email/Password Sign-In Error:", error);
        toast({ title: "Erreur de connexion", description: "Email ou mot de passe incorrect.", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

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
                <CardContent className="grid gap-4">
                    <GoogleSignInButton buttonText={t.signInWithGoogle} />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                أو أكمل بواسطة
                            </span>
                        </div>
                    </div>
                     <form onSubmit={handleEmailSignIn} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             تسجيل الدخول
                        </Button>
                    </form>
                     <div className="mt-4 text-center text-sm">
                        ليس لديك حساب؟{' '}
                        <Link href="/signup" className="underline">
                            إنشاء حساب
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        </div>
    </AuthGuard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
