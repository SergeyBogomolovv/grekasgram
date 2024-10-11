import { QueryProvider } from '@/config/providers';
import { render } from '@testing-library/react';
import { vi, describe, expect, it, Mock, beforeEach } from 'vitest';
import ProfileForm from '../ui/profile-form';
import { User } from '@/entities/user';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';
import { toast } from 'sonner';

const mockUser: User = {
  id: 'test-id',
  email: 'test-email',
  createdAt: '123',
  online: true,
  lastOnlineAt: '123',
  username: 'test-username',
  about: 'test-about',
  avatarUrl: 'test-avatar-url',
};

vi.mock('@/shared/api', () => ({
  $api: {
    post: vi.fn(),
  },
}));

vi.spyOn(toast, 'error');

describe('ProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call post', async () => {
    ($api.post as Mock).mockResolvedValue({ data: mockUser });

    const { getByPlaceholderText, getByRole } = render(
      <QueryProvider>
        <ProfileForm user={mockUser} />
      </QueryProvider>,
    );

    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Имя пользователя'), 'test-name');
    await user.type(getByPlaceholderText('Обо мне'), 'test-about');
    await user.click(getByRole('button', { name: 'Сохранить' }));

    expect($api.post).toHaveBeenCalledOnce();
  });

  it('should handle error', async () => {
    ($api.post as Mock).mockRejectedValue(new Error());

    const { getByRole } = render(
      <QueryProvider>
        <ProfileForm user={mockUser} />
      </QueryProvider>,
    );
    const user = userEvent.setup();

    await user.click(getByRole('button', { name: 'Сохранить' }));

    expect(toast.error).toHaveBeenCalledOnce();
  });
});
