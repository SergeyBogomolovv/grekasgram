import { render, waitFor } from '@test/utils';
import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest';
import UserButton from '../ui/user-button';
import { mockUsers } from '@test/mocks/users';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';

vi.mock('next/navigation');
vi.mock('@/entities/chat', async (importOriginal) => ({
  ...(await importOriginal()),
  useGetMyChats: vi.fn(() => ({
    data: [{ companion: { id: '1' }, id: 'my-chat-id' }],
  })),
}));

vi.mock('@/shared/api');

describe('UserButton', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter, { partial: true }).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to my chat', async () => {
    const { getByText } = render(<UserButton user={mockUsers[0]} />);
    const user = userEvent.setup();

    await user.click(getByText(mockUsers[0].username));

    expect($api.post).not.toHaveBeenCalled();

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/my-chat-id'));
  });

  it('should create new chat and redirect', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: { chatId: 'new-chat-id' } });

    const { getByText } = render(<UserButton user={mockUsers[1]} />);
    const user = userEvent.setup();

    await user.click(getByText(mockUsers[1].username));

    expect($api.post).toHaveBeenCalledWith('/chats/create', {
      companionId: mockUsers[1].id,
    });

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/new-chat-id'));
  });
});
