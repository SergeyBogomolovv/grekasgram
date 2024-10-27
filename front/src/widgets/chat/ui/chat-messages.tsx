'use client';
import {
  MessageCard,
  MessageEntity,
  MessageSkeleton,
} from '@/entities/message';
import { useGetProfile } from '@/entities/user';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGetMessages } from '../api/use-get-messages';
import { useSocket } from '@/config/providers';

export default function ChatMessages({ chatId }: { chatId: string }) {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } =
    useGetMessages(chatId);
  const [currentData, setCurrentData] = useState<MessageEntity[]>([]);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const initialRef = useRef(true);

  const { data: user } = useGetProfile();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const socket = useSocket();

  useEffect(() => {
    if (data) setCurrentData(data);
  }, [data]);

  useEffect(() => {
    socket.on('receiveMessage', (message: MessageEntity) => {
      setCurrentData((prev) => [...prev, message]);
    });

    socket.on('updateMessage', (message: MessageEntity) => {
      setCurrentData((prev) =>
        prev.map((msg) => (msg.id === message.id ? message : msg)),
      );
    });

    socket.on('removeMessage', (message: MessageEntity) => {
      setCurrentData((prev) => prev.filter((msg) => msg.id !== message.id));
    });

    socket.on('viewMessage', (message: MessageEntity) => {
      setCurrentData((prev) =>
        prev.map((msg) => (msg.id === message.id ? message : msg)),
      );
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('updateMessage');
      socket.off('removeMessage');
      socket.off('viewMessage');
    };
  }, [socket]);

  useLayoutEffect(() => {
    if (messagesContainerRef.current && isUserAtBottom) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
      });
    }
    initialRef.current = false;
  }, [currentData.length, isUserAtBottom]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const atBottom = scrollTop + clientHeight >= scrollHeight - 150;

      if (atBottom && !isUserAtBottom) {
        setIsUserAtBottom(true);
      }

      if (!atBottom && isUserAtBottom) {
        setIsUserAtBottom(false);
      }

      if (
        scrollTop < 150 &&
        !isFetching &&
        hasNextPage &&
        !initialRef.current
      ) {
        fetchNextPage();
      }
    }
  };

  return (
    <section
      onScroll={handleScroll}
      ref={messagesContainerRef}
      className="flex-grow flex gap-4 p-4 overflow-y-scroll scrollbar:hidden flex-col"
    >
      {isLoading && (
        <>
          <MessageSkeleton className="w-[300px] self-end" />
          <MessageSkeleton className="w-[250px]" />
          <MessageSkeleton className="w-[320px] self-end" />
          <MessageSkeleton className="w-[250px] self-end" />
          <MessageSkeleton className="w-[400px]" />
          <MessageSkeleton className="w-[200px]" />
        </>
      )}
      {currentData.map((msg) => (
        <MessageCard message={msg} key={msg.id} userId={user?.id} />
      ))}
    </section>
  );
}
