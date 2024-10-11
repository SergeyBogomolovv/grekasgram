import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { renderHook } from '@testing-library/react';
import { useCheckTab } from '../model/use-check-tab';

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal()),
  useRouter: vi.fn(),
  usePathname: vi.fn(() => '/current-path'),
  useSearchParams: vi.fn(),
}));

describe('useCheckTab', () => {
  const mockPush = vi.fn();
  const mockSearchParams = new ReadonlyURLSearchParams();

  beforeEach(() => {
    vi.mocked(useRouter, { partial: true }).mockReturnValue({ push: mockPush });
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set default tab if current tab is invalid', () => {
    mockSearchParams.get = vi.fn().mockReturnValue('invalid-tab');

    renderHook(() => useCheckTab());

    expect(mockPush).toHaveBeenCalledWith('/current-path?tab=chats');
  });

  it('should not change the tab if it is valid', () => {
    mockSearchParams.get = vi.fn().mockReturnValue('chats');

    renderHook(() => useCheckTab());

    expect(mockPush).not.toHaveBeenCalled();
  });
});
