import { waitFor } from '@testing-library/dom';
import { Mock, describe, vi, expect, it, afterEach } from 'vitest';
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

vi.mock('@/shared/api', () => ({
  $api: {
    get: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({ useSearchParams: vi.fn() }));

describe('UsersList', () => {
  const mockGet = vi.fn();
  const mockSearchParams = {
    get: mockGet,
  };

  beforeEach(() => {
    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    vi.clearAllMocks();
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
    ($api.get as Mock).mockResolvedValue({ data: mockUsers });

    mockGet.mockReturnValue('test-query');
    const { getByText } = render(
      <QueryProvider>
        <UsersList />
      </QueryProvider>,
    );

    expect($api.get).toHaveBeenCalledOnce();

    expect(getByText('Загрузка...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText('test-username')).toBeInTheDocument();
      expect(getByText('test-username2')).toBeInTheDocument();
    });
  });

  it('should show not found', async () => {
    ($api.get as Mock).mockResolvedValue({ data: [] });

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
