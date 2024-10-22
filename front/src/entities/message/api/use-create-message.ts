import { $api, queryClient } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { messageSchema } from '../model/message.schema';
import { toast } from 'sonner';
import { MessageFormFields } from '@/features/chats/model/schema';

export const useCreateMessage = (chatId: string) => {
  return useMutation({
    mutationFn: async (values: MessageFormFields) => {
      const formData = new FormData();
      if (values.image) formData.append('image', values.image);
      formData.append('content', values.content);
      formData.append('chatId', chatId);
      const { data } = await $api.post('/messages/create', formData);
      return messageSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => {
      toast.error('Произошла ошибка при отправке сообщения');
    },
  });
};