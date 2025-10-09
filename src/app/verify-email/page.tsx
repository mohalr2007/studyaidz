
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { Loader2, MailCheck, LogOut } from 'lucide-react';
import { getFirebase } from '@/firebase';
import AuthGuard from '@/components/auth/auth-guard';

export default function VerifyEmailPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const { auth } = getFirebase();

  const handleResendVerification = async () => {
    if (!firebaseUser) return;
    setIsSending(true);
    try {
      await sendEmailVerification(firebaseUser);
      toast({
        title: 'تم إرسال البريد',
        description: 'تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني.',
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };
  
  // AuthGuard handles loading and redirects, so we only need to render the content
  // when the user is available and needs to see this page.
  if (loading || !firebaseUser || firebaseUser.emailVerified) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <AuthGuard>
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">تفعيل حسابك مطلوب</CardTitle>
            <CardDescription>
                لقد أرسلنا رابط تفعيل إلى <span className="font-bold text-foreground">{firebaseUser.email}</span>. يرجى التحقق من بريدك الإلكتروني.
            </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
            <p>إذا لم تستلم البريد الإلكتروني، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam) أو إعادة إرسال رابط التفعيل.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button onClick={handleResendVerification} disabled={isSending} className="w-full">
                {isSending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
                إعادة إرسال رابط التفعيل
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="me-2 h-4 w-4" />
                تسجيل الخروج
            </Button>
            </CardFooter>
        </Card>
        </div>
    </AuthGuard>
  );
}
