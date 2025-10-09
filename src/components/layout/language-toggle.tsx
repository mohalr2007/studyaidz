
"use client"

import * as React from "react"
import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (lang: 'en' | 'fr' | 'ar') => {
    // In a real app, you would use a library like 'next-international'
    // or 'next-i18next' to change the locale. For now, we use search params.
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', lang);
    router.replace(currentUrl.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('fr')}>
          Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('ar')}>
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
