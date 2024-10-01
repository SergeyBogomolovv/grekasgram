import { jwtVerify } from 'jose';

import { JWT_SECRET } from '../constants';

const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function validateSession(token: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    if (!payload) return false;
    return true;
  } catch (error) {
    return false;
  }
}
