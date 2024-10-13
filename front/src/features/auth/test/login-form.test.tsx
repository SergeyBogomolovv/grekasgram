import userEvent from '@testing-library/user-event';
import { describe, vi, expect, it, afterEach } from 'vitest';
import LoginForm from '../ui/login-form';
import { toast } from 'sonner';
import { $api } from '@/shared/api';
import { useRouter } from 'next/navigation';
import { render, waitFor } from '@test/utils';
import { setAccessToken } from '@/shared/lib/utils';

vi.mock('next/navigation');
vi.mock('@/shared/api');
vi.mock('@/shared/lib/utils');

describe('LoginForm', () => {
  const mockRefresh = vi.fn();

  vi.mocked(useRouter, { partial: true }).mockReturnValue({
    refresh: mockRefresh,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call post with correct input, set access token and show toast', async () => {
    vi.mocked($api.post).mockResolvedValue({
      data: { accessToken: 'access-token' },
    });

    vi.spyOn(toast, 'success');

    const { getByLabelText, getByTestId } = render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');
    await user.click(getByTestId('login-button'));

    await waitFor(() => {
      expect($api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'email@example.com',
        password: '123456',
      });

      expect(toast.success).toHaveBeenCalledWith('Вы успешно вошли в аккаунт');
      expect(setAccessToken).toHaveBeenCalledWith('access-token');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('should not call post if form is invalid', async () => {
    const { getByTestId } = render(<LoginForm />);

    const user = userEvent.setup();
    await user.click(getByTestId('login-button'));

    expect($api.post).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('should show error message', async () => {
    vi.mocked($api.post).mockRejectedValue(new Error());

    vi.spyOn(toast, 'success');

    const { getByTestId, getByLabelText, getByText } = render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');
    await user.click(getByTestId('login-button'));

    expect($api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'email@example.com',
      password: '123456',
    });

    expect(getByText('Введенны неверные данные')).toBeInTheDocument();

    expect(toast.success).not.toHaveBeenCalledWith(
      'Вы успешно вошли в аккаунт',
    );
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
