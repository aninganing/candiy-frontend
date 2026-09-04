import { setupWorker } from 'msw/browser';
import { checkupHandlers } from '@/shared/mocks/handlers/checkup.handlers';

export const worker = setupWorker(...checkupHandlers);
