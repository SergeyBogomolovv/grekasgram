import { QueryProvider } from '@/config/providers';
import { render } from '@testing-library/react';
import { vi, describe, expect, it, afterEach } from 'vitest';
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

describe('ProfileForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call post', async () => {
    const post = vi.spyOn($api, 'post').mockResolvedValue({ data: mockUser });
    const success = vi.spyOn(toast, 'success');

    const { getByPlaceholderText, getByRole } = render(
      <QueryProvider>
        <ProfileForm user={mockUser} />
      </QueryProvider>,
    );

    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Имя пользователя'), 'test-name');
    await user.type(getByPlaceholderText('Обо мне'), 'test-about');
    await user.click(getByRole('button', { name: 'Сохранить' }));

    expect(post).toHaveBeenCalledOnce();

    expect(success).toHaveBeenCalledWith('Профиль обновлен');
  });

  it('should handle error', async () => {
    vi.spyOn($api, 'post').mockRejectedValue(new Error());

    const error = vi.spyOn(toast, 'error');

    const { getByRole } = render(
      <QueryProvider>
        <ProfileForm user={mockUser} />
      </QueryProvider>,
    );
    const user = userEvent.setup();

    await user.click(getByRole('button', { name: 'Сохранить' }));

    expect(error).toHaveBeenCalledWith(
      'Произошла ошибка при обновлении профиля',
    );
  });
});
