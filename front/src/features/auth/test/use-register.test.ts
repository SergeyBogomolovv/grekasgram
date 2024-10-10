import { act } from '@testing-library/react';
import { Mock, vi, expect, describe, it, beforeEach } from 'vitest';
import { useForm } from 'react-hook-form';
import { $api } from '@/shared/api';
import { isAxiosError } from 'axios';
import { useRegister } from '../api/use-register';
import { renderHookWithQueryClient } from '@test/render-hook-with-query';

vi.mock('axios', { spy: true });

vi.mock('@/shared/api');

const mockReset = vi.fn();
const mockSetError = vi.fn();
const setSuccessMessage = vi.fn();

vi.mock('react-hook-form', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    useForm: vi.fn(() => ({
      reset: mockReset,
      setError: mockSetError,
    })),
  };
});

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send data and setSuccessMessage', async () => {
    const mockResponse = { message: 'Успех' };
    ($api.post as Mock).mockResolvedValue({ data: mockResponse });

    const { result } = renderHookWithQueryClient(() =>
      useRegister(useForm(), setSuccessMessage),
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

    expect(mockReset).toHaveBeenCalled();
    expect(setSuccessMessage).toHaveBeenCalledWith(
      'Код подтверждения отправлен на вашу почту',
    );
  });

  it('should handle conflict exception', async () => {
    ($api.post as Mock).mockRejectedValue({
      response: { status: 409 },
    });
    (isAxiosError as unknown as Mock).mockReturnValue(true);

    const { result } = renderHookWithQueryClient(() =>
      useRegister(useForm(), setSuccessMessage),
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: 'existing@test.com',
          password: 'password',
        });
      } catch (e) {}
    });

    expect(mockSetError).toHaveBeenCalledWith('root', {
      message: 'Такой пользователь уже существует',
      type: 'custom',
    });
  });

  it('should handle other exceptions', async () => {
    ($api.post as Mock).mockRejectedValue(new Error('Some error'));
    (isAxiosError as unknown as Mock).mockReturnValue(true);

    const { result } = renderHookWithQueryClient(() =>
      useRegister(useForm(), setSuccessMessage),
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: 'test@test.com',
          password: 'password',
        });
      } catch (e) {}
    });

    expect(mockSetError).toHaveBeenCalledWith('root', {
      message: 'Что то пошло не так, попробуйте еще раз',
      type: 'custom',
    });
  });
});
