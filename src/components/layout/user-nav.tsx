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
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/auth/actions"

export async function UserNav() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: student } = await supabase.from('students').select('full_name, username').eq('id', user?.id || '').single()

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-full justify-start gap-2 px-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata.avatar_url} alt={student?.username || ''} />
                <AvatarFallback>{getInitials(student?.full_name || user?.email || 'U')}</AvatarFallback>
            </Avatar>
            <div className="text-left group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium leading-none">{student?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
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
          <DropdownMenuItem>
            الملف الشخصي
          </DropdownMenuItem>
          <DropdownMenuItem>
            الإعدادات
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              تسجيل الخروج
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
