
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Youtube, FolderKanban, BookText } from 'lucide-react';

const tools = [
    {
        name: 'Gmail',
        description: 'Connectez votre compte Gmail pour gérer vos e-mails académiques.',
        icon: <Mail className="h-8 w-8 text-red-500" />,
    },
    {
        name: 'YouTube',
        description: 'Recherchez et enregistrez des vidéos éducatives depuis YouTube.',
        icon: <Youtube className="h-8 w-8 text-red-600" />,
    },
    {
        name: 'Google Drive',
        description: 'Accédez à vos documents et notes stockés sur Google Drive.',
        icon: <FolderKanban className="h-8 w-8 text-blue-500" />,
    },
    {
        name: 'NotebookLM',
        description: 'Intégrez votre cahier de notes IA pour des recherches avancées.',
        icon: <BookText className="h-8 w-8 text-blue-600" />,
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
