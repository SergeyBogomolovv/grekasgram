'use client';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import { useState } from 'react';
import { IoChatbubbles } from 'react-icons/io5';
import { Chatbar } from '@/features/chat-bar';
import Navbar from './navbar';

export default function MobileChatbar() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex flex-col items-center gap-1">
        <IoChatbubbles className="size-8" />
        <small className="text-xs">Чаты</small>
      </DrawerTrigger>
      <DrawerContent className="h-[95svh]">
        <DrawerHeader className="flex gap-2">
          <DrawerTitle aria-hidden="true" className="hidden">
            Чаты
          </DrawerTitle>
          <DrawerDescription aria-hidden="true" className="hidden">
            Выберите чат
          </DrawerDescription>
          <Navbar />
        </DrawerHeader>
        <Chatbar />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="secondary">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
