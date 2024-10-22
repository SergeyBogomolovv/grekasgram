'use client';

import React, { useRef, useEffect } from 'react';
import {
  MessageCard,
  MessageSkeleton,
  useGetMessages,
} from '@/entities/message';
import { useGetProfile } from '@/entities/user';

interface Props {
  chatId: string;
}

export default function MessagesContainer({ chatId }: Props) {
  const { data, isLoading } = useGetMessages(chatId);
  const { data: user } = useGetProfile();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current && data) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
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
