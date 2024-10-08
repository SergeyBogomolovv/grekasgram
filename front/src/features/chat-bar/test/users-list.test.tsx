import { screen } from '@testing-library/dom';
import { Mock } from 'vitest';
import { useSearchParams } from 'next/navigation';
import { useSearchUsers } from '@/entities/user';
import UsersList from '../ui/users-list';
import { render } from '@testing-library/react';

vi.mock('@/entities/user', async (importOriginal) => ({
  ...(await importOriginal()),
  useSearchUsers: vi.fn(),
}));

vi.mock('next/navigation');

describe('UsersList', () => {
  it('should render loading state', () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test-query'),
    });
    (useSearchUsers as Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<UsersList />);

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('should render no users found message', () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test-query'),
    });
    (useSearchUsers as Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<UsersList />);

    expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument();
  });

  it('should render message when query is empty', () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
    (useSearchUsers as Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<UsersList />);

    expect(
      screen.getByText('Ищите пользователей, с которыми хотели бы пообщаться'),
    ).toBeInTheDocument();
  });

  it('should render users list', () => {
    const mockUsers = [
      { id: '1', username: 'user1', about: 'about1', avatarUrl: 'avatar1' },
      { id: '2', username: 'user2', about: 'about2', avatarUrl: 'avatar2' },
    ];

    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test-query'),
    });
    (useSearchUsers as Mock).mockReturnValue({
      data: mockUsers,
      isLoading: false,
    });

    render(<UsersList />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });
});
