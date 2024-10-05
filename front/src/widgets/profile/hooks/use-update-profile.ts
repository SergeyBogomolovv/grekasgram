import { useMutation } from '@tanstack/react-query';
import { PublicInfoFormFields } from '../model/public-info-form.schema';
import $api from '@/shared/config/api';
import { userSchema } from '@/entities/user';
import queryClient from '@/shared/config/query';
import { toast } from 'sonner';

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async (values: PublicInfoFormFields) => {
      const formData = new FormData();
      if (values.username) formData.append('username', values.username);
      if (values.about) formData.append('about', values.about);
      if (values.avatar) formData.append('avatar', values.avatar);
      const { data } = await $api.post('/users/update-profile', formData);
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
