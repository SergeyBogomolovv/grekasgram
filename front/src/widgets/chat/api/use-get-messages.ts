import { messageSchema } from '@/entities/message';
import { $api } from '@/shared/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const useGetMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', chatId],
    queryFn: async ({ pageParam }) => {
      const { data } = await $api.get(`/messages/${chatId}`, {
        params: { cursor: pageParam, count: 70 },
      });
      return z.array(messageSchema).parse(data);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.length ? lastPage.at(-1)?.createdAt : undefined,
    getPreviousPageParam: () => new Date().toISOString(),
    select: (data) => data.pages.flat().reverse(),
  });
};
