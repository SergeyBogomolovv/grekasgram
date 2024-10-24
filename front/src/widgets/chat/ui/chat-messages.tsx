'use client';
import {
  MessageCard,
  MessageSkeleton,
  useGetMessages,
} from '@/entities/message';
import { useGetProfile } from '@/entities/user';
import { useEffect, useRef } from 'react';

export default function ChatMessages({ chatId }: { chatId: string }) {
  const { data, isLoading } = useGetMessages(chatId);
  const { data: user } = useGetProfile();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  //TODO: update
  useEffect(() => {
    messagesContainerRef.current?.scrollTo(
      0,
      messagesContainerRef.current.scrollHeight,
    );
  }, [data]);

  return (
    <section
      ref={messagesContainerRef}
      className="flex-grow flex flex-col gap-4 p-4 overflow-y-scroll scrollbar:hidden"
    >
      {isLoading && (
        <>
          <MessageSkeleton className="w-[300px] self-end" />
          <MessageSkeleton className="w-[250px]" />
          <MessageSkeleton className="w-[320px] self-end" />
          <MessageSkeleton className="w-[250px] self-end" />
          <MessageSkeleton className="w-[400px]" />
          <MessageSkeleton className="w-[200px]" />
          <MessageSkeleton className="w-[250px]" />
          <MessageSkeleton className="w-[250px] self-end" />
          <MessageSkeleton className="w-[320px] self-end" />
        </>
      )}
      {data?.map((msg) => (
        <MessageCard message={msg} key={msg.id} userId={user?.id} />
      ))}
    </section>
  );
}
