import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '../model/auth.store';

describe('useAuthStore', () => {
  it('should have initial accessToken equals to null', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.accessToken).toBeNull();
  });

  it('should set accessToken', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAccessToken('test-token');
    });

    expect(result.current.accessToken).toBe('test-token');
  });

  it('should set accessToken to null', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAccessToken('test-token');
    });
    expect(result.current.accessToken).toBe('test-token');

    act(() => {
      result.current.setAccessToken(null);
    });
    expect(result.current.accessToken).toBeNull();
  });
});
