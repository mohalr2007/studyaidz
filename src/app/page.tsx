
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';


export default async function AuthPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

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
            <CardContent className="p-0">
                <div className="p-6 pb-2 text-center">
                    <Logo className="justify-center" />
                </div>
                <Tabs defaultValue="signIn" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signIn">تسجيل الدخول</TabsTrigger>
                        <TabsTrigger value="signUp">إنشاء حساب</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signIn">
                       <SignInForm />
                    </TabsContent>
                    <TabsContent value="signUp">
                        <SignUpForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
