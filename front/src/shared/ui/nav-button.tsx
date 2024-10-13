'use client';
import { cn } from '@/shared/lib/utils/utils';
import { Button, ButtonProps } from '@/shared/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs } from '@/shared/lib/model/tabs';
import { useCurrentTab } from '@/shared/lib/hooks/use-current-tab';

interface Props extends ButtonProps {
  label?: string;
  tab: Tabs;
  buttonSize?: 'base' | 'sm';
  toolipSide: 'right' | 'bottom';
}

export default function NavButton({
  label,
  children,
  tab,
  buttonSize = 'base',
  toolipSide,
  ...props
}: Props) {
  const currentTab = useCurrentTab();
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
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
        <TooltipContent side={toolipSide}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
