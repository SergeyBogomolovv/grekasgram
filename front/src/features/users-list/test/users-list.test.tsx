import { renderComponentWithQueryClient } from '@test/render-component-with-query';
import UsersList from '../ui/users-list';
import { screen } from '@testing-library/dom';
import { Mock } from 'vitest';
import { useSearchUsers } from '../hooks/use-search-users';
import { useSearchParams } from 'next/navigation';

vi.mock('../hooks/use-search-users', () => ({
  useSearchUsers: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

describe('UsersList', () => {
  it('should render loading state', () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test-query'),
    });
    (useSearchUsers as Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderComponentWithQueryClient(<UsersList />);

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

    renderComponentWithQueryClient(<UsersList />);

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

    renderComponentWithQueryClient(<UsersList />);

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

    renderComponentWithQueryClient(<UsersList />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });
});
