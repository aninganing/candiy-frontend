import { Card } from '@/shared/components/ui/Card';
import type { CheckupRecord } from '@/features/checkups/types/checkup.types';

export interface CheckupRecordListProps {
  records: CheckupRecord[];
}

// overviews(검진 수치 스냅샷)와 records(검진 방문 기록)는 개수가 다를 수 있어 독립적으로 다룬다.
export function CheckupRecordList({ records }: CheckupRecordListProps) {
  const sorted = [...records].sort((a, b) => b.checkupDate.localeCompare(a.checkupDate));

  return (
    <Card padding="lg" className="w-full max-w-lg">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-foreground text-sm font-bold">검진 기록</h2>
        <span className="text-foreground-muted text-xs">총 {records.length}건</span>
      </div>
      <ul className="flex flex-col">
        {sorted.map((record, index) => (
          <li
            key={`${record.checkupDate}-${index}`}
            className="border-border flex items-center justify-between gap-3 border-b py-3 last:border-0"
          >
            <span className="text-foreground text-sm font-semibold whitespace-nowrap">
              {record.checkupDate}
            </span>
            <span className="text-foreground-muted truncate text-xs">
              {record.organizationName}
            </span>
            <span className="text-foreground-subtle shrink-0 text-xs whitespace-nowrap">
              {record.checkupType}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
