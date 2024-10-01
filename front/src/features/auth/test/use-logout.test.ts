import { act } from '@testing-library/react';
import { Mock } from 'vitest';
import { useRouter } from 'next/navigation';
import $api from '@/shared/config/api';
import { renderHookWithQueryClient } from '@test/render-with-query';
import { useLogout } from '../hooks/use-logout';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/shared/config/api', async (importOriginal) => {
  const original = (await importOriginal()) as any;
  return {
    ...original,
    default: {
      post: vi.fn(),
    },
  };
});

describe('useLogout', () => {
  const mockRouter = {
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it('should call post with correct params', async () => {
    ($api.post as Mock).mockResolvedValue({});

    const { result } = renderHookWithQueryClient(() => useLogout());

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect($api.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('should call refresh after successful logout', async () => {
    ($api.post as Mock).mockResolvedValue({});

    const { result } = renderHookWithQueryClient(() => useLogout());

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockRouter.refresh).toHaveBeenCalled();
  });
});
