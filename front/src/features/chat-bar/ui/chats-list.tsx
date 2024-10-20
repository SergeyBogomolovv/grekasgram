'use client';
import { ChatCard, useGetMyChats } from '@/entities/chat';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function ChatsList() {
  const { data, isLoading, isError } = useGetMyChats();
  const query = useSearchParams().get('query');

  const filteredChats = useMemo(() => {
    if (!query) {
      return data;
    }
    return data?.filter((chat) => chat.companionUsername.includes(query));
  }, [data, query]);

  return (
    <div className="w-full flex flex-col divide-y-2 overflow-y-auto">
      {isError && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Произошла ошибка при загрузке чатов
        </p>
      )}
      {isLoading && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Загрузка...
        </p>
      )}
      {data?.length === 0 && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Чатов пока что нет
        </p>
      )}
      {!!data?.length && filteredChats?.length === 0 && (
        <p className="text-center text-muted-foreground font-mono p-3">
          По запросу &quot;{query}&quot; ничего не найдено
        </p>
      )}
      {filteredChats?.map((chat) => <ChatCard key={chat.chatId} chat={chat} />)}
    </div>
  );
}
