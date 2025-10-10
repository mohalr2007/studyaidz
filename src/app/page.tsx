
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Github, KeyRound, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { login, signup, loginWithProvider } from './auth/actions';

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.88 1.62-4.41 0-7.99-3.59-7.99-7.99s3.58-7.99 7.99-7.99c2.32 0 4.01.88 5.2 2.05l2.66-2.66C18.43 2.1 15.68 1 12.48 1 6.9 1 2.48 5.42 2.48 11s4.42 10 10 10c2.99 0 5.41-1 7.23-2.76 1.9-1.84 2.62-4.38 2.62-6.92 0-.6-.05-1.18-.16-1.72h-9.56z"
      />
    </svg>
);

const FacebookIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

type AuthStep = 'signIn' | 'signUp';

export default function AuthPage() {
  const [authStep, setAuthStep] = useState<AuthStep>('signIn');
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');

  return (
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
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-sm overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {authStep === 'signIn' ? (
              <motion.div
                key="signIn"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CardHeader className="text-center">
                  <Logo className="justify-center" />
                  <CardTitle className="text-3xl font-bold font-headline">
                    أهلاً بعودتك
                  </CardTitle>
                  <CardDescription>
                    سجل دخولك لمواصلة رحلتك التعليمية.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <form action={login} className="grid gap-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="email" name="email" type="email" placeholder="البريد الإلكتروني" required className="pl-10" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="password" name="password" type="password" placeholder="كلمة المرور" required className="pl-10" />
                    </div>
                    <Button type="submit" className="w-full font-bold">
                      تسجيل الدخول
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        أو أكمل بواسطة
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <form action={() => loginWithProvider('google')}>
                        <Button variant="outline" type="submit" className="w-full">
                            <GoogleIcon />
                        </Button>
                    </form>
                    <form action={() => loginWithProvider('github')}>
                        <Button variant="outline" type="submit" className="w-full">
                            <Github />
                        </Button>
                    </form>
                    <form action={() => loginWithProvider('facebook')}>
                        <Button variant="outline" type="submit" className="w-full">
                            <FacebookIcon />
                        </Button>
                    </form>
                  </div>

                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    ليس لديك حساب؟{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setAuthStep('signUp')}>
                      إنشاء حساب
                    </Button>
                  </p>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="signUp"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CardHeader className="text-center">
                  <Logo className="justify-center" />
                  <CardTitle className="text-3xl font-bold font-headline">
                    إنشاء حساب جديد
                  </CardTitle>
                  <CardDescription>
                    خطوتك الأولى نحو تجربة تعليمية فريدة.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <form action={signup} className="grid gap-4">
                      <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="email-signup" name="email" type="email" placeholder="البريد الإلكتروني" required className="pl-10" />
                      </div>
                      <div className="relative">
                          <KeyRound className="absolute left-3 top-1-2 -translate-y-1-2 h-5 w-5 text-muted-foreground" />
                          <Input id="password-signup" name="password" type="password" placeholder="كلمة المرور (6 أحرف على الأقل)" required className="pl-10" />
                      </div>
                      <Button type="submit" className="w-full font-bold">
                          إنشاء حساب
                      </Button>
                  </form>

                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    لديك حساب بالفعل؟{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setAuthStep('signIn')}>
                       تسجيل الدخول
                    </Button>
                  </p>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
