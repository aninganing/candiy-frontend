'use client';

import { useMutation } from '@tanstack/react-query';
import { initiateCheckup, verifyCheckup } from '@/features/checkups/api/checkup.api';
import type {
  CheckupChallenge,
  CheckupRequestInput,
} from '@/features/checkups/types/checkup.types';

export function useInitiateCheckup() {
  return useMutation({
    mutationFn: ({ input, id }: { input: CheckupRequestInput; id: string }) =>
      initiateCheckup(input, id),
  });
}

export function useVerifyCheckup() {
  return useMutation({
    mutationFn: ({
      input,
      id,
      challenge,
    }: {
      input: CheckupRequestInput;
      id: string;
      challenge: CheckupChallenge;
    }) => verifyCheckup(input, id, challenge),
  });
}
