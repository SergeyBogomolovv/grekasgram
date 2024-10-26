import { $api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { messageSchema } from '@/entities/message';
import { MessageFormFields } from '../model/schema';

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
    onError: () => {
      toast.error('Произошла ошибка при отправке сообщения');
    },
  });
};
