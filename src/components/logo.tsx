import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <GraduationCap className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-headline font-bold text-primary">
        StudyAI <span className="text-accent">DZ</span>
      </h1>
    </div>
  );
}
