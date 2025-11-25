
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  User,
  Mail,
  Folder,
  type LucideIcon,
} from 'lucide-react';
import { YouTubeLogo } from '@/components/google-logos';


export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon | React.FC<any>;
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
    href: '/dashboard/community',
    label: 'مجتمع الطلاب',
    icon: Users,
  },
  {
    href: '/dashboard/gmail',
    label: 'Gmail',
    icon: Mail,
  },
    {
    href: '/dashboard/drive',
    label: 'Google Drive',
    icon: Folder,
  },
  {
    href: '/dashboard/youtube',
    label: 'YouTube',
    icon: YouTubeLogo,
  },
];
