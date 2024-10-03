import queryClient from '@/shared/config/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export function renderComponentWithQueryClient(children: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  );
}
