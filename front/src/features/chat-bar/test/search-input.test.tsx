import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import userEvent from '@testing-library/user-event';
import SearchInput from '../ui/search-input';

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal()),
  usePathname: vi.fn(() => '/current-path'),
  useSearchParams: vi.fn(() => new ReadonlyURLSearchParams()),
  useRouter: vi.fn(),
}));

describe('SearchInput', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter, { partial: true }).mockReturnValue({
      push: mockPush,
    });

    vi.mocked(usePathname).mockReturnValue('/current-path');
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
