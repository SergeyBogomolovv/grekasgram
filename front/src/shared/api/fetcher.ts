'use server';
import { cookies } from 'next/headers';
import { API_URL } from '../constants';
import { ZodSchema } from 'zod';

interface Options<T> extends RequestInit {
  tags?: string[];
  schema?: ZodSchema<T>;
}

export async function fetcher<T = unknown>(
  prefix: string,
  options?: Options<T>,
): Promise<T> {
  const res = await fetch(API_URL + prefix, {
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
    next: { tags: options?.tags },
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookies().delete('session');
    }
    throw new Error(
      `Request failed with status ${res.status}: ${res.statusText}`,
    );
  }

  const data = await res.json();

  if (options?.schema) {
    return options.schema.parse(data);
  }

  return data as T;
}
