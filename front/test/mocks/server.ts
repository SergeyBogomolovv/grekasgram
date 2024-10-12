import { setupServer } from 'msw/node';
import { userHandlers } from './users';
import { authHandlers } from './auth';

export const server = setupServer(...userHandlers, ...authHandlers);
