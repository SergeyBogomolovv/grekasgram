import { $api } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { chatSchema } from '../model/chat.schema';

export const useGetMyChats = () => {
  return useQuery({
    queryKey: ['my-chats'],
    queryFn: async () => {
      const { data } = await $api.get('/chats/my');
      return z.array(chatSchema).parse(data);
    },
  });
};
