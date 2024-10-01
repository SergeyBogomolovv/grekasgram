'use client';
import { cn } from '@/shared/lib/utils';
import { Button, ButtonProps } from '@/shared/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { Tabs, useCurrentTab } from '@/entities/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Props extends ButtonProps {
  label?: string;
  tab: Tabs;
  buttonSize?: 'base' | 'sm';
}

export default function NavButton({
  label,
  children,
  tab,
  buttonSize = 'base',
  ...props
}: Props) {
  const currentTab = useCurrentTab();
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            aria-label={label}
            size="icon"
            variant="outline"
            className={cn(
              'rounded-lg',
              { 'bg-muted': currentTab === tab },
              { 'size-12': buttonSize === 'base' },
              { 'size-8': buttonSize === 'sm' },
            )}
            {...props}
          >
            <Link href={{ pathname, query: { tab } }}>{children}</Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
