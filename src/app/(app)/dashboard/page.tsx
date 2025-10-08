'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FileText,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/stat-card';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

const featureCards = NAV_LINKS.filter(link => link.href !== '/dashboard');

export default function DashboardPage() {
    const { user } = useAuth();
    const role = user?.role || 'student';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">أهلاً بك في StudyAI DZ!</CardTitle>
          <CardDescription>
            منصتك المتكاملة للدراسة بذكاء. استكشف الأدوات المتاحة وادعم رحلتك التعليمية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>استخدم المساعد الذكي لطرح الأسئلة، قم بتلخيص ملفات PDF، أنشئ اختبارات قصيرة، وتفاعل مع مجتمع الطلاب.</p>
        </CardContent>
      </Card>
      
      {role === 'admin' && (
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">لوحة تحكم المشرف</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={UserCheck} title="الطلاب النشطين" value="1,234" description="خلال 24 ساعة" />
            <StatCard icon={BookOpen} title="أكثر المواد استخدامًا" value="الرياضيات" description="هذا الأسبوع" />
            <StatCard icon={MessageSquare} title="إجمالي الأسئلة" value="5,678" />
            <StatCard icon={FileText} title="إجمالي الملخصات" value="910" />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">أدواتك الدراسية</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {featureCards.map((feature) => (
            <Card key={feature.href} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <feature.icon className="h-6 w-6 text-primary" />
                            {feature.label}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            وصف قصير ومحفز لهذه الميزة الرائعة.
                        </CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Maybe some descriptive text here */}
              </CardContent>
              <CardContent>
                 <Link href={feature.href}>
                    <Button className="w-full">
                      ابدأ الآن
                      <ArrowRight className="me-2 h-4 w-4" />
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
