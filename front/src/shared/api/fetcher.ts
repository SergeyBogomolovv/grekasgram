'use server';
import { cookies } from 'next/headers';
import { API_URL } from '../constants';

interface Options extends RequestInit {
  tags?: string[];
}

export async function fetcher<T = any>(prefix: string, options?: Options) {
  try {
    const res = await fetch(API_URL + prefix, {
      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
      next: { tags: options?.tags },
      ...options,
    });

    if (res.status === 401) {
      cookies().delete('session');
      return null;
    }

    return res.json() as T;
  } catch (error) {
    //TODO: update
    return null;
  }
}
