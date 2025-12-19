
"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n-config';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';


const AlgerianFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" className="rounded-sm">
      <rect width="10" height="15" fill="#006233"/>
      <rect x="10" width="10" height="15" fill="#fff"/>
      <path d="M12.5 5.833c-1.02.578-2.312 0-2.312-1.146 0-.638.513-1.156 1.156-1.156.644 0 1.156.518 1.156 1.156m-1.156-2.885c-1.488 0-2.693 1.205-2.693 2.693s1.205 2.692 2.693 2.692a2.68 2.68 0 002.54-1.72.575.575 0 011.082.413 3.842 3.842 0 01-3.622 2.45c-2.12 0-3.84-1.718-3.84-3.835S8.93 2.115 11.05 2.115s3.84 1.718 3.84 3.835a.578.578 0 11-1.156 0 2.69 2.69 0 00-2.684-2.688z" fill="#d21034"/>
    </svg>
);


const FrenchFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 3 2" className="rounded-sm">
        <rect width="3" height="2" fill="#fff"/>
        <rect width="2" height="2" fill="#002654"/>
        <rect width="1" height="2" fill="#ED2939"/>
    </svg>
);


const UKFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 1000 500" className="rounded-sm">
        <path fill="#00247d" d="M0 0h1000v500H0z"/>
        <path fill="#fff" d="M0 0v56L444 250 0 444v56h56L500 306h0l444 194h56v-56L556 250 1000 56v-56h-56L500 194h0L56 0H0z"/>
        <path fill="#cf142b" d="M121 0v-1L500 167l379-168v1L500 183 121 0zm-2-2h-1l-23 52H40L0 71v13l46-19h55l-24 53-1 2 2 1 24-53h400l-24 53 2 1 1-2 24-53h55l46 19v-13l-40-19h-55l23-52h1l-1 1-22 51H500l379-168h-1l22 51zm760 504h1l23-52h55l40-18v-13l-46 19h-55l24-53 1-2-2-1-24 53H500l24-53-2-1-1 2-24 53h-55l-46-19v13l40 18h55l-23 52h-1l1-1 22-51H500l-379 168h1l22-51zM500 211l-433 193h22l411-183 411 183h22L500 211zm0 78l433-193h-22L500 272 89 88h-22l433 193z"/>
    </svg>
);


const languageOptions = {
    en: { name: 'English', flag: <UKFlag /> },
    fr: { name: 'Français', flag: <FrenchFlag /> },
    ar: { name: 'العربية', flag: <AlgerianFlag /> },
};

export function LanguageToggle() {
    const pathname = usePathname();
    const router = useRouter();

    const changeLocale = (locale: Locale) => {
        if (!pathname) return;
        const segments = pathname.split('/');
        segments[1] = locale;
        router.push(segments.join('/'));
        router.refresh();
    };
    
    const currentLocale = (pathname.split('/')[1] as Locale) || i18n.defaultLocale;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" suppressHydrationWarning>
                {Object.entries(languageOptions).map(([locale, { name, flag }]) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => changeLocale(locale as Locale)}
                        className={cn("flex items-center gap-2", currentLocale === locale && "bg-accent")}
                    >
                        {flag}
                        <span>{name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
