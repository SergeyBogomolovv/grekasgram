'use client';
import { useSocket } from '@/config/providers';
import { MessageFormFields } from '../model/schema';

export const useSendMessage = (chatId: string) => {
  const socket = useSocket();

  return (payload: MessageFormFields) => {
    socket.emit('send_message', { ...payload, chatId });
  };
};
