
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  ClipboardCheck,
  Users,
  User,
  Grid,
  Briefcase,
  BrainCircuit,
  type LucideIcon,
} from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// Note: Hrefs should not include the locale prefix. They are relative to /:lang/
export const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/profile',
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
  {
    href: '/dashboard/google-workspace',
    label: 'Google Workspace',
    icon: Briefcase,
  },
  {
    href: '/dashboard/google-ai',
    label: 'Google AI',
    icon: BrainCircuit,
  },
];
