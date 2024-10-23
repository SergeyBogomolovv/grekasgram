import { useMutation } from '@tanstack/react-query';
import { userSchema } from '@/entities/user';
import { toast } from 'sonner';
import { $api, queryClient } from '@/shared/api';

interface Values {
  username?: string;
  about?: string;
  avatar?: File | null;
}

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async ({ username, about, avatar }: Values) => {
      const formData = new FormData();
      if (username) formData.append('username', username);
      if (about) formData.append('about', about);
      if (avatar) formData.append('avatar', avatar);
      const { data } = await $api.put('/users/update-profile', formData);
      return userSchema.parse(data);
    },
    onSuccess(data) {
      queryClient.setQueryData(['profile'], data);
      toast.success('Профиль обновлен');
    },
    onError() {
      toast.error('Произошла ошибка при обновлении профиля');
    },
  });
