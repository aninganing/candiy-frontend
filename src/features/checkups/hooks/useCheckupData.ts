'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CheckupData } from '@/features/checkups/types/checkup.types';

// CheckupData는 본인인증 플로우(useVerifyCheckup)를 거쳐야만 채워지는 세션성 데이터라 여기서 직접 fetch하지 않는다.
// 캐시에 값이 없으면(새로고침 등) undefined — 호출부가 빈 상태를 처리한다.
export function useCheckupData(): CheckupData | undefined {
  const { data } = useQuery<CheckupData>({
    queryKey: queryKeys.checkups.detail(),
    queryFn: skipToken,
    staleTime: Infinity,
  });

  return data;
}
