
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GmailLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 24" className="h-8 w-8">
        <path d="M5 24H27a2 2 0 0 0 2-2V7.96L17.52 18.2a2 2 0 0 1-2.04 0L4 7.96V22a2 2 0 0 0 2 2zM30.49 4.29L16.92 14.8a4 4 0 0 1-4.84 0L1.51 4.29A2 2 0 0 1 3 2h26a2 2 0 0 1 1.49 2.29z" fill="#EA4335"/>
        <path d="M3 2H29a2 2 0 0 1 1.49 2.29L16.92 14.8a4 4 0 0 1-4.84 0L1.51 4.29A2 2 0 0 1 3 2z" fill="url(#a)" fillOpacity=".2"/>
        <defs><linearGradient id="a" x1="16.5" y1="2" x2="16.5" y2="14.8" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs>
    </svg>
);


const GoogleDriveLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 442" className="h-8 w-8">
        <path fill="#34a853" d="M331.5 137.9l-112 192.8H48.8l110-192.8z"/>
        <path fill="#fbbc04" d="M158.8 330.7L48.8 137.9h223.3l-113.3 192.8z"/>
        <path fill="#1aa260" d="M158.8 330.7l-49.8-85.9-60.2 1.4 110 192.8z"/>
        <path fill="#ea4335" d="M211.2 44.9l-105.6 182.2L248 178.7l63.5-109.1z" opacity=".25"/>
        <path fill="#4285f4" d="M211.2 44.9L320.5 227.1l110-192.7h-223z"/>
        <path fill="#1e88e5" d="M430.5 32.2l-110 192.7 54.3 93.8L484 137.9z"/>
    </svg>
);

const workspaceTools = [
    {
        name: 'Gmail',
        description: 'Connectez votre compte Gmail pour gérer vos e-mails académiques.',
        icon: <GmailLogo />,
    },
    {
        name: 'Google Drive',
        description: 'Accédez à vos documents et notes stockés sur Google Drive.',
        icon: <GoogleDriveLogo />,
    },
];

export default function GoogleWorkspacePage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Google Workspace
        </h1>
        <p className="text-muted-foreground mt-2">
          Intégrez vos outils de productivité Google pour une expérience unifiée.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workspaceTools.map(tool => (
            <Card key={tool.name}>
                <CardHeader className="flex flex-row items-center gap-4">
                    {tool.icon}
                    <div>
                        <CardTitle>{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
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
        ))}
      </div>
    </div>
  );
}
