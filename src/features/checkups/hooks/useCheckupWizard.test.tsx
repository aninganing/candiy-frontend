import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CheckupRequestInput } from '@/features/checkups/types/checkup.types';
import { useCheckupWizard } from './useCheckupWizard';

afterEach(() => {
  useCheckupWizardStore.setState({ state: { step: 'idle' } });
});

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
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { Wrapper, queryClient };
}

describe('useCheckupWizard', () => {
  it('idle → form → pending(AE-003 재시도) → success 순서로 전환되고, 결과는 쿼리 캐시에 저장된다', async () => {
    const { Wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useCheckupWizard(), { wrapper: Wrapper });

    expect(result.current.state.step).toBe('idle');

    act(() => result.current.start());
    expect(result.current.state.step).toBe('form');

    await act(async () => {
      await result.current.submitPersonalInfo(sampleInput);
    });
    expect(result.current.state.step).toBe('pending');

    await act(async () => {
      await result.current.confirmAuthentication();
    });
    expect(result.current.state.step).toBe('pending');
    expect(result.current.verifyError).toMatchObject({ code: 'AE-003' });

    await act(async () => {
      await result.current.confirmAuthentication();
    });
    expect(result.current.state).toMatchObject({ step: 'success' });
    expect(queryClient.getQueryData(queryKeys.checkups.detail())).toMatchObject({
      patientName: '홍길동',
    });
  });

  it('reset()으로 언제든 idle로 되돌아간다', async () => {
    const { result } = renderHook(() => useCheckupWizard(), { wrapper: createWrapper().Wrapper });

    act(() => result.current.start());
    await act(async () => {
      await result.current.submitPersonalInfo(sampleInput);
    });
    expect(result.current.state.step).toBe('pending');

    act(() => result.current.reset());
    expect(result.current.state.step).toBe('idle');
  });
});
