'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, FolderKanban, BookText } from 'lucide-react';

const GmailLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="h-8 w-8">
        <path fill="#4285F4" d="M25 5H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
        <path fill="#FFFFFF" d="M25 7L16 16L7 7v0c.1-.4.5-.7.9-.7h16.2c.4 0 .8.3.9.7V7z"/>
        <path fill="#EA4335" d="M7.1 25.3c-.1.1.1.4.3.3l7.6-6.3-4-3.6-4 4.5v4.8c0 .1.1.2.1.3z"/>
        <path fill="#34A853" d="M25 25h-.1c0-.1 0-.2-.1-.3v-4.8l-4-4.5-4 3.6 7.6 6.3c.2.1.3-.1.3-.3z"/>
        <path fill="#FBBC05" d="M11.1 15.6l-4 3.5V7c0-.2.1-.4.2-.5L11 15.3c.1.1.1.2.1.3z"/>
        <path fill="#FDBB05" d="M20.9 15.6l4-3.5V7c0-.2-.1-.4-.2-.5L21 15.3c-.1.1-.1.2-.1.3z"/>
    </svg>
);

const YouTubeLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 28 20" className="h-8 w-8">
        <path fill="#FF0000" d="M27.5 5.5s-.2-1.8-.9-2.6c-.9-1-2.2-1-2.7-1C20.4 1.8 14 1.8 14 1.8s-6.4 0-9.9.1c-.5 0-1.8.1-2.7 1-.7.8-.9 2.6-.9 2.6S.2 7.4.2 9.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.8.9 2.6c.9 1 2.2 1 2.7 1.1 3.5.1 9.9.1 9.9.1s6.4 0 9.9-.1c.5-.1 1.8-.1 2.7-1.1.7-.8.9-2.6.9-2.6s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8z"/>
        <path fill="#FFFFFF" d="M11.2 13.4V6.6l6.8 3.4-6.8 3.4z"/>
    </svg>
);

const GoogleDriveLogo = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="h-8 w-8">
        <path fill="#0F9D58" d="M20.3 5.9L10.3 22.3l-6.2-10.8z"/>
        <path fill="#FFC107" d="M4.1 11.5l6.2 10.8L20.3 5.9H9.4z"/>
        <path fill="#4285F4" d="M14.5 22.3L24.4 5.9h-8.8L9.4 20.3z"/>
        <path fill="#1976D2" d="M24.4 5.9L15.6 20.3l-1.9-3.4 8.7-15.1z"/>
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
