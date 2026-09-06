'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';

// 위저드 단계뿐 아니라 캐시된 CheckupData도 지워야 /checkups에서 CheckupIntro부터 다시 시작한다.
export function useResetCheckup() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = useCheckupWizardStore((store) => store.reset);

  return useCallback(() => {
    queryClient.removeQueries({ queryKey: queryKeys.checkups.data() });
    reset();
    router.push('/checkups');
  }, [queryClient, reset, router]);
}
