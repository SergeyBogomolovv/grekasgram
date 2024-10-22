'use client';
import { useGetMyChats } from '@/entities/chat';
import { useGetUserProfile } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { DialogClose } from '@/shared/ui/dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from '@/shared/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import NewChatModal from './new-chat-modal';

interface Props {
  children: React.ReactNode;
  userId: string;
}

export default function UserProfile({ children, userId }: Props) {
  const { data: user } = useGetUserProfile(userId);

  const { data: myChats } = useGetMyChats();

  const existingChat = useMemo(
    () => myChats?.find((chat) => chat.companionId === userId),
    [myChats, userId],
  );

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Информация о {user?.username}</SheetTitle>
          <Image
            src={user?.avatarUrl || '/user-avatar.png'}
            alt="user avatar"
            className="rounded-lg"
            width={500}
            height={500}
          />
          <SheetDescription>
            {user?.about ||
              'Пользователь не оставил дополнительной информации о себе'}
          </SheetDescription>
          {existingChat && (
            <DialogClose asChild>
              <Button asChild>
                <Link href={`/${existingChat.chatId}`}>Перейти в чат</Link>
              </Button>
            </DialogClose>
          )}
          {!existingChat && user && (
            <NewChatModal user={user}>
              <Button>Написать</Button>
            </NewChatModal>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
