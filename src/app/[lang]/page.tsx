
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageToggle } from '@/components/layout/language-toggle';
import { type Locale } from '@/i18n-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';
import { useState } from 'react';

export default function AuthPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const [activeTab, setActiveTab] = useState('sign-in');

  return (
    <div className="relative min-h-screen w-full">
      {loginHeroImage && (
        <Image
          src={loginHeroImage.imageUrl}
          alt={loginHeroImage.description}
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint={loginHeroImage.imageHint}
        />
      )}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm p-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-sm"
        >
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <Card>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="sign-up">إنشاء حساب</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <CardContent className="pt-0">
                <SignInForm onSwitchToSignUp={() => setActiveTab('sign-up')} />
              </CardContent>
            </TabsContent>
            <TabsContent value="sign-up">
              <CardContent className="pt-0">
                <SignUpForm />
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
