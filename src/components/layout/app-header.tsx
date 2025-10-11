
"use client";

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NAV_LINKS } from '@/lib/constants';
import Link from 'next/link';
import { Fragment } from 'react';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';

export function AppHeader() {
  const pathname = usePathname();
  const currentLink = NAV_LINKS.find((link) => pathname.includes(link.href));

  // remove the locale from the start of the pathname
  const purePathname = pathname.split('/').slice(2).join('/');
  const breadcrumbPath = `/dashboard/${purePathname}`;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile sidebar trigger can be added here if needed */}
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">StudyAI DZ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentLink && currentLink.href !== '/dashboard' && (
              <Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentLink.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 ms-auto">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
