'use client';

import Link from 'next/link';
import { Card } from '@/shared/components/ui/Card';
import { Header } from '@/shared/components/layout/Header';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useCheckupDetail } from '@/features/checkups/hooks/useCheckupDetail';

export interface CheckupDetailProps {
  id: string;
}

const BACK_TO_CHECKUPS_LINK = (
  <Link href="/checkups" className="text-primary text-sm font-semibold hover:underline">
    건강검진 조회로 돌아가기
  </Link>
);

export function CheckupDetail({ id }: CheckupDetailProps) {
  const { data, selectedOverview } = useCheckupDetail(id);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="검진 결과 상세" />
      <main className="flex flex-1 flex-col items-center px-6 py-10">
        {selectedOverview ? (
          <Card padding="lg" className="flex w-full max-w-lg flex-col gap-3">
            <span className="text-foreground-subtle text-xs">검진일</span>
            <h1 className="text-foreground text-lg font-bold tracking-tight">{id}</h1>
            <p className="text-foreground-muted text-sm leading-relaxed">
              {data?.patientName}님의 검진 개요·상세 항목·과거 이력 화면은 준비 중입니다.
            </p>
            {BACK_TO_CHECKUPS_LINK}
          </Card>
        ) : (
          <EmptyState
            title="조회된 검진 데이터가 없습니다"
            description="본인인증이 필요한 데이터라 새로고침하면 사라집니다. 건강검진 조회를 다시 진행해주세요."
            action={BACK_TO_CHECKUPS_LINK}
          />
        )}
      </main>
    </div>
  );
}
