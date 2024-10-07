import { fireEvent, render, screen } from '@testing-library/react';
import { Mock, describe, vi, it } from 'vitest';
import { useLogout } from '../hooks/use-logout';
import LogoutButton from '../ui/logout-button';
import { act } from 'react';

vi.mock('../hooks/use-logout', () => ({
  useLogout: vi.fn(),
}));

describe('LogoutButton', () => {
  it('should be disabled', () => {
    (useLogout as Mock).mockReturnValue({ mutate: vi.fn(), isPending: true });

    render(<LogoutButton>Выход</LogoutButton>);

    expect(screen.getByText('Выход')).toBeInTheDocument();
    expect(screen.getByText('Выход')).toBeDisabled();
  });

  it('should call mutate', async () => {
    const mockMutate = vi.fn();
    (useLogout as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<LogoutButton>Выход</LogoutButton>);

    await act(async () => {
      fireEvent.click(screen.getByText('Выход'));
    });

    expect(mockMutate).toHaveBeenCalled();
  });
});
