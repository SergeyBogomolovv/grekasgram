import PublicInfo from '../ui/profile-form';
import { User } from '@/entities/user';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { useUpdateProfile } from '@/entities/user';
import { Mock } from 'vitest';
import { render } from '@testing-library/react';

const mockUser: User = {
  id: 'test-id',
  email: 'test-email',
  createdAt: '123',
  online: true,
  lastOnlineAt: '123',
  username: 'test-username',
  about: 'test-about',
  avatarUrl: 'test-avatar-url',
};

vi.mock('@/entities/user');

describe('PublicInfo', () => {
  it('should render correctly', () => {
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    render(<PublicInfo user={mockUser} />);
    expect(screen.getByDisplayValue('test-username')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-about')).toBeInTheDocument();
  });

  it('should call mutate', async () => {
    const mockMutate = vi.fn();
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    render(<PublicInfo user={mockUser} />);
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'new-username' },
    });
    fireEvent.change(screen.getByTestId('about-info-input'), {
      target: { value: 'new-about' },
    });
    fireEvent.click(screen.getByTestId('save-profile-button'));
    await waitFor(() =>
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'new-username',
        about: 'new-about',
      }),
    );
  });

  it('should be disabled', async () => {
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });
    render(<PublicInfo user={mockUser} />);
    expect(screen.getByTestId('save-profile-button')).toBeDisabled();
  });
});
