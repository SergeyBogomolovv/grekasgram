'use client';
import { ChatCard, useGetFavorites } from '@/entities/chat';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function FavoritesList() {
  const { data, isLoading, isError } = useGetFavorites();
  const query = useSearchParams().get('query');

  const filteredChats = useMemo(() => {
    if (!query) {
      return data;
    }
    return data?.filter((chat) => chat.companion.username.includes(query));
  }, [data, query]);

  return (
    <div className="w-full flex flex-col divide-y-2 overflow-y-auto">
      {isError && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Произошла ошибка при загрузке избранных чатов
        </p>
      )}
      {isLoading && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Загрузка...
        </p>
      )}
      {data?.length === 0 && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Избранных чатов пока что нет
        </p>
      )}
      {!!data?.length && filteredChats?.length === 0 && (
        <p className="text-center text-muted-foreground font-mono p-3">
          По запросу &quot;{query}&quot; ничего не найдено
        </p>
      )}
      {filteredChats?.map((chat) => <ChatCard key={chat.id} chat={chat} />)}
    </div>
  );
}
