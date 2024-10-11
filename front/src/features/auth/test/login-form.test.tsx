import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { describe, vi, expect, it, afterEach, Mock } from 'vitest';
import LoginForm from '../ui/login-form';
import { toast } from 'sonner';
import { QueryProvider } from '@/config/providers';
import { $api } from '@/shared/api';
import { useRouter } from 'next/navigation';

vi.mock('@/shared/api', () => ({
  $api: {
    post: vi.fn(),
  },
}));

vi.spyOn(toast, 'success');

vi.mock('next/navigation');

describe('LoginForm', () => {
  const mockRouter = { refresh: vi.fn() };

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call post with correct input and show toast', async () => {
    ($api.post as Mock).mockResolvedValue({ data: { message: 'ok' } });

    const { getByLabelText, getByTestId } = render(
      <QueryProvider>
        <LoginForm />
      </QueryProvider>,
    );

    const user = userEvent.setup();
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');
    await user.click(getByTestId('login-button'));

    expect($api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'email@example.com',
      password: '123456',
    });

    expect(toast.success).toHaveBeenCalledWith('Вы успешно вошли в аккаунт');

    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it('should not call post if form is invalid', async () => {
    const { getByTestId } = render(
      <QueryProvider>
        <LoginForm />
      </QueryProvider>,
    );

    const user = userEvent.setup();
    await user.click(getByTestId('login-button'));

    expect($api.post).not.toHaveBeenCalled();
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });

  it('should show error message', async () => {
    ($api.post as Mock).mockRejectedValue(new Error());

    const { getByTestId, getByLabelText, getByText } = render(
      <QueryProvider>
        <LoginForm />
      </QueryProvider>,
    );

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
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });
});
