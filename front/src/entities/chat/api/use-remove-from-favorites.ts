import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRemoveFromFavorites = () => {
  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await $api.delete(
        `/chats/remove-from-favorites/${chatId}`,
      );
      return messageResponseSchema.parse(data);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['favorite-chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      toast.success('Чат удален из избранного');
    },
    onError() {
      toast.error('Произошла ошибка удалении из избранного');
    },
  });
};
