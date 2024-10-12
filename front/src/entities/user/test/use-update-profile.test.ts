import { renderHook, waitFor } from '@test/utils';
import { vi, describe, it, expect } from 'vitest';
import { useUpdateProfile } from '../api/use-update-profile';
import { toast } from 'sonner';
import { queryClient } from '@/shared/api';
import { mockUsers } from '@test/mocks/users';
import { server } from '@test/mocks/server';
import { http, HttpResponse } from 'msw';
import { API_URL } from '@/shared/constants';

describe('useUpdateProfile', () => {
  it('should update profile', async () => {
    vi.spyOn(toast, 'success');
    vi.spyOn(queryClient, 'setQueryData');

    const { result } = renderHook(() => useUpdateProfile());

    result.current.mutate({ username: 'test' });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Профиль обновлен');
      expect(queryClient.setQueryData).toHaveBeenCalledWith(
        ['profile'],
        mockUsers[1],
      );
    });
  });

  it('should handle error', async () => {
    vi.spyOn(toast, 'error');

    const { result } = renderHook(() => useUpdateProfile());
    server.use(
      http.post(`${API_URL}/users/update-profile`, () => HttpResponse.error()),
    );

    result.current.mutate({ username: 'test' });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Произошла ошибка при обновлении профиля',
      ),
    );
  });
});
