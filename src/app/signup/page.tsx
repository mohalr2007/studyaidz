
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { useToast } from '@/hooks/use-toast';
import { getFirebase } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

const SignupFormSchema = z.object({
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
  password: z.string().min(6, { message: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof SignupFormSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');
  const { auth } = getFirebase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
  });

  const handleSignUp = async (data: SignupFormData) => {
    if (!auth) {
        toast({ title: 'خطأ', description: "Le service d'authentification n'est pas disponible.", variant: 'destructive' });
        return;
    }
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      // The AuthGuard will automatically handle redirection to /complete-profile
    } catch (error: any) {
      console.error('Sign-up error:', error);
      let description = 'حدث خطأ أثناء إنشاء الحساب.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'هذا البريد الإلكتروني مستخدم بالفعل.';
      } else if (error.code === 'auth/weak-password') {
        description = 'كلمة المرور ضعيفة جدًا. يجب أن تكون 6 أحرف على الأقل.';
      }
      toast({
        title: 'فشل إنشاء الحساب',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12">
        <Card className="mx-auto w-full max-w-sm bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center">
             <Logo className="justify-center" />
            <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
            <CardDescription>
              أدخل بياناتك أدناه لإنشاء حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleSignUp)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                إنشاء حساب
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
