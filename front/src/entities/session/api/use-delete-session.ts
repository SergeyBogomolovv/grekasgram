import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteSession = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $api.post(`/auth/logout-from-device/${id}`);
      return messageResponseSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Сеанс успешно завершен');
    },
    onError: () => {
      toast.error('Произошла ошибка при удалении сеанса');
    },
  });
};
