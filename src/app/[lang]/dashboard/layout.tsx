'use client';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { UserNav } from '@/components/layout/user-nav';
import { type Locale } from '@/i18n-config';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const pathname = usePathname();
  // Extract lang from pathname, which is reliable in a client component
  const lang = pathname.split('/')[1] as Locale;

  return (
    <div className="flex min-h-screen">
      <AppSidebar userNav={<UserNav />} lang={lang} />
      <div className="flex-1 flex flex-col bg-muted/40">
        <AppHeader />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4 sm:p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
