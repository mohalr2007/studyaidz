
'use client';

import { useUser } from '@/hooks/use-user';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, Edit, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { logout } from '@/app/auth/actions';
import { type Locale } from '@/i18n-config';

// Placeholder for a future ChatAssistant component
const ChatAssistantPlaceholder = ({ lang }: { lang: Locale }) => (
  <Card className="bg-primary/5 border-primary/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Sparkles className="text-primary" />
        <span>المساعد الذكي</span>
      </CardTitle>
      <CardDescription>
        هل لديك سؤال؟ أنا هنا للمساعدة في أي موضوع دراسي.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-background/50 rounded-lg text-sm text-muted-foreground">
          ... سيتم عرض واجهة الدردشة هنا ...
        </div>
        <Button variant="outline" className="self-start" asChild>
          <Link href={`/${lang}/dashboard/chat`}>
            <MessageSquare className="me-2" />
            ابدأ محادثة جديدة
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Placeholder for displaying recent user actions
const RecentActivityPlaceholder = () => (
  <Card>
    <CardHeader>
      <CardTitle>آخر النشاطات</CardTitle>
      <CardDescription>
        ملخص لآخر الإجراءات التي قمت بها في المنصة.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li className="flex items-center">
          📊 أكملت اختبارًا في "الفيزياء النووية"
        </li>
        <li className="flex items-center">
          📄 لخصت درس "الأعداد المركبة"
        </li>
        <li className="flex items-center">
          💬 طرحت سؤالاً في "مجتمع الطلاب"
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default function DashboardPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const { student, loading } = useUser();

  const welcomeMessage = student?.full_name
    ? `مرحباً بعودتك، ${student.full_name}!`
    : 'مرحباً بعودتك!';

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            {welcomeMessage}
          </h1>
          <p className="text-muted-foreground">
            هنا يمكنك رؤية ملخص لنشاطك والوصول السريع إلى ميزات المنصة.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChatAssistantPlaceholder lang={lang} />
        <RecentActivityPlaceholder />
      </div>
    </div>
  );
}
