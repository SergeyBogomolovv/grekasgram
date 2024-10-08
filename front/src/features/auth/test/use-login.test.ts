import { act } from '@testing-library/react';
import { Mock } from 'vitest';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { $api } from '@/shared/api';
import { useLogin } from '../api/use-login';
import { renderHookWithQueryClient } from '@test/render-hook-with-query';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('@/shared/api', () => ({
  $api: { post: vi.fn() },
}));

describe('useLogin', () => {
  const mockForm: UseFormReturn<any> = {
    setError: vi.fn(),
  } as any;

  const mockRouter = {
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it('should call post with correct params', async () => {
    ($api.post as Mock).mockResolvedValue({});

    const { result } = renderHookWithQueryClient(() => useLogin(mockForm));

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect($api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: 'password',
    });
  });

  it('should call toast and refresh after succes login', async () => {
    ($api.post as Mock).mockResolvedValue({});

    const { result } = renderHookWithQueryClient(() => useLogin(mockForm));

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Вы успешно вошли в аккаунт');
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it('should set error after response error', async () => {
    ($api.post as Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHookWithQueryClient(() => useLogin(mockForm));

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: 'test@test.com',
          password: 'password',
        });
      } catch (e) {}
    });

    expect(mockForm.setError).toHaveBeenCalledWith('root', {
      message: 'Введенны неверные данные',
      type: 'custom',
    });
  });
});
