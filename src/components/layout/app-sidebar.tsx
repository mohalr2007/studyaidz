"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { NAV_LINKS } from '@/lib/constants';
import type { ReactNode } from 'react';

export function AppSidebar({ userNav }: { userNav: ReactNode }) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_LINKS.map((link) => {
            // Remove the locale from the pathname for comparison
            const currentPath = pathname.split('/').slice(2).join('/');
            const linkPath = link.href.startsWith('/') ? link.href.substring(1) : link.href;
            const isActive = currentPath.startsWith(linkPath);
            
            return (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ children: link.label, side: 'right' }}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {userNav}
      </SidebarFooter>
    </Sidebar>
  );
}
