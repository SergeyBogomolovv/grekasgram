import { render, screen, fireEvent, act } from '@testing-library/react';
import { Mock } from 'vitest';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import SearchInput from '../ui/search-input';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

describe('SearchInput', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockSearchParams = new URLSearchParams();

  const mockPathname = '/chats';

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as Mock).mockReturnValue(mockRouter);

    (useSearchParams as Mock).mockReturnValue(mockSearchParams);

    (usePathname as Mock).mockReturnValue(mockPathname);
  });

  it('should render with default query value from searchParams', () => {
    mockSearchParams.set('query', 'test-query');

    render(<SearchInput currentTab="chats" />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test-query');
  });

  it('should update searchParams and call router.push on form submit', async () => {
    mockSearchParams.delete('query');

    render(<SearchInput currentTab="chats" />);

    const input = screen.getByTestId('search-input');
    const form = screen.getByTestId('search-form');

    fireEvent.change(input, { target: { value: 'new-query' } });

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/chats?query=new-query');
  });

  it('should remove query param if input is cleared and form is submitted', async () => {
    mockSearchParams.set('query', 'existing-query');

    render(<SearchInput currentTab="chats" />);

    const input = screen.getByTestId('search-input');
    const form = screen.getByTestId('search-form');

    fireEvent.change(input, { target: { value: '' } });

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/chats');
  });
});
