'use client';
import { User, UserCard } from '@/entities/user';
import { useCreateChat, useGetMyChats } from '@/entities/chat';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function UserButton({ user }: { user: User }) {
  const { mutate } = useCreateChat();
  const { data: myChats } = useGetMyChats();
  const router = useRouter();

  const isChatExist = useMemo(
    () => myChats?.some((chat) => chat.companionId === user.id),
    [myChats, user.id],
  );

  return (
    <button
      aria-label="Открыть чат с пользователем"
      onClick={() => {
        if (isChatExist) {
          const chat = myChats?.find((chat) => chat.companionId === user.id);
          if (!chat) return;
          router.push(`/${chat.chatId}`);
        } else {
          mutate(user.id);
        }
      }}
    >
      <UserCard
        name={user.username}
        about={user.about}
        avatarUrl={user.avatarUrl}
      />
    </button>
  );
}
