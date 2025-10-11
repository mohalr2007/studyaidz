
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserNav } from '@/components/layout/user-nav';


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar userNav={<UserNav />} />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
