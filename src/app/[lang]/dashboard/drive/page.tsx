
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoogleDriveLogo } from '@/components/google-logos';
import { LogIn } from 'lucide-react';

export default function DrivePage() {
  return (
    <div className="flex justify-center items-start pt-10 h-full">
      <Card className="w-full max-w-lg text-center">
          <CardHeader className="flex flex-col items-center gap-4">
              <GoogleDriveLogo />
              <div>
                  <CardTitle>Intégration Google Drive</CardTitle>
                  <CardDescription>Accédez à vos documents et notes stockés sur Google Drive.</CardDescription>
              </div>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/50">
                  Cette fonctionnalité est en cours de développement. La logique de connexion à l'API Google Drive n'est pas encore implémentée.
              </p>
          </CardContent>
          <CardFooter className="flex justify-center">
              <Button disabled>
                  <LogIn className="me-2" />
                  Se connecter à Google Drive
              </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
