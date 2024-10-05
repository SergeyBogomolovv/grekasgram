'use client';
import { IoChatbubbles } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import ThemeSwitch from '@/shared/ui/theme-switch';
import { ProfileButton } from '@/features/profile-button';
import { NavButton } from '@/features/nav-button';
import { useCheckTab } from '../hooks/use-check-tab';

export default function Navbar() {
  useCheckTab();

  return (
    <nav className="min-w-[64px] flex flex-col p-2 items-center justify-between border-r-2">
      <div className="flex flex-col gap-y-2">
        <NavButton tab="chats" label="Чаты">
          <IoChatbubbles className="size-6" />
        </NavButton>
        <NavButton tab="favorites" label="Избранное">
          <FaStar className="size-6" />
        </NavButton>
        <NavButton tab="users" label="Поиск пользователей">
          <FaUsers className="size-6" />
        </NavButton>
      </div>
      {/* TODO: <Chatbar mobile /> */}
      <div className="flex flex-col gap-y-2">
        <ThemeSwitch />
        <ProfileButton />
      </div>
    </nav>
  );
}
