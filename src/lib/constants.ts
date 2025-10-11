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
    href: '/dashboard/chat',
    label: 'المساعد الذكي',
    icon: MessageSquare,
  },
  {
    href: '/dashboard/summaries',
    label: 'تلخيص الدروس',
    icon: FileText,
  },
  {
    href: '/dashboard/quizzes',
    label: 'اختبارات قصيرة',
    icon: ClipboardCheck,
  },
  {
    href: '/dashboard/community',
    label: 'مجتمع الطلاب',
    icon: Users,
  },
];
