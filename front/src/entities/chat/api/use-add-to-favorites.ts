import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddToFavorites = () => {
  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await $api.post(`/chats/add-to-favorites/${chatId}`);
      return messageResponseSchema.parse(data);
    },
    onSuccess() {
      toast.success('Чат добавлен в избранное');
      queryClient.invalidateQueries({ queryKey: ['favorite-chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
    onError() {
      toast.error('Произошла ошибка при добавлении в избранное');
    },
  });
};
