import { setupServer } from 'msw/node';
import { checkupHandlers } from '@/shared/mocks/handlers/checkup.handlers';

export const server = setupServer(...checkupHandlers);
