import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EditMessageFields } from '../model/edit-message.schema';

export const useEditMessage = (messageId: string) => {
  return useMutation({
    mutationFn: async (values: EditMessageFields) => {
      const { data } = await $api.put(`/messages/edit/${messageId}`, values);
      return messageResponseSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => {
      toast.error('Произошла ошибка при редактировании сообщения');
    },
  });
};
