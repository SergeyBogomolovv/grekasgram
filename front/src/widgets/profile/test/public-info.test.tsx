import { renderComponentWithQueryClient } from '@test/render-component-with-query';
import PublicInfo from '../ui/public-info';
import { User } from '@/entities/user';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { useUpdateProfile } from '../hooks/use-update-profile';
import { Mock } from 'vitest';

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

vi.mock('../hooks/use-update-profile', () => ({
  useUpdateProfile: vi.fn(),
}));

vi.mock('@/shared/config/api', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    post: vi.fn(),
  };
});

describe('PublicInfo', () => {
  it('should render correctly', () => {
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    renderComponentWithQueryClient(<PublicInfo user={mockUser} />);
    expect(screen.getByDisplayValue('test-username')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-about')).toBeInTheDocument();
  });

  it('should call mutate', async () => {
    const mockMutate = vi.fn();
    (useUpdateProfile as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    renderComponentWithQueryClient(<PublicInfo user={mockUser} />);
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
    renderComponentWithQueryClient(<PublicInfo user={mockUser} />);
    expect(screen.getByTestId('save-profile-button')).toBeDisabled();
  });
});
