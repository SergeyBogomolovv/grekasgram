'use client';

import { MessageEntity } from '@/entities/message';
import { queryClient, socket } from '@/shared/api';
import { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket>(socket);

const invalidateUserStatusEvent = () => {
  queryClient.invalidateQueries({ queryKey: ['chat'] });
  queryClient.invalidateQueries({ queryKey: ['user-profile'] });
};

const pushMessage = (message: MessageEntity) => {
  const prev = queryClient.getQueryData<MessageEntity[]>([
    'messages',
    message.chatId,
  ]);

  queryClient.setQueryData(
    ['messages', message.chatId],
    prev ? [...prev, message] : [message],
  );
};

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    socket.connect();

    socket.on('chatCreated', () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
    });

    socket.on('receiveMessage', (message: MessageEntity) => {
      pushMessage(message);
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
    });

    socket.on('viewMessage', (message: MessageEntity) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.chatId] });
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
    });

    socket.on('updateMessage', (message: MessageEntity) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.chatId] });
    });

    socket.on('removeMessage', (message: MessageEntity) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.chatId] });
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
