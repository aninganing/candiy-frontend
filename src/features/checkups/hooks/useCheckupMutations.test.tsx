import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CheckupRequestInput } from '@/features/checkups/types/checkup.types';
import { useInitiateCheckup, useVerifyCheckup } from './useCheckupMutations';

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

function createWrapper() {
  const queryClient = new QueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useInitiateCheckup', () => {
  it('1차 요청을 보내고 challenge를 반환한다', async () => {
    const { result } = renderHook(() => useInitiateCheckup(), { wrapper: createWrapper() });

    const challenge = await result.current.mutateAsync({ input: sampleInput, id: 'test-id' });

    expect(challenge.transactionId).toBe('mock-transaction-id');
  });
});

describe('useVerifyCheckup', () => {
  it('첫 시도는 AE-003으로 실패하고, 같은 challenge로 재시도하면 성공한다', async () => {
    const { result: initiate } = renderHook(() => useInitiateCheckup(), {
      wrapper: createWrapper(),
    });
    const challenge = await initiate.current.mutateAsync({ input: sampleInput, id: 'test-id' });

    const { result: verify } = renderHook(() => useVerifyCheckup(), { wrapper: createWrapper() });

    await expect(
      verify.current.mutateAsync({ input: sampleInput, id: 'test-id', challenge }),
    ).rejects.toMatchObject({ code: 'AE-003' });

    const data = await verify.current.mutateAsync({ input: sampleInput, id: 'test-id', challenge });

    expect(data.patientName).toBe('홍길동');
  });
});
