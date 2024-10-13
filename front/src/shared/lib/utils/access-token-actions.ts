'use server';

import { cookies } from 'next/headers';
export async function getAccessToken() {
  return cookies().get('accessToken')?.value;
}

export async function setAccessToken(accessToken: string) {
  cookies().set('accessToken', accessToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 1000 * 60 * 15),
  });
}

export async function deleteAccessToken() {
  cookies().delete('accessToken');
}
