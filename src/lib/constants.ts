import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  ClipboardCheck,
  Users,
  User,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// Note: Hrefs should not include the locale prefix
export const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
  },
  {
    href: '/profile',
    label: 'الملف الشخصي',
    icon: User,
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
