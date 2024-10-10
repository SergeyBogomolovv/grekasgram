'use server';

import { sessionSchema } from '../model/session.schema';
import { z } from 'zod';
import { decodeSession } from '@/shared/lib/decode-session';
import { fetcher } from '@/shared/api/fetcher';

export const getSessions = async () => {
  const res = await fetcher('/auth/all-sessions', {
    tags: ['sessions'],
  });

  const parsed = z.array(sessionSchema).parse(res);
  const currentSessionId = await decodeSession();
  return {
    currentSession: parsed.find((session) => session.id === currentSessionId),
    sessions: parsed.filter((session) => session.id !== currentSessionId),
  };
};
