import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { UserNav } from '@/components/layout/user-nav';
import { type Locale } from '@/i18n-config';

export default function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { lang } = params;
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
