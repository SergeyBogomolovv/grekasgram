import { waitFor } from '@testing-library/dom';
import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';
import { useSearchParams } from 'next/navigation';
import { User } from '@/entities/user';
import UsersList from '../ui/users-list';
import { render } from '@testing-library/react';
import { QueryProvider } from '@/config/providers';
import { $api } from '@/shared/api';

const mockUsers: User[] = [
  {
    id: 'test-id',
    email: 'test-email',
    createdAt: '123',
    online: true,
    lastOnlineAt: '123',
    username: 'test-username',
    about: 'test-about',
    avatarUrl: 'test-avatar-url',
  },
  {
    id: 'test-id2',
    email: 'test-email2',
    createdAt: '1233',
    online: false,
    lastOnlineAt: '1235',
    username: 'test-username2',
    about: null,
    avatarUrl: null,
  },
];

vi.mock('next/navigation');

describe('UsersList', () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.mocked(useSearchParams, { partial: true }).mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render label if no query', () => {
    mockGet.mockReturnValue(null);
    const { getByText } = render(
      <QueryProvider>
        <UsersList />
      </QueryProvider>,
    );

    expect(
      getByText('Ищите пользователей, с которыми хотели бы пообщаться'),
    ).toBeInTheDocument();
  });

  it('should render users', async () => {
    const get = vi.spyOn($api, 'get').mockResolvedValue({ data: mockUsers });
    mockGet.mockReturnValue('test-query');

    const { getByText } = render(
      <QueryProvider>
        <UsersList />
      </QueryProvider>,
    );

    expect(get).toHaveBeenCalledOnce();

    expect(getByText('Загрузка...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText('test-username')).toBeInTheDocument();
      expect(getByText('test-username2')).toBeInTheDocument();
    });
  });

  it('should show not found', async () => {
    vi.spyOn($api, 'get').mockResolvedValue({ data: [] });
    mockGet.mockReturnValue('test-query');

    const { getByText } = render(
      <QueryProvider>
        <UsersList />
      </QueryProvider>,
    );

    await waitFor(() => {
      expect(getByText('Пользователи не найдены')).toBeInTheDocument();
    });
  });
});
