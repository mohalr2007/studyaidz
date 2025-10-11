
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SignInForm } from '@/components/auth/sign-in-form';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageToggle } from '@/components/layout/language-toggle';
import { type Locale } from '@/i18n-config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthPage({ params: { lang } }: { params: { lang: Locale } }) {

  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');

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
          {/* AI: Temporary navigation buttons for testing */}
          <div className="px-6 pb-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        Pour Test
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Button asChild variant="outline">
                    <Link href={`/${lang}/dashboard`}>Dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href={`/${lang}/dashboard/profile`}>Profile</Link>
                </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
