import { QueryProvider } from '@/config/providers';
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
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
