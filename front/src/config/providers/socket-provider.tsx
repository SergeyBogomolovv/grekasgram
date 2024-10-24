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

    socket.on('receiveMessage', (message: MessageEntity) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.chatId] });
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
    });

    socket.on('userOnline', () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    });

    socket.on('userOffline', () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
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
