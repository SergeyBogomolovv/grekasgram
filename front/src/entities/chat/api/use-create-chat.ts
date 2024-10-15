'use client';
import { $api, queryClient } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const responseSchema = z.object({
  chatId: z.string(),
});

export const useCreateChat = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (companionId: string) => {
      const { data } = await $api.post('/chats/create', { companionId });
      return responseSchema.parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      router.push(`/${data.chatId}`);
    },
    onError: () => {
      toast.error('Произошла ошибка при создании чата');
    },
  });
};
