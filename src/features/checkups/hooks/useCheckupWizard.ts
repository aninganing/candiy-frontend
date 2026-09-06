'use client';

import { useCallback } from 'react';
import { useInitiateCheckup, useVerifyCheckup } from '@/features/checkups/hooks/useCheckupMutations';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';
import type { CheckupRequestInput } from '@/features/checkups/types/checkup.types';

export function useCheckupWizard() {
  const state = useCheckupWizardStore((store) => store.state);
  const start = useCheckupWizardStore((store) => store.start);
  const reset = useCheckupWizardStore((store) => store.reset);
  const setChallenge = useCheckupWizardStore((store) => store.setChallenge);
  const setVerified = useCheckupWizardStore((store) => store.setVerified);
  const initiate = useInitiateCheckup();
  const verify = useVerifyCheckup();

  const submitPersonalInfo = useCallback(
    async (input: CheckupRequestInput) => {
      const id = crypto.randomUUID();
      try {
        const challenge = await initiate.mutateAsync({ input, id });
        setChallenge(input, id, challenge);
      } catch {
        // initiate.error가 UI에 노출되므로 여기서는 흐름만 멈춘다.
      }
    },
    [initiate, setChallenge],
  );

  const confirmAuthentication = useCallback(async () => {
    if (state.step !== 'pending') return;
    try {
      const data = await verify.mutateAsync({
        input: state.input,
        id: state.id,
        challenge: state.challenge,
      });
      setVerified(data);
    } catch {
      // verify.error가 UI에 노출되므로 'pending'에 머물러 재시도할 수 있게 둔다.
    }
  }, [state, verify, setVerified]);

  return {
    state,
    start,
    reset,
    submitPersonalInfo,
    confirmAuthentication,
    isSubmitting: initiate.isPending,
    submitError: initiate.error,
    isVerifying: verify.isPending,
    verifyError: verify.error,
  };
}
