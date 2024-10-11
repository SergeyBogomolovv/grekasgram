import { vi, expect, describe, it, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { SessionEntity } from '../model/session.schema';
import UserSessionCard from '../ui/user-session-card';
import { deleteSession } from '../api/delete-session';
import { logoutFromOtherDevices } from '../api/logout-from-other-devices';
import userEvent from '@testing-library/user-event';

const mockSession: SessionEntity = {
  id: 'test-id',
  userId: 'test-user-id',
  device: 'test-device',
  ip: 'test-ip',
  loginedAt: new Date().toISOString(),
};

vi.mock('../api/logout-from-other-devices', () => ({
  logoutFromOtherDevices: vi.fn(async () => ({})),
}));

vi.mock('../api/delete-session', () => ({
  deleteSession: vi.fn(async () => ({})),
}));

describe('UserSessionCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render current session', async () => {
    const { getByText, queryByText } = render(
      <UserSessionCard session={mockSession} />,
    );

    const user = userEvent.setup();
    await user.click(getByText('Завершить сеанс'));

    expect(deleteSession).toHaveBeenCalledWith(mockSession.id);
    expect(logoutFromOtherDevices).not.toHaveBeenCalled();

    expect(queryByText('Это устройство')).not.toBeInTheDocument();
    expect(getByText('Сеанс')).toBeInTheDocument();
  });

  it('should render current session', async () => {
    const { getByText, queryByText } = render(
      <UserSessionCard session={mockSession} isCurrent />,
    );

    const user = userEvent.setup();
    await user.click(getByText('Выйти со всех других устройств'));

    expect(deleteSession).not.toHaveBeenCalled();
    expect(logoutFromOtherDevices).toHaveBeenCalled();

    expect(getByText('Это устройство')).toBeInTheDocument();
    expect(queryByText('Сеанс')).not.toBeInTheDocument();
  });
});
