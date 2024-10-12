import userEvent from '@testing-library/user-event';
import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';
import LoginForm from '../ui/login-form';
import { toast } from 'sonner';
import { $api } from '@/shared/api';
import { useRouter } from 'next/navigation';
import { render } from '@test/utils';

vi.mock('next/navigation');
vi.mock('@/shared/api');

describe('LoginForm', () => {
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter, { partial: true }).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call post with correct input and show toast', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: { message: 'ok' } });
    vi.spyOn(toast, 'success');

    const { getByLabelText, getByTestId } = render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');
    await user.click(getByTestId('login-button'));

    expect($api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'email@example.com',
      password: '123456',
    });

    expect(toast.success).toHaveBeenCalledWith('Вы успешно вошли в аккаунт');

    expect(mockRefresh).toHaveBeenCalled();
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
