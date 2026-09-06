'use client';

import { useCheckupData } from '@/features/checkups/hooks/useCheckupData';
import type { CheckupData, CheckupOverview } from '@/features/checkups/types/checkup.types';

export interface UseCheckupDetailResult {
  data: CheckupData | undefined;
  selectedOverview: CheckupOverview | undefined;
}

// checkupDate(라우트의 [id])에 해당하는 검진 회차를 캐시된 CheckupData에서 찾는다.
export function useCheckupDetail(checkupDate: string): UseCheckupDetailResult {
  const data = useCheckupData();
  const selectedOverview = data?.overviews.find((overview) => overview.checkupDate === checkupDate);

  return { data, selectedOverview };
}
