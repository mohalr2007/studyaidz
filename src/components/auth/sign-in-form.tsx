
'use client';

import { useFormStatus } from 'react-dom';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login, loginWithProvider } from '@/app/auth/actions';
import { Github, KeyRound, Mail, Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.88 1.62-4.41 0-7.99-3.59-7.99-7.99s3.58-7.99 7.99-7.99c2.32 0 4.01.88 5.2 2.05l2.66-2.66C18.43 2.1 15.68 1 12.48 1 6.9 1 2.48 5.42 2.48 11s4.42 10 10 10c2.99 0 5.41-1 7.23-2.76 1.9-1.84 2.62-4.38 2.62-6.92 0-.6-.05-1.18-.16-1.72h-9.56z"
      />
    </svg>
);

const FacebookIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

function SocialLoginButton({ provider, children }: { provider: string, children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button variant="outline" type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
        </Button>
    );
}


export function SignInForm() {
    return (
        <>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-headline">
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

                <div className="grid grid-cols-3 gap-3">
                    <form action={loginWithProvider}>
                        <input type="hidden" name="provider" value="google" />
                        <SocialLoginButton provider="google">
                            <GoogleIcon />
                        </SocialLoginButton>
                    </form>
                    <form action={loginWithProvider}>
                         <input type="hidden" name="provider" value="github" />
                        <SocialLoginButton provider="github">
                            <Github className="h-5 w-5" />
                        </SocialLoginButton>
                    </form>
                    <form action={loginWithProvider}>
                        <input type="hidden" name="provider" value="facebook" />
                        <SocialLoginButton provider="facebook">
                           <FacebookIcon />
                        </SocialLoginButton>
                    </form>
                </div>
            </CardContent>
        </>
    )
}
