'use client';
import { $api } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { chatCompanionSchema } from '../model/chat.schema';
import { useRouter } from 'next/navigation';

export const useGetChatCompanion = (chatId: string) => {
  const router = useRouter();

  return useQuery({
    queryKey: ['chat-companion', chatId],
    queryFn: async () => {
      try {
        const { data } = await $api.get(`/chats/companion/${chatId}`);
        return chatCompanionSchema.parse(data);
      } catch (error) {
        router.push('/');
      }
    },
  });
};
