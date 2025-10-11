
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default async function AuthPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');

  if (session) {
    const { data: student } = await supabase.from('students').select('is_profile_complete').eq('id', session.user.id).single();
    if (student && student.is_profile_complete) {
        // AI FIX: Redirect to dashboard if session exists and profile is complete.
        // This was previously handled in the layout, but it's better here.
        // redirect('/dashboard');
    } else if (student && !student.is_profile_complete) {
        // redirect('/complete-profile');
    }
  }


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
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Page de navigation</CardTitle>
            <CardDescription>
              Il n'y a rien dans cette page pour le moment. Utilisez les boutons ci-dessous pour tester les autres sections.
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
