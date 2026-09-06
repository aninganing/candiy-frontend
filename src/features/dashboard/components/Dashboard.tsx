'use client';

import Link from 'next/link';
import { Card } from '@/shared/components/ui/Card';
import { Header } from '@/shared/components/layout/Header';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Spinner } from '@/shared/components/feedback/Spinner';
import { useCheckupData } from '@/features/checkups/hooks/useCheckupData';
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
      <main className="flex flex-1 flex-col items-center px-6 py-10">
        {isRestoring ? (
          <Spinner size="lg" label="검진 결과 불러오는 중" />
        ) : data && latestOverview ? (
          <Card padding="lg" className="flex w-full max-w-lg flex-col gap-3">
            <span className="text-foreground-subtle text-xs">최근 검진일</span>
            <h1 className="text-foreground text-lg font-bold tracking-tight">
              {latestOverview.checkupDate}
            </h1>
            <p className="text-foreground-muted text-sm leading-relaxed">
              {data.patientName}님의 검진 개요·상세 항목·과거 이력 화면은 준비 중입니다.
            </p>
          </Card>
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
