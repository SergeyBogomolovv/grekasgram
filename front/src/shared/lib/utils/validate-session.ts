import { JWT_SECRET } from '@/shared/constants';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function validateSession() {
  const token = cookies().get('refreshToken')?.value;
  if (!token) return false;
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    const payload = await jwtVerify(token, secret);
    if (!payload) return false;
    return true;
  } catch (error) {
    return false;
  }
}
