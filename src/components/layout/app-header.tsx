"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
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

export function AppHeader() {
  const pathname = usePathname();
  const currentLink = NAV_LINKS.find((link) => pathname.startsWith(link.href));

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        <div className="sm:hidden">
          <SidebarTrigger />
        </div>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">StudyAI DZ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentLink && (
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
    </header>
  );
}
