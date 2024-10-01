'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import Link from 'next/link';
import { useLogout } from '@/features/auth';
import { useSearchParams } from 'next/navigation';
import UserAvatar from '@/shared/ui/user-avatar';

export default function ProfileButton() {
  const { mutate } = useLogout();
  const params = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="size-12"
        aria-label="Открыть меню профиля"
      >
        <UserAvatar className="size-full" src="https://github.com/shadcn.png" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6}>
        <DropdownMenuLabel>Мой профиль</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={{ pathname: '/profile', query: params.toString() }}>
            Настройки
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutate()}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
