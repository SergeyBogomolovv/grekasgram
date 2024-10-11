'use server';

import { sessionSchema } from '../model/session.schema';
import { z } from 'zod';
import { decodeSession } from '@/shared/lib/decode-session';
import { fetcher } from '@/shared/api';

export const getSessions = async () => {
  const res = await fetcher('/auth/all-sessions', {
    tags: ['sessions'],
    schema: z.array(sessionSchema),
  });

  const currentSessionId = await decodeSession();
  return {
    currentSession: res.find((session) => session.id === currentSessionId),
    sessions: res.filter((session) => session.id !== currentSessionId),
  };
};
