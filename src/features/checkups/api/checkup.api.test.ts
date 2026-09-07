import { describe, expect, it } from 'vitest';
import { ApiError } from '@/shared/api/errors';
import type { CheckupRequestInput } from '@/features/checkups/types/checkup.types';
import { initiateCheckup, verifyCheckup } from './checkup.api';

const sampleInput: CheckupRequestInput = {
  legalName: '홍길동',
  birthdate: '19900101',
  phoneNo: '01012345678',
  telecom: 0,
  loginTypeLevel: 1,
  startDate: '2020',
  endDate: '2024',
  inquiryType: 0,
};

describe('checkup.api (MSW mock)', () => {
  it('1차 요청 → 2차 요청 첫 시도(AE-003) → 재시도 성공 순서로 진행된다', async () => {
    const id = 'test-session-id';

    const challenge = await initiateCheckup(sampleInput, id);
    expect(challenge.transactionId).toBe('mock-transaction-id');

    const firstAttemptError: unknown = await verifyCheckup(sampleInput, id, challenge).catch(
      (e: unknown) => e,
    );
    expect(firstAttemptError).toBeInstanceOf(ApiError);
    if (!(firstAttemptError instanceof ApiError)) throw firstAttemptError;
    expect(firstAttemptError.code).toBe('AE-003');

    const result = await verifyCheckup(sampleInput, id, challenge);
    expect(result.patientName).toBe('홍길동');
    expect(result.overviews).toHaveLength(2);
    expect(result.overviews[0].waist).toBe('82');
    expect(result.records).toHaveLength(2);
  });
});
