
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserNav } from '@/components/layout/user-nav';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: student } = await supabase.from('students').select('is_profile_complete').eq('id', session.user.id).single();

  if (student && !student.is_profile_complete) {
    redirect('/complete-profile');
  }


  return (
    <SidebarProvider>
      <AppSidebar userNav={<UserNav />} />
      <div className="flex-1">
        <AppHeader />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
