import { act } from '@testing-library/react';
import { Mock } from 'vitest';
import { UseFormReturn } from 'react-hook-form';
import $api from '@/shared/config/api';
import { isAxiosError } from 'axios';
import { useRegister } from '../hooks/use-register';
import { renderHookWithQueryClient } from '@test/render-hook-with-query';

vi.mock('@/shared/config/api', async (importOriginal) => {
  const original = (await importOriginal()) as any;
  return {
    ...original,
    default: {
      post: vi.fn(),
    },
  };
});

vi.mock('axios', async (importOriginal) => {
  const original = (await importOriginal()) as any;
  return {
    ...original,
    isAxiosError: vi.fn(),
  };
});

describe('useRegister', () => {
  const mockForm: UseFormReturn<any> = {
    reset: vi.fn(),
    setError: vi.fn(),
  } as any;

  const setSuccessMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send data and setSuccessMessage', async () => {
    const mockResponse = { message: 'Успех' };
    ($api.post as Mock).mockResolvedValue({ data: mockResponse });

    const { result } = renderHookWithQueryClient(() =>
      useRegister(mockForm, setSuccessMessage),
    );

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect($api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'test@test.com',
      password: 'password',
    });

    expect(mockForm.reset).toHaveBeenCalled();
    expect(setSuccessMessage).toHaveBeenCalledWith(
      'Письмо с кодом подтверждения было отправлено на вашу почту',
    );
  });

  it('should handle conflict exception', async () => {
    ($api.post as Mock).mockRejectedValue({
      response: { status: 409 },
    });
    (isAxiosError as unknown as Mock).mockReturnValue(true);

    const { result } = renderHookWithQueryClient(() =>
      useRegister(mockForm, setSuccessMessage),
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: 'existing@test.com',
          password: 'password',
        });
      } catch (e) {}
    });

    expect(mockForm.setError).toHaveBeenCalledWith('root', {
      message: 'Такой пользователь уже существует',
      type: 'custom',
    });
  });

  it('should handle other exceptions', async () => {
    ($api.post as Mock).mockRejectedValue(new Error('Some error'));
    (isAxiosError as unknown as Mock).mockReturnValue(true);

    const { result } = renderHookWithQueryClient(() =>
      useRegister(mockForm, setSuccessMessage),
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: 'test@test.com',
          password: 'password',
        });
      } catch (e) {}
    });

    expect(mockForm.setError).toHaveBeenCalledWith('root', {
      message: 'Что то пошло не так, попробуйте еще раз',
      type: 'custom',
    });
  });
});
