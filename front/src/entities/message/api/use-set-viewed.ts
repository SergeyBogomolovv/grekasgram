import { $api, queryClient } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';

export const useSetViewed = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await $api.patch(`/messages/view/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-chats'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-chats'] });
    },
  });
};
