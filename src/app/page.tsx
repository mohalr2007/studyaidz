
import AuthGuard from '@/components/auth/auth-guard';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  return (
    <AuthGuard>
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    </AuthGuard>
  );
}
