import { $api } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { chatPreviewSchema } from '../model/chat.schema';

export const useGetFavorites = () => {
  return useQuery({
    queryKey: ['favorite-chats'],
    queryFn: async () => {
      const { data } = await $api.get('/chats/favorites');
      return z.array(chatPreviewSchema).parse(data);
    },
  });
};
