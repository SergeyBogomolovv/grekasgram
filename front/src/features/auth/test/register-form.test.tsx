import { vi, describe, it, expect, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import RegisterForm from '../ui/register-form';
import { $api } from '@/shared/api';
import { QueryProvider } from '@/config/providers';
import { AxiosError } from 'axios';

vi.mock('@/shared/api');

describe('RegisterForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call post with correct input and show success message', async () => {
    vi.spyOn($api, 'post').mockResolvedValue({ data: { message: 'ok' } });

    const { getByLabelText, getByRole, getByText } = render(
      <QueryProvider>
        <RegisterForm />
      </QueryProvider>,
    );
    const user = userEvent.setup();

    await user.type(getByLabelText('Имя'), 'User');
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');

    await user.click(getByRole('button', { name: 'Зарегистрироваться' }));

    expect($api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'email@example.com',
      username: 'User',
      password: '123456',
    });

    expect(
      getByText('Код подтверждения отправлен на вашу почту'),
    ).toBeInTheDocument();
  });

  it('should show conflict error message', async () => {
    const mockError = new AxiosError(
      'Request failed with status code 409',
      undefined,
      undefined,
      undefined,
      {
        status: 409,
        data: {},
      } as any,
    );
    vi.spyOn($api, 'post').mockRejectedValue(mockError);

    const { getByRole, getByLabelText, getByText } = render(
      <QueryProvider>
        <RegisterForm />
      </QueryProvider>,
    );

    const user = userEvent.setup();
    await user.type(getByLabelText('Имя'), 'User');
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');

    await user.click(getByRole('button', { name: 'Зарегистрироваться' }));

    expect(getByText('Такой пользователь уже существует')).toBeInTheDocument();
  });

  it('should show other error message', async () => {
    vi.spyOn($api, 'post').mockRejectedValue(new Error());

    const { getByRole, getByLabelText, getByText } = render(
      <QueryProvider>
        <RegisterForm />
      </QueryProvider>,
    );

    const user = userEvent.setup();
    await user.type(getByLabelText('Имя'), 'User');
    await user.type(getByLabelText('Email'), 'email@example.com');
    await user.type(getByLabelText('Пароль'), '123456');

    await user.click(getByRole('button', { name: 'Зарегистрироваться' }));

    expect(
      getByText('Что то пошло не так, попробуйте еще раз'),
    ).toBeInTheDocument();
  });

  it('should not call post if form is invalid', async () => {
    const { getByRole } = render(
      <QueryProvider>
        <RegisterForm />
      </QueryProvider>,
    );
    const user = userEvent.setup();

    await user.click(getByRole('button', { name: 'Зарегистрироваться' }));

    expect($api.post).not.toHaveBeenCalled();
  });
});
