import { render } from '@testing-library/react';
import { Mock, describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import SearchInput from '../ui/search-input';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/current-path'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(),
}));

describe('SearchInput', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should set query', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <SearchInput currentTab="chats" />,
    );
    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Поиск...'), 'test-query');
    await user.click(getByRole('button', { name: 'Поиск' }));

    expect(mockPush).toHaveBeenCalledWith('/current-path?query=test-query');
  });

  it('should remove query', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <SearchInput currentTab="chats" />,
    );
    const user = userEvent.setup();

    await user.clear(getByPlaceholderText('Поиск...'));
    await user.click(getByRole('button', { name: 'Поиск' }));

    expect(mockPush).toHaveBeenCalledWith('/current-path');
  });
});
