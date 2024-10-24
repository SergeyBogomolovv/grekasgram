'use client';
import { useSocket } from '@/config/providers';

export const useDeleteMessage = (messageId: string) => {
  const socket = useSocket();

  return () => {
    socket.emit('delete_message', messageId);
  };
};
