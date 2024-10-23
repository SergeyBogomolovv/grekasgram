import { $api, queryClient } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

const responseSchema = z.object({
  chatId: z.string(),
});

interface Props {
  companionId: string;
  content: string;
}

export const useCreateChat = () => {
  return useMutation({
    mutationFn: async (dto: Props) => {
      const { data } = await $api.post('/chats/create', dto);
      return responseSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
    },
    onError: () => {
      toast.error('Произошла ошибка при создании чата');
    },
  });
};
