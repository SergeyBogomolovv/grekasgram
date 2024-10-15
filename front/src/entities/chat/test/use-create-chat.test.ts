import { renderHook, waitFor } from '@test/utils';
import { vi, expect, describe, it, afterEach } from 'vitest';
import { useCreateChat } from '../api/use-create-chat';
import { $api } from '@/shared/api';
import { toast } from 'sonner';

vi.mock('@/shared/api');
vi.mock('next/navigation');

describe('useCreateChat', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send data and show success toast', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: { chatId: 'id' } });

    const { result } = renderHook(() => useCreateChat());

    result.current.mutate('test-id');

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledWith('/chats/create', {
        companionId: 'test-id',
      });
    });
  });

  it('should handle error', async () => {
    vi.spyOn(toast, 'error');
    vi.mocked($api.post).mockRejectedValue(new Error());
    const { result } = renderHook(() => useCreateChat());

    result.current.mutate('test-id');

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Произошла ошибка при создании чата',
      ),
    );
  });
});
