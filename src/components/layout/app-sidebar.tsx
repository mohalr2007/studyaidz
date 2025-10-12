'use client';

import {
  ChevronsRight,
  Menu,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { NAV_LINKS } from '@/lib/constants';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const NavItem = ({
  link,
  isExpanded,
  lang,
}: {
  link: (typeof NAV_LINKS)[0];
  isExpanded: boolean;
  lang: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(`/${lang}${link.href}`);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={`/${lang}${link.href}`}
            className={cn(
              'flex items-center gap-4 p-2 rounded-lg transition-colors duration-150',
              isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
            )}
          >
            <link.icon className="size-5 shrink-0" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="truncate"
                >
                  {link.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </TooltipTrigger>
        {!isExpanded && (
           <TooltipContent side="right" className="bg-background text-foreground border">
            {link.label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function AppSidebar({ userNav, lang }: { userNav: ReactNode, lang: string }) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  
  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ type: 'spring', stiffness: 2000, damping: 70 }}
      className={cn(
        'hidden md:flex flex-col justify-between border-e p-3 bg-card',
        isExpanded ? 'items-start' : 'items-center'
      )}
    >
      <div className="w-full">
        <div className={cn("flex items-center gap-2", isExpanded ? 'justify-between' : 'justify-center')}>
           <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Logo />
                </motion.div>
              )}
            </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronsRight className="transform rotate-180" /> : <Menu />}
          </Button>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.href} link={link} isExpanded={isExpanded} lang={lang} />
          ))}
        </nav>
      </div>

      <div className={cn("w-full", !isExpanded && "flex justify-center")}>
        {userNav}
      </div>
    </motion.div>
  );
}
