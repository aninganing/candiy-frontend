'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Spinner } from '@/shared/components/feedback/Spinner';
import { Button } from '@/shared/components/ui/Button';
import { useCheckupData } from '@/features/checkups/hooks/useCheckupData';
import { useResetCheckup } from '@/features/checkups/hooks/useResetCheckup';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { toGaugeMetrics } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { toTrendMetrics } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { toLipidPanel } from '@/features/dashboard/mappers/lipidPanel.mapper';
import { ROUTES } from '@/config/site';
import { RecentCheckupSummary } from './RecentCheckupSummary';
import { CheckupRecordList } from './CheckupRecordList';
import { LipidPanelChart } from './LipidPanelChart';
import { HistoryPanel } from './HistoryPanel';
import type { CheckupData, CheckupOverview } from '@/features/checkups/types/checkup.types';

function getLatestOverview(data: CheckupData): CheckupOverview | undefined {
  return [...data.overviews].sort((a, b) => a.checkupDate.localeCompare(b.checkupDate)).at(-1);
}

const START_CHECKUP_LINK = (
  <Link href={ROUTES.checkups} className="text-primary text-sm font-semibold hover:underline">
    건강검진 조회하기
  </Link>
);

export function Dashboard() {
  const { data, isRestoring } = useCheckupData();
  const latestOverview = data ? getLatestOverview(data) : undefined;
  const resetCheckup = useResetCheckup();
  const user = useAuthStore((state) => state.user);
  const handleLogout = useLogout();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header
        title="건강검진 대시보드"
        actions={
          <>
            <Button
              variant="ghost-outline"
              size="md"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={resetCheckup}
              aria-label="다시 검사하기"
            >
              <span className="hidden sm:inline">다시 검사하기</span>
            </Button>
            <Button variant="ghost" size="md" onClick={handleLogout}>
              로그아웃
            </Button>
          </>
        }
      />
      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-10">
        {user && (
          <p className="text-foreground w-full max-w-3xl text-lg font-bold">
            {user.name}님, 최근 건강검진 결과입니다
          </p>
        )}
        {isRestoring ? (
          <Spinner size="lg" label="검진 결과 불러오는 중" />
        ) : data && latestOverview ? (
          <>
            <RecentCheckupSummary
              patientName={data.patientName}
              overview={latestOverview}
              gaugeMetrics={toGaugeMetrics(latestOverview, data.references)}
              trendMetrics={toTrendMetrics(data)}
            />
            <CheckupRecordList records={data.records} />
            <LipidPanelChart data={toLipidPanel(data)} />
            <HistoryPanel overviews={data.overviews} references={data.references} />
          </>
        ) : (
          <EmptyState
            title="아직 조회된 검진 결과가 없습니다"
            description="본인인증을 통해 건강검진 결과를 조회하면 이 화면에서 확인할 수 있어요. 브라우저 탭을 닫거나 시간이 지나면 다시 조회가 필요합니다."
            action={START_CHECKUP_LINK}
          />
        )}
      </main>
    </div>
  );
}
