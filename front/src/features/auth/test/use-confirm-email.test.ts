import { act } from '@testing-library/react';
import { Mock } from 'vitest';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { renderHookWithQueryClient } from '@test/render-hook-with-query';
import { useConfirmEmail } from '../api/use-confirm-email';
import { $api } from '@/shared/api';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@/shared/api', () => ({
  $api: { post: vi.fn() },
}));

describe('useConfirmEmail', () => {
  const mockRouter = {
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it('should call post with correct params', async () => {
    ($api.post as Mock).mockResolvedValue({});

    const { result } = renderHookWithQueryClient(() => useConfirmEmail());

    await act(async () => {
      await result.current.mutateAsync('test-token');
    });

    expect($api.post).toHaveBeenCalledWith('/auth/confirm-email', {
      token: 'test-token',
    });
  });

  it('should call refresh after succes confirm', async () => {
    ($api.post as Mock).mockResolvedValue({});

    const { result } = renderHookWithQueryClient(() => useConfirmEmail());

    await act(async () => {
      await result.current.mutateAsync('test-token');
    });

    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it('should set error after response error', async () => {
    ($api.post as Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHookWithQueryClient(() => useConfirmEmail());

    await act(async () => {
      try {
        await result.current.mutateAsync('test-token');
      } catch (e) {}
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Произошла ошибка подтверждения почты',
    );
  });
});
