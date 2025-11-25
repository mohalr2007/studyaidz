
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoogleDriveLogo } from '@/components/google-logos';

export default function DrivePage() {
  return (
    <div className="flex justify-center items-start pt-10 h-full">
      <Card className="w-full max-w-lg">
          <CardHeader className="flex flex-row items-center gap-4">
              <GoogleDriveLogo />
              <div>
                  <CardTitle>Google Drive</CardTitle>
                  <CardDescription>Accédez à vos documents et notes stockés sur Google Drive.</CardDescription>
              </div>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">
                  Cette fonctionnalité est en cours de développement.
              </p>
          </CardContent>
          <CardFooter>
              <Button disabled>
                  Connecter
              </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
