'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YouTubeLogo } from '@/components/google-logos';
import { LogIn } from 'lucide-react';

export default function YouTubePage() {

  return (
    <div className="flex justify-center items-start pt-10 h-full">
      <Card className="w-full max-w-lg text-center">
          <CardHeader className="flex flex-col items-center gap-4">
              <YouTubeLogo />
              <div>
                  <CardTitle>Intégration YouTube</CardTitle>
                  <CardDescription>Connectez votre compte pour rechercher et gérer vos ressources.</CardDescription>
              </div>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/50">
                  Cette fonctionnalité est en cours de développement. La logique de connexion à l'API YouTube n'est pas encore implémentée.
              </p>
          </CardContent>
          <CardFooter className="flex justify-center">
              <Button disabled>
                  <LogIn className="me-2" />
                  Se connecter à YouTube
              </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
