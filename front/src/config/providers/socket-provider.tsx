'use client';

import { MessageEntity } from '@/entities/message';
import { queryClient, socket } from '@/shared/api';
import { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket>(socket);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const invalidateMessageEvent = (chatId: string) => {
    queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    queryClient.invalidateQueries({ queryKey: ['my-chats'] });
    queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
  };

  const invalidateUserStatusEvent = () => {
    queryClient.invalidateQueries({ queryKey: ['chat'] });
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
  };

  useEffect(() => {
    socket.connect();

    socket.on('chatCreated', () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
    });

    socket.on('receiveMessage', (message: MessageEntity) => {
      invalidateMessageEvent(message.chatId);
    });

    socket.on('viewMessage', (message: MessageEntity) => {
      invalidateMessageEvent(message.chatId);
    });

    socket.on('updateMessage', (message: MessageEntity) => {
      invalidateMessageEvent(message.chatId);
    });

    socket.on('removeMessage', (message: MessageEntity) => {
      invalidateMessageEvent(message.chatId);
    });

    socket.on('userOnline', () => {
      invalidateUserStatusEvent();
    });

    socket.on('userOffline', () => {
      invalidateUserStatusEvent();
    });

    return () => {
      socket.disconnect();
      socket.off('receiveMessage');
      socket.off('userOnline');
      socket.off('userOffline');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
