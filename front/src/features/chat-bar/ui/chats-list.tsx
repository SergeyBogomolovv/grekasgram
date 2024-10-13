'use client';
import { ChatCard, useGetMyChats } from '@/entities/chat';

export default function ChatsList() {
  const { data, isLoading } = useGetMyChats();
  return (
    <div className="w-full flex flex-col divide-y-2 overflow-y-auto">
      {isLoading && (
        <p className="text-center text-muted-foreground font-mono p-3">
          Загрузка...
        </p>
      )}
      {data?.map((chat) => <ChatCard key={chat.id} chat={chat} />)}
    </div>
  );
}
