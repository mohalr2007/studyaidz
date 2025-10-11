
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInForm } from '@/components/auth/sign-in-form';
import { ThemeToggle } from '@/components/layout/theme-toggle';


export default async function AuthPage() {

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
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Page de navigation</CardTitle>
            <CardDescription>
              Utilisez les boutons ci-dessous pour tester les autres sections de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
              <Button asChild>
                <Link href="/dashboard">Aller au Tableau de Bord</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile">Aller au Profil</Link>
              </Button>
               <SignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
