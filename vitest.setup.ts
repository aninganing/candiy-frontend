import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetCheckupMockState } from '@/shared/mocks/handlers/checkup.handlers';
import { server } from '@/shared/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetCheckupMockState();
});
afterAll(() => server.close());
