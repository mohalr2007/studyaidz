import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  ClipboardCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
  },
  {
    href: '/chat',
    label: 'المساعد الذكي',
    icon: MessageSquare,
  },
  {
    href: '/summaries',
    label: 'تلخيص الدروس',
    icon: FileText,
  },
  {
    href: '/quizzes',
    label: 'اختبارات قصيرة',
    icon: ClipboardCheck,
  },
  {
    href: '/community',
    label: 'مجتمع الطلاب',
    icon: Users,
  },
];
