import { HttpResponse, http } from 'msw';
import type { CheckupVerifyRequestDto } from '@/features/checkups/api/checkup.dto';
import { createCheckupMockResponder } from '@/shared/mocks/checkupMockResponder';

const checkupMockResponder = createCheckupMockResponder();

export function resetCheckupMockState() {
  checkupMockResponder.reset();
}

export const checkupHandlers = [
  http.post('/api/checkups', async ({ request }) => {
    const body = (await request.json()) as Partial<CheckupVerifyRequestDto>;
    const { status, body: responseBody } = checkupMockResponder.resolve(body);
    return HttpResponse.json(responseBody, { status });
  }),
];
