import { renderHook, waitFor } from '@test/utils';
import { describe, expect, it } from 'vitest';
import { useGetProfile } from '../api/use-get-profile';

describe('Use get Profile hook', () => {
  it('should mock', async () => {
    const { result } = renderHook(() => useGetProfile());
    await waitFor(() => expect(result.current.data?.username).toBe('griffit'));
  });
});
