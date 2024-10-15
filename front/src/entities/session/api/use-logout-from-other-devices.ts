import { $api, queryClient } from '@/shared/api';
import { messageResponseSchema } from '@/shared/lib/model';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLogoutFromOtherDevices = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await $api.post('/auth/logout-from-other-devices');
      return messageResponseSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Вы успешно вышли из других сеансов');
    },
    onError: () => {
      toast.error('Произошла ошибка при выходе из других сеансов');
    },
  });
};
