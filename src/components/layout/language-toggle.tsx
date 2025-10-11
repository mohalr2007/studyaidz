"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (lang: 'ar' | 'en' | 'fr') => {
    if (!pathname) return
    // remove the current locale from the pathname
    const newPath = pathname.split('/').slice(2).join('/');
    router.replace(`/${lang}/${newPath}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage('ar')}>
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('fr')}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
