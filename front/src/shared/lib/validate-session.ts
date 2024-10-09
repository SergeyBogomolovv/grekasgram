import { cookies } from 'next/headers';
import { API_URL } from '../constants';

export async function validateSession() {
  try {
    const res = await fetch(API_URL + '/auth/validate-session', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString(),
      },
    });

    if (res.status === 401) {
      cookies().delete('session');
      return false;
    }

    if (res.ok) return true;

    return false;
  } catch (error) {
    return false;
  }
}
