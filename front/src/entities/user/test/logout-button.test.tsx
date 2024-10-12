import { vi, describe, it, expect } from 'vitest';
import LogoutButton from '../ui/logout-button';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';
import { useRouter } from 'next/navigation';
import { render } from '@test/utils';

vi.mock('@/shared/api');
vi.mock('next/navigation');

describe('LogoutButton', () => {
  it('should call logout', async () => {
    const mockRefresh = vi.fn();

    vi.mocked(useRouter, { partial: true }).mockReturnValue({
      refresh: mockRefresh,
    });

    const { getByText } = render(<LogoutButton>Logout</LogoutButton>);

    const user = userEvent.setup();

    await user.click(getByText('Logout'));

    expect($api.post).toHaveBeenCalledWith('/auth/logout');

    expect(mockRefresh).toHaveBeenCalledOnce();
  });
});
