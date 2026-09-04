import { HttpResponse, http } from 'msw';
import type { CheckupVerifyRequestDto } from '@/features/checkups/api/checkup.dto';
import { checkupChallengeFixture, checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';

// transactionId별 2차 요청 시도 횟수. 첫 시도는 AE-003(본인인증 미완료)로 응답해
// "인증 완료" 버튼 재시도 UX를 mock 환경에서도 확인할 수 있게 한다.
const verifyAttempts = new Map<string, number>();

export function resetCheckupMockState() {
  verifyAttempts.clear();
}

export const checkupHandlers = [
  http.post('/api/checkups', async ({ request }) => {
    const body = (await request.json()) as Partial<CheckupVerifyRequestDto>;

    if (!body.multiFactorInfo) {
      return HttpResponse.json({ status: 'success', data: checkupChallengeFixture });
    }

    const { transactionId } = body.multiFactorInfo;
    const attempts = (verifyAttempts.get(transactionId) ?? 0) + 1;
    verifyAttempts.set(transactionId, attempts);

    if (attempts === 1) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '본인인증 절차가 완료되지 않았습니다. 먼저 본인인증을 완료해주세요.',
          code: 'AE-003',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({ status: 'success', data: checkupDataFixture });
  }),
];
