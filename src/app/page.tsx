
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInForm } from '@/components/auth/sign-in-form';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageToggle } from '@/components/layout/language-toggle';
import { getLocale } from '@/lib/locales/get-locale';

export default async function AuthPage() {

  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const lang = await getLocale();

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
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
              <SignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
