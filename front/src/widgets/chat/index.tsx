'use client';

import React, { useRef, useEffect } from 'react';
import {
  MessageCard,
  MessageSkeleton,
  useGetMessages,
} from '@/entities/message';
import { useGetProfile } from '@/entities/user';
import { ChatHeader } from '@/features/chat-header';
import { MessageForm } from '@/features/message-form';

export default function Chat({ chatId }: { chatId: string }) {
  const { data, isLoading } = useGetMessages(chatId);
  const { data: user } = useGetProfile();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(messagesContainerRef.current?.scrollHeight);
  }, [data]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ChatHeader chatId={chatId} />
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
      <MessageForm chatId={chatId} />
    </div>
  );
}
