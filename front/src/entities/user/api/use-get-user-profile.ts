import { useQuery } from '@tanstack/react-query';
import { $api } from '@/shared/api';
import { publicUserSchema } from '../model/public-user.schema';

export const useGetUserProfile = (id: string) => {
  return useQuery({
    queryKey: ['user-profile', id],
    queryFn: async () => {
      const { data } = await $api.get(`/users/user-profile/${id}`);
      const parsed = publicUserSchema.parse(data);
      return parsed;
    },
  });
};
