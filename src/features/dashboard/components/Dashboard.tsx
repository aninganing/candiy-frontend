'use client';

import Link from 'next/link';
import { Header } from '@/shared/components/layout/Header';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Spinner } from '@/shared/components/feedback/Spinner';
import { useCheckupData } from '@/features/checkups/hooks/useCheckupData';
import { toGaugeMetrics } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { toTrendMetrics } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { toLipidPanel } from '@/features/dashboard/mappers/lipidPanel.mapper';
import { PatientSummaryCard } from './PatientSummaryCard';
import { MetricGaugeGrid } from './MetricGaugeGrid';
import { MetricTrendList } from './MetricTrendList';
import { LipidPanelChart } from './LipidPanelChart';
import type { CheckupData, CheckupOverview } from '@/features/checkups/types/checkup.types';

function getLatestOverview(data: CheckupData): CheckupOverview | undefined {
  return [...data.overviews].sort((a, b) => a.checkupDate.localeCompare(b.checkupDate)).at(-1);
}

const START_CHECKUP_LINK = (
  <Link href="/checkups" className="text-primary text-sm font-semibold hover:underline">
    건강검진 조회하기
  </Link>
);

export function Dashboard() {
  const { data, isRestoring } = useCheckupData();
  const latestOverview = data ? getLatestOverview(data) : undefined;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="건강검진 대시보드" />
      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-10">
        {isRestoring ? (
          <Spinner size="lg" label="검진 결과 불러오는 중" />
        ) : data && latestOverview ? (
          <>
            <PatientSummaryCard patientName={data.patientName} overview={latestOverview} />
            <MetricGaugeGrid metrics={toGaugeMetrics(latestOverview, data.references)} />
            <MetricTrendList metrics={toTrendMetrics(data)} />
            <LipidPanelChart data={toLipidPanel(data)} />
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
