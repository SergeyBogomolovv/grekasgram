'use client';
import { ChatOptions, useGetChat } from '@/entities/chat';
import { formatDate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import UserAvatar from '@/shared/ui/user-avatar';
import { SlOptions } from 'react-icons/sl';

export default function ChatHeader({ chatId }: { chatId: string }) {
  const { data, isLoading } = useGetChat(chatId);

  return (
    <header className="px-4 py-2 border-b-2 flex items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2">
        {/* TODO: add profile modal */}
        <UserAvatar className="size-12" src={data?.companion.avatarUrl} />
        <div className="flex flex-col">
          <p className="font-bold">
            {isLoading ? 'Загрузка...' : data?.companion.username}
          </p>
          <p className="text-sm">
            {isLoading
              ? 'Загрузка...'
              : `Был(а) в сети: ${formatDate(data?.companion.lastOnlineAt || new Date().toISOString())}`}
          </p>
        </div>
      </div>
      {data && (
        <ChatOptions chatId={data.id} name={data.companion.username}>
          <Button aria-label="Опции чата" variant="outline" size="icon">
            <SlOptions className="size-5" />
          </Button>
        </ChatOptions>
      )}
    </header>
  );
}
