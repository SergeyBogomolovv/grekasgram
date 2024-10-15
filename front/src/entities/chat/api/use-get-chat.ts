'use client';
import { $api } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { chatSchema } from '../model/chat.schema';
import { useRouter } from 'next/navigation';

export const useGetChat = (id: string) => {
  const router = useRouter();

  return useQuery({
    queryKey: ['chat', id],
    queryFn: async () => {
      try {
        const { data } = await $api.get(`/chats/chat/${id}`);
        return chatSchema.parse(data);
      } catch (error) {
        router.push('/');
      }
    },
  });
};
