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
  useEffect(() => {
    socket.connect();

    socket.on('chatCreated', () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
    });

    socket.on('receiveMessage', (message: MessageEntity) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.chatId] });
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
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
    });

    socket.on('removeMessage', (message: MessageEntity) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.chatId] });
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
    });

    socket.on('userOnline', ({ userId }: { userId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['chat-companion'] });
    });

    socket.on('userOffline', ({ userId }: { userId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['chat-companion'] });
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
