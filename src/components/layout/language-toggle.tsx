
'use client';

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
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="10" height="15" fill="#006233"/>
        <rect x="10" width="10" height="15" fill="white"/>
        <path d="M11.25 4.875C10.8358 4.64601 10.3642 4.64601 9.95 4.875L9.5 5.145V4.375C9.5 3.95804 9.16421 3.625 8.75 3.625C8.33579 3.625 8 3.95804 8 4.375V6.03516L7.38281 6.38867C6.9686 6.61766 6.63281 7.03926 6.63281 7.5C6.63281 8.16421 7.18579 8.625 7.85 8.625H8.75V9.875C8.75 10.292 9.08579 10.625 9.5 10.625C9.91421 10.625 10.25 10.292 10.25 9.875V8.625H11.15C11.8142 8.625 12.3672 8.16421 12.3672 7.5C12.3672 7.03926 12.0314 6.61766 11.6172 6.38867L11 6.03516V4.375C11 3.95804 10.6642 3.625 10.25 3.625C9.83579 3.625 9.5 3.95804 9.5 4.375V5.145L10.05 4.875C10.4642 4.64601 10.9358 4.64601 11.35 4.875L11.95 5.20508L12.55 4.875C12.9642 4.64601 13.4358 4.64601 13.85 4.875L14.45 5.20508L15.05 4.875C15.4642 4.64601 15.9358 4.64601 16.35 4.875L16.95 5.20508L17.55 4.875C17.9642 4.64601 18.4358 4.64601 18.85 4.875C19.2642 4.64601 19.7358 4.64601 20.15 4.875" stroke="#D21034" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const FrenchFlag = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="15" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H6.66667V15H0V0Z" fill="#002654"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M13.3333 0H20V15H13.3333V0Z" fill="#ED2939"/>
    </svg>
);


const UKFlag = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="15" fill="#012169"/>
        <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="3"/>
        <path d="M-1 2L7 -3.5M13 18.5L21 13" stroke="#C8102E" strokeWidth="2"/>
        <path d="M0 15L8 9.5M12 5.5L20 0" stroke="#C8102E" strokeWidth="2"/>
        <path d="M10 0V15M0 7.5H20" stroke="white" strokeWidth="5"/>
        <path d="M10 0V15M0 7.5H20" stroke="#C8102E" strokeWidth="3"/>
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
            <DropdownMenuContent align="end">
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
