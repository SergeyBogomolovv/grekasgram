import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteChat = () => {
  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await $api.delete(`/chats/delete/${chatId}`);
      return messageResponseSchema.parse(data);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['favorite-chats'] });
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      toast.success('Чат успешно удален');
    },
    onError() {
      toast.error('Произошла ошибка удалении чата');
    },
  });
};
