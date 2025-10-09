
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
import { UserNav } from './user-nav';

export function AppSidebar() {
  const pathname = usePathname();
  // TODO: Replace with Supabase user logic
  const user = null; 

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_LINKS.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(link.href)}
                  tooltip={{ children: link.label, side: 'left' }}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* {user && <UserNav user={user} />} */}
      </SidebarFooter>
    </Sidebar>
  );
}
