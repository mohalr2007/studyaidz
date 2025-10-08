"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { syncUser } from '@/app/actions/user';
import { Loader2 } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.88 1.62-4.41 0-7.99-3.59-7.99-7.99s3.58-7.99 7.99-7.99c2.32 0 4.01.88 5.2 2.05l2.66-2.66C18.43 2.1 15.68 1 12.48 1 6.9 1 2.48 5.42 2.48 11s4.42 10 10 10c2.99 0 5.41-1 7.23-2.76 1.9-1.84 2.62-4.38 2.62-6.92 0-.6-.05-1.18-.16-1.72h-9.56z"
      />
    </svg>
);


export function GoogleSignInButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUser(result.user);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Une erreur s\'est produite lors de la tentative de connexion. Veuillez réessayer.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" type="button" onClick={handleSignIn} disabled={isLoading} className="w-full">
        {isLoading ? (
            <Loader2 className="ms-2 h-4 w-4 animate-spin" />
        ) : (
            <GoogleIcon className="ms-2 h-4 w-4" />
        )}
      تسجيل الدخول باستخدام Google
    </Button>
  );
}
