import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { UserNav } from '@/components/layout/user-nav';
import { type Locale } from '@/i18n-config';
import { headers } from 'next/headers';

function getLangFromPathname(): Locale {
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '';
  return pathname.split('/')[1] as Locale;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getLangFromPathname();

  return (
    <div className="flex min-h-screen">
      <AppSidebar userNav={<UserNav />} lang={lang} />
      <div className="flex-1 flex flex-col bg-muted/40">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
