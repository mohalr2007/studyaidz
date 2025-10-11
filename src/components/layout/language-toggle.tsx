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

const FlagFR = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="h-3 w-4 me-2"><path fill="#002395" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#de2910" d="M2 0h1v2H2z"/></svg>;
const FlagGB = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="h-3 w-4 me-2"><clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0l60 30m0-30L0 30" clipPath="url(#a)" stroke="#C8102E" strokeWidth="4"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/></svg>;
const FlagSA = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" className="h-3 w-4 me-2"><path fill="#006c35" d="M0 0h1200v800H0z"/><text transform="translate(600 400)" fill="#fff" textAnchor="middle" style={{fontSize: "150px", fontFamily: "serif"}}>لَا إِلٰهَ إِلَّا الله مُحَمَّدٌ رَسُولُ الله</text></svg>;


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
          <FlagSA />
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('en')}>
          <FlagGB />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('fr')}>
          <FlagFR />
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
