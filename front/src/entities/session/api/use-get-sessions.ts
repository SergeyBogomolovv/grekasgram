import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { sessionSchema } from '../model/session.schema';
import { $api } from '@/shared/api';

const responseSchema = z.object({
  current: sessionSchema,
  other: z.array(sessionSchema),
});

export const useGetSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await $api.get('/auth/all-sessions');
      return responseSchema.parse(data);
    },
  });
};
