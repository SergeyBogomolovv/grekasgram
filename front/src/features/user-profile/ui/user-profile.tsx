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
import Link from 'next/link';
import { useMemo } from 'react';
import NewChatModal from './new-chat-modal';
import ModalImage from '@/shared/ui/modal-image';
import InformationBlock from '@/shared/ui/information-block';
import { formatDate } from '@/shared/lib/utils';

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
      <SheetContent side="left" className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Информация о пользователе</SheetTitle>
          <ModalImage
            src={user?.avatarUrl || '/user-avatar.png'}
            alt="user avatar"
            className="rounded-lg aspect-square object-cover"
            width={500}
            height={500}
          />
          <SheetDescription>
            {user?.about ||
              'Пользователь не оставил дополнительной информации о себе'}
          </SheetDescription>
          <InformationBlock label="Имя:" content={user?.username} />
          <InformationBlock label="ID:" content={user?.id} />
          <InformationBlock
            label="Статус:"
            content={
              user?.online
                ? 'В сети'
                : `Заходил(а) ${formatDate(user?.lastOnlineAt || new Date().toISOString())}`
            }
          />

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
