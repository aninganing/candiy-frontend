import Link from 'next/link';
import { Card } from '@/shared/components/ui/Card';
import { Header } from '@/shared/components/layout/Header';

export interface CheckupDetailProps {
  id: string;
}

export function CheckupDetail({ id }: CheckupDetailProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="검진 결과 상세" />
      <main className="flex flex-1 flex-col items-center px-6 py-10">
        <Card padding="lg" className="flex w-full max-w-lg flex-col gap-3">
          <span className="text-foreground-subtle text-xs">검진일</span>
          <h1 className="text-foreground text-lg font-bold tracking-tight">{id}</h1>
          <p className="text-foreground-muted text-sm leading-relaxed">
            검진 개요·상세 항목·과거 이력 화면은 준비 중입니다.
          </p>
          <Link
            href="/checkups"
            className="text-primary mt-2 text-sm font-semibold hover:underline"
          >
            건강검진 조회로 돌아가기
          </Link>
        </Card>
      </main>
    </div>
  );
}
