'use client';
import { useSocket } from '@/config/providers';

export const useSetViewed = (messageId: string) => {
  const socket = useSocket();

  return () => {
    socket.emit('view_message', messageId);
  };
};
