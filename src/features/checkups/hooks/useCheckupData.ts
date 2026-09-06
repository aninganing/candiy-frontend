'use client';

import { skipToken, useIsRestoring, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CheckupData } from '@/features/checkups/types/checkup.types';

export interface UseCheckupDataResult {
  data: CheckupData | undefined;
  isRestoring: boolean;
}

// CheckupData는 본인인증 플로우(useVerifyCheckup)를 거쳐야만 채워지는 세션성 데이터라 여기서 직접 fetch하지 않는다.
// 캐시에 값이 없으면(새로고침 등) undefined — 호출부가 빈 상태를 처리한다.
// isRestoring이 true인 동안은 sessionStorage에서 캐시를 복원하는 중이라, 데이터가 없는 것과 구분해야 한다.
export function useCheckupData(): UseCheckupDataResult {
  const { data } = useQuery<CheckupData>({
    queryKey: queryKeys.checkups.data(),
    queryFn: skipToken,
    staleTime: Infinity,
    meta: { persist: true },
  });
  const isRestoring = useIsRestoring();

  return { data, isRestoring };
}
