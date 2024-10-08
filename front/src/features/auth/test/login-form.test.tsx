import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import LoginForm from '../ui/login-form';
import { useLogin } from '../api/use-login';

vi.mock('../api/use-login', () => ({
  useLogin: vi.fn(),
}));

describe('LoginForm', () => {
  it('should render correctly', () => {
    (useLogin as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(<LoginForm />);

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('should call mutate', async () => {
    const mockMutate = vi.fn();
    (useLogin as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('should be disabled', () => {
    (useLogin as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    expect(button).toBeDisabled();
  });
});
