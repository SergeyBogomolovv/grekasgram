'use server';

import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

export const decodeSession = async () => {
  try {
    const jwt = cookies().get('session')?.value;
    if (!jwt) {
      return null;
    }
    const { sessionId } = verify(jwt, JWT_SECRET) as {
      sessionId: string;
    };
    return sessionId;
  } catch (error) {
    return null;
  }
};
