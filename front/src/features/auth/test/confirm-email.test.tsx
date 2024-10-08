import { Mock, it, describe, vi } from 'vitest';
import { useConfirmEmail } from '../api/use-confirm-email';
import { useSearchParams } from 'next/navigation';
import { render, screen } from '@testing-library/react';
import ConfirmEmail from '../ui/confirm-email';

vi.mock('../api/use-confirm-email', () => ({
  useConfirmEmail: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

describe('ConfirmEmail', () => {
  it('should call mutate with correct token', () => {
    const mockGet = vi.fn();
    mockGet.mockReturnValue('test-token');

    const mockMutate = vi.fn();

    (useConfirmEmail as Mock).mockReturnValue({ mutate: mockMutate });
    (useSearchParams as Mock).mockReturnValue({ get: mockGet });

    render(<ConfirmEmail />);

    expect(mockGet).toHaveBeenCalledWith('token');
    expect(mockMutate).toHaveBeenCalledWith('test-token');
  });

  it('should not call mutate if no token', () => {
    const mockGet = vi.fn();
    mockGet.mockReturnValue(null);

    const mockMutate = vi.fn();

    (useConfirmEmail as Mock).mockReturnValue({ mutate: mockMutate });
    (useSearchParams as Mock).mockReturnValue({ get: mockGet });

    render(<ConfirmEmail />);

    expect(mockGet).toHaveBeenCalledWith('token');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should render loading state', () => {
    (useConfirmEmail as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    render(<ConfirmEmail />);

    expect(screen.queryByText('Почта подтверждена')).not.toBeInTheDocument();
    expect(screen.queryByText('Произошла ошибка')).not.toBeInTheDocument();
    expect(screen.getByText('Проверяем вашу почту')).toBeInTheDocument();
  });

  it('should render success state', () => {
    (useConfirmEmail as Mock).mockReturnValue({
      mutate: vi.fn(),
      isSuccess: true,
    });

    render(<ConfirmEmail />);

    expect(screen.queryByText('Проверяем вашу почту')).not.toBeInTheDocument();
    expect(screen.queryByText('Произошла ошибка')).not.toBeInTheDocument();
    expect(screen.getByText('Почта подтверждена')).toBeInTheDocument();
  });

  it('should render error state', () => {
    (useConfirmEmail as Mock).mockReturnValue({
      mutate: vi.fn(),
      isError: true,
    });

    render(<ConfirmEmail />);

    expect(screen.queryByText('Проверяем вашу почту')).not.toBeInTheDocument();
    expect(screen.queryByText('Почта подтверждена')).not.toBeInTheDocument();
    expect(screen.getByText('Произошла ошибка')).toBeInTheDocument();
  });
});
