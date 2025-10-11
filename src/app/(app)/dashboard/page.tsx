
// Added by AI - Dashboard page
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/auth/actions';

// Added by AI - Placeholder for a future ChatAssistant component
const ChatAssistantPlaceholder = () => (
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
                <Button variant="ghost" className="self-start">
                    <MessageSquare className="me-2" />
                    ابدأ محادثة جديدة
                </Button>
            </div>
        </CardContent>
    </Card>
);

// Added by AI - Placeholder for a future data display component
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
                <li className="flex items-center">📊 أكملت اختبارًا في "الفيزياء النووية"</li>
                <li className="flex items-center">📄 لخصت درس "الأعداد المركبة"</li>
                <li className="flex items-center">💬 طرحت سؤالاً في "مجتمع الطلاب"</li>
            </ul>
        </CardContent>
    </Card>
);


export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: student } = await supabase.from('students').select('full_name').eq('id', user?.id || '').single();
  
  const welcomeMessage = student?.full_name ? `مرحباً بعودتك، ${student.full_name}!` : "مرحباً بعودتك!";

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{welcomeMessage}</h1>
        <p className="text-muted-foreground">
            هنا يمكنك رؤية ملخص لنشاطك والوصول السريع إلى ميزات المنصة.
        </p>
      </div>

       <div className="flex items-center gap-4">
            <Button asChild>
                <Link href="/profile">
                    <Edit className="me-2" />
                    تعديل الملف الشخصي
                </Link>
            </Button>
            <form action={logout}>
                <Button variant="outline" type="submit">تسجيل الخروج</Button>
            </form>
       </div>


      <div className="grid lg:grid-cols-2 gap-6">
        {/* Placeholder for future AI Assistant integration */}
        <ChatAssistantPlaceholder />

        {/* Placeholder for displaying recent user actions */}
        <RecentActivityPlaceholder />
      </div>
    </div>
  );
}
