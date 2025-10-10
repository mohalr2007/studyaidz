
'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FileText,
  MessageSquare,
  UserCheck,
  BrainCircuit,
  ClipboardCheck,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/stat-card';
import { NAV_LINKS } from '@/lib/constants';

const featureCards = [
    { href: '/summaries', label: '🧠 الملخصات', description: 'لخص ملفاتك الدراسية بذكاء.'},
    { href: '/summaries', label: '🗺️ الخرائط الذهنية', description: 'حول الملخصات إلى خرائط بصرية.'},
    { href: '/quizzes', label: '❓ الاختبارات', description: 'أنشئ اختبارات لتقييم معرفتك.'},
    { href: '/community', label: '💬 منتدى النقاش', description: 'تواصل وشارك مع زملائك.'}
];

export default function DashboardPage() {
    // TODO: Replace with real Supabase data
    const user = { username: 'طالب' }; 
    const stats = {
        quizzes: 5,
        summaries: 12,
        aiInteractions: 89,
    };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">👋 أهلاً بعودتك، {user.username}!</CardTitle>
          <CardDescription>
            استمر في رحلتك التعليمية. إليك أدواتك للنجاح.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">إحصائياتك</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={ClipboardCheck} title="الاختبارات المنجزة" value={stats.quizzes.toString()} />
          <StatCard icon={FileText} title="الملخصات التي تم إنشاؤها" value={stats.summaries.toString()} />
          <StatCard icon={BrainCircuit} title="التفاعلات مع الذكاء الاصطناعي" value={stats.aiInteractions.toString()} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">أدواتك الدراسية</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featureCards.map((feature) => (
            <Card key={feature.href} className="flex flex-col">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    {feature.label}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardContent>
                 <Link href={feature.href}>
                    <Button className="w-full">
                      ابدأ الآن
                      <ArrowRight className="ms-2 h-4 w-4" />
                    </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
