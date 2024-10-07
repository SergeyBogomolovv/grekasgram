'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface Props {
  children?: React.ReactNode;
}

export default function ThemeSwitch({ children }: Props) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-full"
            aria-label="Выбор темы"
          >
            <SunIcon className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6}>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Светлая
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Темная
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          Системная
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
