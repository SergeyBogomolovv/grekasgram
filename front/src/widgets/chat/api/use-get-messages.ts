import { $api } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { messageSchema } from '../../../entities/message/model/message.schema';
import { z } from 'zod';

export const useGetMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const { data } = await $api.get(`/messages/${chatId}`);
      return z.array(messageSchema).parse(data);
    },
  });
};
