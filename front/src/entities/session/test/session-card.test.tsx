import { vi, expect, describe, it, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SessionEntity } from '../model/session.schema';
import UserSessionCard from '../ui/user-session-card';
import { deleteSession } from '../api/delete-session';
import { logoutFromOtherDevices } from '../api/logout-from-other-devices';

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

  it('should not render current session', () => {
    render(<UserSessionCard session={mockSession} />);

    fireEvent.click(screen.getByTestId('user-session-card-button'));

    expect(deleteSession).toHaveBeenCalledWith(mockSession.id);
    expect(logoutFromOtherDevices).not.toHaveBeenCalled();

    expect(screen.queryByText('Это устройство')).not.toBeInTheDocument();
    expect(screen.queryByText('Сеанс')).toBeInTheDocument();
  });

  it('should render current session', () => {
    render(<UserSessionCard session={mockSession} isCurrent />);

    fireEvent.click(screen.getByTestId('user-session-card-button'));

    expect(deleteSession).not.toHaveBeenCalled();
    expect(logoutFromOtherDevices).toHaveBeenCalled();

    expect(screen.getByText('Это устройство')).toBeInTheDocument();
    expect(screen.queryByText('Сеанс')).not.toBeInTheDocument();
  });
});
