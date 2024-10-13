import { it, describe, vi, expect, afterEach } from 'vitest';
import { toast } from 'sonner';
import { $api } from '@/shared/api';
import { useRouter, useSearchParams } from 'next/navigation';
import ConfirmEmail from '../ui/confirm-email';
import { render, waitFor } from '@test/utils';
import { setAccessToken } from '@/shared/lib/utils';

vi.mock('next/navigation');
vi.mock('@/shared/api');
vi.mock('@/shared/lib/utils');

describe('ConfirmEmail', () => {
  const mockGet = vi.fn();
  const mockRefresh = vi.fn();

  vi.mocked(useRouter, { partial: true }).mockReturnValue({
    refresh: mockRefresh,
  });
  vi.mocked(useSearchParams, { partial: true }).mockReturnValue({
    get: mockGet,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call post if token exists', async () => {
    vi.mocked($api.post).mockResolvedValue({
      data: { accessToken: 'access-token' },
    });

    mockGet.mockReturnValue('test-token');

    render(<ConfirmEmail />);

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledWith('/auth/confirm-email', {
        token: 'test-token',
      });
      expect(mockRefresh).toHaveBeenCalled();
      expect(setAccessToken).toHaveBeenCalledWith('access-token');
    });
  });
  it('should not call post if token does not exist', async () => {
    mockGet.mockReturnValue(null);

    render(<ConfirmEmail />);

    await waitFor(() => expect($api.post).not.toHaveBeenCalled());
    await waitFor(() => expect(mockRefresh).not.toHaveBeenCalled());
  });
  it('should render error', async () => {
    vi.mocked($api.post).mockRejectedValue(new Error());

    vi.spyOn(toast, 'error');

    mockGet.mockReturnValue('test-token');

    render(<ConfirmEmail />);

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledOnce();
      expect(mockRefresh).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        'Произошла ошибка подтверждения почты',
      );
    });
  });
});
