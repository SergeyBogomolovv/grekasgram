import { useQuery } from '@tanstack/react-query';
import { userSchema } from '../model/user.schema';
import { $api } from '@/shared/api';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await $api.get('/users/me');
      const parsed = userSchema.parse(data);
      return parsed;
    },
  });
};
