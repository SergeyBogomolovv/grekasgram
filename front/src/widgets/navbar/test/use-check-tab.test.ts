import { Mock } from 'vitest';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCheckTab } from '../hooks/use-check-tab';
import { renderHook } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('useCheckTab', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePathname as Mock).mockReturnValue('/current-path');
    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
  });

  it('should set default tab if current tab is invalid', () => {
    mockSearchParams.get = vi.fn().mockReturnValue('invalid-tab');

    renderHook(() => useCheckTab());

    expect(mockRouter.push).toHaveBeenCalledWith('/current-path?tab=chats');
  });

  it('should not change the tab if it is valid', () => {
    mockSearchParams.get = vi.fn().mockReturnValue('chats');

    renderHook(() => useCheckTab());

    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
