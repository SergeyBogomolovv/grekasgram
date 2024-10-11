import { Mock, it, describe, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { $api } from '@/shared/api';
import { useRouter, useSearchParams } from 'next/navigation';
import ConfirmEmail from '../ui/confirm-email';
import { QueryProvider } from '@/config/providers';

vi.mock('next/navigation');

describe('ConfirmEmail', () => {
  const mockGet = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });
    (useSearchParams as Mock).mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call post if token exists', async () => {
    vi.spyOn($api, 'post').mockResolvedValue({ data: { message: 'ok' } });

    mockGet.mockReturnValue('test-token');

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

    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });
  it('should not call post if token does not exist', async () => {
    vi.spyOn($api, 'post').mockResolvedValue({ data: { message: 'ok' } });

    mockGet.mockReturnValue(null);

    render(
      <QueryProvider>
        <ConfirmEmail />
      </QueryProvider>,
    );

    await waitFor(() => expect($api.post).not.toHaveBeenCalled());
    await waitFor(() => expect(mockRefresh).not.toHaveBeenCalled());
  });
  it('should render error', async () => {
    const post = vi.spyOn($api, 'post').mockRejectedValue(new Error());

    const error = vi.spyOn(toast, 'error');

    mockGet.mockReturnValue('test-token');

    render(
      <QueryProvider>
        <ConfirmEmail />
      </QueryProvider>,
    );

    await waitFor(() => expect(post).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(error).toHaveBeenCalledWith(
        'Произошла ошибка подтверждения почты',
      ),
    );
  });
});
