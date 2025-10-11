
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signup } from '@/app/auth/actions';
import { KeyRound, Mail } from 'lucide-react';
import { useParams } from 'next/navigation';

export function SignUpForm() {
    const params = useParams();
    return (
        <>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-headline">
                    إنشاء حساب جديد
                </CardTitle>
                <CardDescription>
                    خطوتك الأولى نحو تجربة تعليمية فريدة.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form action={signup} className="grid gap-4">
                    <input type="hidden" name="lang" value={params.lang} />
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="email-signup" name="email" type="email" placeholder="البريد الإلكتروني" required className="pl-10" />
                    </div>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="password-signup" name="password" type="password" placeholder="كلمة المرور (6 أحرف على الأقل)" required className="pl-10" />
                    </div>
                    <Button type="submit" className="w-full font-bold">
                        إنشاء حساب
                    </Button>
                </form>
            </CardContent>
        </>
    )
}
