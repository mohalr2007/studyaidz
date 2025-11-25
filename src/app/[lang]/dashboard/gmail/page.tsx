
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GmailLogo } from '@/components/google-logos';

export default function GmailPage() {
  return (
    <div className="flex justify-center items-start pt-10 h-full">
      <Card className="w-full max-w-lg">
          <CardHeader className="flex flex-row items-center gap-4">
              <GmailLogo />
              <div>
                  <CardTitle>Gmail</CardTitle>
                  <CardDescription>Connectez votre compte Gmail pour gérer vos e-mails académiques.</CardDescription>
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
