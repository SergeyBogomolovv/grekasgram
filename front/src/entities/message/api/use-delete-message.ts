import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteMessage = (messageId: string) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await $api.delete(`/messages/delete/${messageId}`);
      return messageResponseSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => {
      toast.error('Произошла ошибка при удалении сообщения');
    },
  });
};
