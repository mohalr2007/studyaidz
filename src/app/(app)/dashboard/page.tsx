
import StatCard from '@/components/dashboard/stat-card';
import { Users, FileText, ClipboardCheck } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="مجموع المستخدمين"
          value="1,250"
          icon={Users}
          description="+20.1% عن الشهر الماضي"
        />
        <StatCard
          title="الملخصات التي تم إنشاؤها"
          value="450"
          icon={FileText}
          description="+180.1% عن الشهر الماضي"
        />
        <StatCard
          title="الاختبارات المكتملة"
          value="890"
          icon={ClipboardCheck}
          description="+19% عن الشهر الماضي"
        />
        <StatCard
          title="المواضيع الشائعة"
          value="الفيزياء"
          icon={Users}
          description="الأكثر نشاطًا هذا الأسبوع"
        />
      </div>
    </div>
  );
}
