import { renderHook, waitFor } from '@test/utils';
import { describe, expect, it } from 'vitest';
import { useGetProfile } from '../api/use-get-profile';
import { server } from '@test/mocks/server';
import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/constants';

describe('Use get Profile hook', () => {
  it('should get user', async () => {
    const { result } = renderHook(() => useGetProfile());
    await waitFor(() => expect(result.current.data?.username).toBe('sergey'));
  });

  it('should handle error', async () => {
    server.use(http.get(`${API_URL}/users/me`, () => HttpResponse.error()));
    const { result } = renderHook(() => useGetProfile());

    await waitFor(() => expect(result.current.data).toBeUndefined());

    await waitFor(() => expect(result.current.error).toBeDefined());
  });
});
