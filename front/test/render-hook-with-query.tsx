import queryClient from '@/shared/config/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

export const renderHookWithQueryClient = (hook: () => any) => {
  return renderHook(hook, {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};
