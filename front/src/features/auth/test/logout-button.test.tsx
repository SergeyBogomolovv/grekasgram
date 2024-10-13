import { vi, describe, it, expect } from 'vitest';
import LogoutButton from '../ui/logout-button';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';
import { useRouter } from 'next/navigation';
import { render, waitFor } from '@test/utils';
import { deleteAccessToken } from '@/shared/lib/utils';

vi.mock('@/shared/api');
vi.mock('next/navigation');
vi.mock('@/shared/lib/utils');

describe('LogoutButton', () => {
  const mockRefresh = vi.fn();

  vi.mocked(useRouter, { partial: true }).mockReturnValue({
    refresh: mockRefresh,
  });

  it('should call logout', async () => {
    const { getByText } = render(<LogoutButton>Logout</LogoutButton>);

    const user = userEvent.setup();

    await user.click(getByText('Logout'));

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledWith('/auth/logout');
      expect(deleteAccessToken).toHaveBeenCalledOnce();
      expect(mockRefresh).toHaveBeenCalledOnce();
    });
  });
});
