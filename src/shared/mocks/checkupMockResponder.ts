import type { CheckupVerifyRequestDto } from '@/features/checkups/api/checkup.dto';
import {
  checkupChallengeFixture,
  checkupDataFixture,
} from '@/shared/mocks/fixtures/checkup.fixtures';

export interface CheckupMockResponse {
  status: number;
  body: Record<string, unknown>;
}

// transactionId별 2차 요청 시도 횟수. 첫 시도는 AE-003(본인인증 미완료)으로 응답해
// "인증 완료" 버튼 재시도 UX를 mock 환경에서도 확인할 수 있게 한다.
// MSW handler와 Route Handler(mock 모드 안전장치)가 각자 인스턴스를 만들어 사용한다.
export function createCheckupMockResponder() {
  const verifyAttempts = new Map<string, number>();

  function resolve(body: Partial<CheckupVerifyRequestDto>): CheckupMockResponse {
    if (!body.multiFactorInfo) {
      return { status: 200, body: { status: 'success', data: checkupChallengeFixture } };
    }

    const { transactionId } = body.multiFactorInfo;
    const attempts = (verifyAttempts.get(transactionId) ?? 0) + 1;
    verifyAttempts.set(transactionId, attempts);

    if (attempts === 1) {
      return {
        status: 400,
        body: {
          status: 'error',
          message: '본인인증 절차가 완료되지 않았습니다. 먼저 본인인증을 완료해주세요.',
          code: 'AE-003',
        },
      };
    }

    return { status: 200, body: { status: 'success', data: checkupDataFixture } };
  }

  function reset() {
    verifyAttempts.clear();
  }

  return { resolve, reset };
}
