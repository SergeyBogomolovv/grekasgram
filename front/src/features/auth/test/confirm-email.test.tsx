import { Mock, it, describe, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { $api } from '@/shared/api';
import { useRouter, useSearchParams } from 'next/navigation';
import ConfirmEmail from '../ui/confirm-email';
import { QueryProvider } from '@/config/providers';

vi.mock('next/navigation');

vi.spyOn(toast, 'error');

vi.mock('@/shared/api', () => ({
  $api: {
    post: vi.fn(),
  },
}));

describe('ConfirmEmail', () => {
  const mockRouter = {
    refresh: vi.fn(),
  };

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call post if token exists', async () => {
    ($api.post as Mock).mockResolvedValue({ data: { message: 'ok' } });
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test-token'),
    });

    render(
      <QueryProvider>
        <ConfirmEmail />
      </QueryProvider>,
    );

    //waitFor for useEffect

    await waitFor(() =>
      expect($api.post).toHaveBeenCalledWith('/auth/confirm-email', {
        token: 'test-token',
      }),
    );

    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
  });
  it('should not call post if token does not exist', async () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });

    render(
      <QueryProvider>
        <ConfirmEmail />
      </QueryProvider>,
    );

    await waitFor(() => expect($api.post).not.toHaveBeenCalled());
    await waitFor(() => expect(mockRouter.refresh).not.toHaveBeenCalled());
  });
  it('should render error', async () => {
    ($api.post as Mock).mockRejectedValue(new Error());
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test-token'),
    });

    render(
      <QueryProvider>
        <ConfirmEmail />
      </QueryProvider>,
    );

    await waitFor(() => expect($api.post).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Произошла ошибка подтверждения почты',
      ),
    );
  });
});
