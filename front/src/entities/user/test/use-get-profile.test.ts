import { renderHook, waitFor } from '@test/utils';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { useGetProfile } from '../api/use-get-profile';
import { $api } from '@/shared/api';
import { mockUsers } from '@test/mocks/users';

vi.mock('@/shared/api');

describe('Use get Profile hook', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should get user', async () => {
    vi.mocked($api.get).mockResolvedValue({ data: mockUsers[0] });
    const { result } = renderHook(() => useGetProfile());

    await waitFor(() =>
      expect(result.current.data?.username).toBe(mockUsers[0].username),
    );
  });

  it('should handle error', async () => {
    vi.mocked($api.get).mockRejectedValue(new Error());

    const { result } = renderHook(() => useGetProfile());

    await waitFor(() => expect(result.current.data).toBeUndefined());

    await waitFor(() => expect(result.current.error).toBeDefined());
  });
});
