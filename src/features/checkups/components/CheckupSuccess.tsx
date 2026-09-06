import { CircleCheck } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import type { CheckupData } from '@/features/checkups/types/checkup.types';

export interface CheckupSuccessProps {
  data: CheckupData;
  onConfirm: () => void;
  onReset: () => void;
}

function getLatestCheckupDate(data: CheckupData): string {
  const dates = data.overviews.map((overview) => overview.checkupDate);
  if (dates.length === 0) return '-';
  return [...dates].sort().at(-1) ?? '-';
}

export function CheckupSuccess({ data, onConfirm, onReset }: CheckupSuccessProps) {
  return (
    <Card padding="lg" className="mx-auto flex max-w-sm flex-col items-center gap-5 text-center">
      <Badge shape="circle" tone="success" size="lg">
        <CircleCheck />
      </Badge>

      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-lg font-bold tracking-tight">
          {data.patientName}님의 건강검진 조회가
          <br />
          완료되었습니다
        </h1>
        <p className="text-foreground-muted text-sm leading-relaxed">
          최근 10년간의 건강검진 결과를 정상적으로 조회했어요.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2.5">
        <div className="rounded-control border-border flex flex-col gap-1 border p-4">
          <span className="text-foreground-subtle text-xs">조회된 검진</span>
          <span className="text-foreground text-lg font-bold">{data.records.length}건</span>
        </div>
        <div className="rounded-control border-border flex flex-col gap-1 border p-4">
          <span className="text-foreground-subtle text-xs">최근 검진일</span>
          <span className="text-foreground text-lg font-bold">{getLatestCheckupDate(data)}</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <Button size="lg" fullWidth onClick={onConfirm}>
          확인
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={onReset}>
          다시 조회하기
        </Button>
      </div>
    </Card>
  );
}
