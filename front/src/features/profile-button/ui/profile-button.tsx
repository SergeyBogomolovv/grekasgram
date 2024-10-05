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
import { useGetProfile } from '@/entities/user';

export default function ProfileButton() {
  const { mutate } = useLogout();
  const { data, isLoading } = useGetProfile();
  const params = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        className="size-12"
        aria-label="Открыть меню профиля"
      >
        <UserAvatar className="size-full" src={data?.avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6}>
        <DropdownMenuLabel>{data?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={{ pathname: '/profile', query: params.toString() }}>
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutate()}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
