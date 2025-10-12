'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DevTestPage() {
  const clearSession = () => {
    // Clear Supabase session from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear cookies by setting their expiry date to the past
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    alert("Session et cookies effacés. Veuillez rafraîchir la page.");
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen p-4 bg-muted/40">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center">Page de Test Développeur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">Utilisez ces liens pour tester la navigation manuellement :</p>
                <div className="grid grid-cols-1 gap-3">
                    <Button asChild variant="outline">
                        <Link href="/ar">Aller à la page de Connexion</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/complete-profile">Aller à la page "Compléter Profil"</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/ar/dashboard">Aller au Tableau de Bord</Link>
                    </Button>
                </div>
                 <Button onClick={clearSession} variant="destructive" className="w-full mt-4">
                    Vider la Session & les Cookies
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
