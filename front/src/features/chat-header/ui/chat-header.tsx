'use client';
import { ChatOptions, useGetChatCompanion } from '@/entities/chat';
import { UserSkeleton } from '@/entities/user';
import { UserProfile } from '@/features/user-profile';
import { formatDate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import UserAvatar from '@/shared/ui/user-avatar';
import { SlOptions } from 'react-icons/sl';

export default function ChatHeader({ chatId }: { chatId: string }) {
  const { data, isLoading } = useGetChatCompanion(chatId);

  return (
    <header className="px-4 py-2 border-b-2 flex items-center justify-between gap-x-2">
      {data && !isLoading ? (
        <UserProfile userId={data.companionId}>
          <div className="flex items-center gap-x-2">
            <UserAvatar className="size-12" src={data.companionAvatarUrl} />
            <div className="flex flex-col items-start">
              <p className="font-bold">
                {isLoading ? 'Загрузка...' : data.companionUsername}
              </p>
              <p className="text-sm">
                {isLoading
                  ? 'Загрузка...'
                  : `Был(а) в сети: ${formatDate(data.companionLastOnlineAt || new Date().toISOString())}`}
              </p>
            </div>
          </div>
        </UserProfile>
      ) : (
        <UserSkeleton />
      )}

      {data && (
        <ChatOptions chatId={data.chatId} name={data.companionUsername}>
          <Button aria-label="Опции чата" variant="outline" size="icon">
            <SlOptions className="size-5" />
          </Button>
        </ChatOptions>
      )}
    </header>
  );
}
