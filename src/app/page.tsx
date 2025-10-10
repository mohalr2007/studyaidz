
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-muted/40">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center">Homepage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <p className="text-center text-muted-foreground">
                    After logging in, use these buttons to navigate.
                 </p>
                <Button asChild>
                    <Link href="/complete-profile">Profile Info Page</Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/dashboard">Dashboard Page</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}

    