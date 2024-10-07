'use client';
import { NavButton } from '@/features/nav-button';
import { SearchInput } from '@/features/search-input';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { RiUserSearchLine } from 'react-icons/ri';
import { IoChatbubbles } from 'react-icons/io5';
import CurrentTab from './current-tab';

export default function MobileChatbar() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex flex-col items-center gap-1 md:hidden">
        <IoChatbubbles className="size-8" />
        <small className="text-xs">Чаты</small>
      </DrawerTrigger>
      <DrawerContent className="h-[95svh]">
        <DrawerHeader className="flex gap-2">
          <NavButton toolipSide="bottom" tab="chats" label="Чаты">
            <IoChatbubbles className="size-6" />
          </NavButton>
          <NavButton toolipSide="bottom" tab="groups" label="Группы">
            <FaUsers className="size-6" />
          </NavButton>
          <NavButton
            toolipSide="bottom"
            tab="users"
            label="Поиск пользователей"
          >
            <RiUserSearchLine className="size-6" />
          </NavButton>
        </DrawerHeader>
        <div className="md:flex border-r-2 flex-col items-center overflow-y-auto">
          <SearchInput />
          <CurrentTab />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="secondary">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
