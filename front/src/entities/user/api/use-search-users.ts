import { $api } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { userSchema } from '../model/user.schema';

export const useSearchUsers = (query?: string | null) => {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: async () => {
      const { data } = await $api.get(`/users/search?query=${query}`);
      const parsed = z.array(userSchema).parse(data);
      return parsed;
    },
    enabled: !!query,
  });
};
