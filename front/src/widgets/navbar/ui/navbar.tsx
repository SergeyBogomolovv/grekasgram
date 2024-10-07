'use client';
import { IoChatbubbles } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';
import { RiUserSearchLine } from 'react-icons/ri';
import ThemeSwitch from '@/shared/ui/theme-switch';
import { ProfileButton } from '@/features/profile-button';
import { NavButton } from '@/features/nav-button';
import { useCheckTab } from '../hooks/use-check-tab';
import MobileFooter from './mobile-footer';

export default function Navbar() {
  useCheckTab();

  return (
    <nav className="flex md:flex-col p-2 gap-2 items-center justify-around md:justify-between md:border-r-2 border-t-2 md:border-t-0">
      <div className="hidden md:flex flex-col gap-2">
        <NavButton toolipSide="right" tab="chats" label="Чаты">
          <IoChatbubbles className="size-6" />
        </NavButton>
        <NavButton toolipSide="right" tab="groups" label="Группы">
          <FaUsers className="size-6" />
        </NavButton>
        <NavButton toolipSide="right" tab="users" label="Поиск пользователей">
          <RiUserSearchLine className="size-6" />
        </NavButton>
      </div>
      <div className="md:flex flex-col gap-2 hidden">
        <ThemeSwitch />
        <ProfileButton />
      </div>
      <MobileFooter />
    </nav>
  );
}
