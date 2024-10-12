import { QueryProvider } from '@/config/providers';
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';
import { queryClient } from '@/shared/api';

expect.extend(matchers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  queryClient.clear();
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

const customRender = (ui: React.ReactNode, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const customRenderHook = (
  render: (initialProps: unknown) => any,
  options?: RenderHookOptions<any>,
) =>
  renderHook(render, {
    wrapper: AllTheProviders,
    ...options,
  });

export * from '@testing-library/react';

export { customRender as render };
export { customRenderHook as renderHook };
