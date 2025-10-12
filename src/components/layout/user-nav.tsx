
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/app/auth/actions"
import Link from "next/link"
import { useUser } from "@/hooks/use-user";
import { Edit, LogOut, Settings } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { type Locale } from "@/i18n-config";

export function UserNav() {
  const { user, student, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.split('/')[1] as Locale;


  const handleLogout = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await logout();
      // Force a hard reload to clear all state and redirect via middleware
      window.location.href = `/${lang}`;
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
       <div className="flex items-center gap-2 p-2">
         <Skeleton className="h-10 w-10 rounded-full" />
         <div className="w-24 h-4 rounded-md" />
       </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto w-full justify-start gap-3 p-2">
            <Avatar className="h-9 w-9">
                <AvatarImage src={user?.user_metadata.avatar_url} alt={student?.username || ''} />
                <AvatarFallback>{getInitials(student?.full_name || user?.email)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
                <AnimatePresence>
                  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    <p className="text-sm font-medium leading-none truncate">{student?.full_name || 'Anonymous'}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </motion.div>
                </AnimatePresence>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{student?.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/dashboard/profile`}>
              <Edit className="me-2" />
              <span>الملف الشخصي</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="me-2" />
            <span>الإعدادات</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form onSubmit={handleLogout}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full flex items-center">
              <LogOut className="me-2" />
              <span>تسجيل الخروج</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
