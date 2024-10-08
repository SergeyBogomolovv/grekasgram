import { useGetProfile } from '@/entities/user';
import ThemeSwitch from '@/shared/ui/theme-switch';
import UserAvatar from '@/shared/ui/user-avatar';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import MobileChatbar from './mobile-chatbar';

export default function MobileFooter() {
  const { data } = useGetProfile();
  return (
    <nav className="flex p-2 gap-2 items-center justify-around border-t-2">
      <ThemeSwitch>
        <button
          className="flex flex-col items-center gap-1 md:hidden"
          aria-label="Выбор темы"
        >
          <SunIcon className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <small className="text-xs">Тема</small>
        </button>
      </ThemeSwitch>
      <MobileChatbar />
      <Link
        href="/profile"
        className="flex flex-col gap-1 items-center md:hidden"
      >
        <UserAvatar src={data?.avatarUrl} className="size-8" />
        <small className="text-xs">Профиль</small>
      </Link>
    </nav>
  );
}
