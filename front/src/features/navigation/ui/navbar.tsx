'use client';
import { IoChatbubbles } from 'react-icons/io5';
import NavButton from '@/shared/ui/nav-button';
import { RiUserSearchLine } from 'react-icons/ri';
import { useCheckTab } from '../model/use-check-tab';

export default function Navbar() {
  useCheckTab();
  return (
    <nav className="flex md:flex-col gap-2">
      <NavButton toolipSide="right" tab="chats" label="Чаты">
        <IoChatbubbles className="size-6" />
      </NavButton>
      <NavButton toolipSide="right" tab="users" label="Поиск пользователей">
        <RiUserSearchLine className="size-6" />
      </NavButton>
    </nav>
  );
}
