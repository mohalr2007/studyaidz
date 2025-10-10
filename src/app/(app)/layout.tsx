
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AuthGuard from '@/components/auth/auth-guard';

// This forces the layout to be dynamic, preventing static rendering errors during build.
export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
