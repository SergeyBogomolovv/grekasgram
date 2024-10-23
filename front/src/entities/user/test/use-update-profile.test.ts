import { renderHook, waitFor } from '@test/utils';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useUpdateProfile } from '../api/use-update-profile';
import { toast } from 'sonner';
import { $api, queryClient } from '@/shared/api';
import { mockUsers } from '@test/mocks/users';

vi.mock('@/shared/api');

describe('useUpdateProfile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should update profile', async () => {
    vi.mocked($api.put).mockResolvedValue({ data: mockUsers[1] });

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
    vi.mocked($api.put).mockRejectedValue(new Error());

    vi.spyOn(toast, 'error');

    const { result } = renderHook(() => useUpdateProfile());

    result.current.mutate({ username: 'test' });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Произошла ошибка при обновлении профиля',
      ),
    );
  });
});
