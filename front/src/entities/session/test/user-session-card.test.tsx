import { vi, expect, describe, it, afterEach, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import UserSessionCard from '../ui/user-session-card';
import userEvent from '@testing-library/user-event';
import { useDeleteSession } from '../api/use-delete-session';
import { useLogoutFromOtherDevices } from '../api/use-logout-from-other-devices';
import { mockSessions } from '@test/mocks/auth';

vi.mock('../api/use-delete-session');
vi.mock('../api/use-logout-from-other-devices');

describe('UserSessionCard', () => {
  const mockDelete = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.mocked(useDeleteSession, { partial: true }).mockReturnValue({
      mutate: mockDelete,
    });
    vi.mocked(useLogoutFromOtherDevices, { partial: true }).mockReturnValue({
      mutate: mockLogout,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render the current session', async () => {
    const { getByText, queryByText } = render(
      <UserSessionCard session={mockSessions[0]} />,
    );

    const user = userEvent.setup();
    await user.click(getByText('Завершить сеанс'));

    expect(mockDelete).toHaveBeenCalledWith(mockSessions[0].id);
    expect(mockLogout).not.toHaveBeenCalled();

    expect(queryByText('Это устройство')).not.toBeInTheDocument();
    expect(getByText('Сеанс')).toBeInTheDocument();
  });

  it('should render current session', async () => {
    const { getByText, queryByText } = render(
      <UserSessionCard session={mockSessions[0]} isCurrent />,
    );

    const user = userEvent.setup();
    await user.click(getByText('Выйти со всех других устройств'));

    expect(mockDelete).not.toHaveBeenCalledWith(mockSessions[0].id);
    expect(mockLogout).toHaveBeenCalled();

    expect(getByText('Это устройство')).toBeInTheDocument();
    expect(queryByText('Сеанс')).not.toBeInTheDocument();
  });
});
