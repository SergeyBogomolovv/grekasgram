import { vi, describe, expect, it, afterEach } from 'vitest';
import ProfileForm from '../ui/profile-form';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';
import { toast } from 'sonner';
import { render } from '@test/utils';
import { mockUsers } from '@test/mocks/users';

vi.mock('@/shared/api');

describe('ProfileForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call post', async () => {
    vi.mocked($api.get).mockResolvedValue({ data: mockUsers[0] });
    vi.mocked($api.post).mockResolvedValue({ data: mockUsers[1] });
    vi.spyOn(toast, 'success');

    const { getByPlaceholderText, getByRole } = render(<ProfileForm />);

    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Имя пользователя'), 'test-name');
    await user.type(getByPlaceholderText('Обо мне'), 'test-about');
    await user.click(getByRole('button', { name: 'Сохранить' }));

    expect($api.post).toHaveBeenCalledOnce();

    expect(toast.success).toHaveBeenCalledWith('Профиль обновлен');
  });

  it('should handle error', async () => {
    vi.mocked($api.get).mockResolvedValue({ data: mockUsers[0] });
    vi.mocked($api.post).mockRejectedValue(new Error());

    vi.spyOn(toast, 'error');

    const { getByRole } = render(<ProfileForm />);
    const user = userEvent.setup();

    await user.click(getByRole('button', { name: 'Сохранить' }));

    expect(toast.error).toHaveBeenCalledWith(
      'Произошла ошибка при обновлении профиля',
    );
  });
});
