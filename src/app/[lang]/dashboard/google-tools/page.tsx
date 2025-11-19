
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, FolderKanban, BookText } from 'lucide-react';

const GmailLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="h-8 w-8">
        <path fill="#ea4335" d="M5 26.5V5.5c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v21c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2z"/>
        <path fill="#c2c2c2" d="M27 5.5H7a2 2 0 0 0-2 2V9l11 8.25L27 9V7.5c0-1.1-.9-2-2-2z"/>
        <path fill="#e0e0e0" d="m16 20.25l11-8.25v14.5c0 1.1-.9 2-2 2H7a2 2 0 0 1-2-2V12l11 8.25z"/>
        <path fill="#b3b3b3" d="M5 12v14.5c0 .6.2 1.1.6 1.5L16 20.25 5.6 11.4A1.9 1.9 0 0 0 5 12z"/>
        <path fill="#d1d1d1" d="M27 12v14.5c0 .6-.2 1.1-.6 1.5L16 20.25l10.4-8.85c.4-.3.6-.8.6-1.4z"/>
    </svg>
);

const YouTubeLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 20" className="h-8 w-8">
        <path fill="#FF0000" d="M27.5 5.5s-.2-1.8-.9-2.6c-.9-1-2.2-1-2.7-1C20.4 1.8 14 1.8 14 1.8s-6.4 0-9.9.1c-.5 0-1.8.1-2.7 1-.7.8-.9 2.6-.9 2.6S.2 7.4.2 9.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.8.9 2.6c.9 1 2.2 1 2.7 1.1 3.5.1 9.9.1 9.9.1s6.4 0 9.9-.1c.5-.1 1.8-.1 2.7-1.1.7-.8.9-2.6.9-2.6s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8z"/>
        <path fill="#FFFFFF" d="M11.2 13.4V6.6l6.8 3.4-6.8 3.4z"/>
    </svg>
);

const GoogleDriveLogo = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512" className="h-8 w-8">
        <path fill="#3777e3" d="m179.9 88l-106.6 189.3l-73.3-127.8l253.2-61.5z"/>
        <path fill="#ffcf63" d="m444.8 281.3l-105.6 186.7H63.2l110-192.7z"/>
        <path fill="#11a861" d="M68.7 472.9L248 178.7L444.8 280.8z"/>
        <path fillOpacity=".2" d="m248 178.7l-68.1 300.2h103.9z"/>
    </svg>
);

const NotebookLMLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" className="h-8 w-8">
        <path fill="#4285F4" d="M128 26.2c-23.7 0-43 19.3-43 43v117.6c0 23.7 19.3 43 43 43s43-19.3 43-43V69.2c0-23.7-19.3-43-43-43z"/>
        <path fill="#34A853" d="M213.8 69.2v117.6c0 23.7-19.3 43-43 43s-43-19.3-43-43V69.2c0-23.7 19.3-43 43-43s43 19.3 43 43z"/>
        <path fill="#FBBC04" d="M128 26.2c-23.7 0-43 19.3-43 43v117.6c0 23.7 19.3 43 43 43s43-19.3 43-43V69.2c0-23.7-19.3-43-43-43z" opacity=".25"/>
        <path fill="#EA4335" d="M42.2 69.2v117.6c0 23.7 19.3 43 43 43s43-19.3 43-43V69.2c0-23.7-19.3-43-43-43s-43 19.3-43 43z"/>
    </svg>
);


const tools = [
    {
        name: 'Gmail',
        description: 'Connectez votre compte Gmail pour gérer vos e-mails académiques.',
        icon: <GmailLogo />,
    },
    {
        name: 'YouTube',
        description: 'Recherchez et enregistrez des vidéos éducatives depuis YouTube.',
        icon: <YouTubeLogo />,
    },
    {
        name: 'Google Drive',
        description: 'Accédez à vos documents et notes stockés sur Google Drive.',
        icon: <GoogleDriveLogo />,
    },
    {
        name: 'NotebookLM',
        description: 'Intégrez votre cahier de notes IA pour des recherches avancées.',
        icon: <NotebookLMLogo />,
    }
]

export default function GoogleToolsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Intégration des Outils Google
        </h1>
        <p className="text-muted-foreground mt-2">
          Connectez vos services Google préférés pour centraliser votre travail et augmenter votre productivité.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
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
                        Cette fonctionnalité est en cours de développement. L'intégration réelle avec l'API Google sera bientôt disponible.
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
