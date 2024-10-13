import { $api, queryClient } from '@/shared/api';
import { renderHook, waitFor } from '@test/utils';
import { describe, it, vi, expect, afterEach } from 'vitest';
import { useDeleteSession } from '../api/use-delete-session';
import { toast } from 'sonner';

vi.mock('@/shared/api');

describe('useDeleteSession', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should revalidate queries and show success toast', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: { message: 'ok' } });

    vi.spyOn(queryClient, 'invalidateQueries');
    vi.spyOn(toast, 'success');

    const { result } = renderHook(() => useDeleteSession());

    result.current.mutate('test-id');

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledWith(
        '/auth/logout-from-device/test-id',
      );

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['sessions'],
      });

      expect(toast.success).toHaveBeenCalledWith('Сеанс успешно завершен');
    });
  });

  it('should show error toast', async () => {
    vi.mocked($api.post).mockRejectedValue(new Error());
    vi.spyOn(toast, 'error');

    const { result } = renderHook(() => useDeleteSession());

    result.current.mutate('test-id');

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledWith(
        '/auth/logout-from-device/test-id',
      );

      expect(toast.error).toHaveBeenCalledWith(
        'Произошла ошибка при удалении сеанса',
      );
    });
  });
});
