'use client';

import { useSocket } from '@/config/providers';

export const useEditMessage = (messageId: string) => {
  const socket = useSocket();

  return (content: string) => {
    socket.emit('edit_message', { content, messageId });
  };
};
