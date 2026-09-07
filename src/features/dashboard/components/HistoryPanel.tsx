'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { SelectableChip } from '@/shared/components/ui/SelectableChip';
import { GaugeRangeChart } from '@/shared/components/charts/GaugeRangeChart';
import { useDragScroll } from '@/shared/hooks/useDragScroll';
import { cn } from '@/shared/lib/cn';
import {
  toHistorySections,
  type HistoryRow,
} from '@/features/dashboard/mappers/historyDetail.mapper';
import type { CheckupOverview, CheckupReference } from '@/features/checkups/types/checkup.types';

export interface HistoryPanelProps {
  overviews: CheckupOverview[];
  references: CheckupReference[];
}

const STATUS_BADGE_LABEL: Record<'warning' | 'danger', string> = {
  warning: '주의',
  danger: '위험',
};

// 화면 크기와 무관하게 라벨·값을 한 줄로, 게이지를 그 아래 전체 너비로 쌓는다 — 참고치·값·뱃지까지
// 한 줄에 다 넣으면 라벨+게이지 고정폭만으로도 자리가 안 남는 경우가 있어, 항상 이 2행 레이아웃을 쓴다.
function HistoryRowItem({ row }: { row: HistoryRow }) {
  return (
    <li className="border-border flex flex-col gap-2 border-b py-3 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground-muted shrink-0 text-sm">{row.label}</span>
        <div className="flex min-w-0 shrink items-center justify-end gap-2">
          {row.reference && (
            <span className="text-foreground-subtle truncate text-xs whitespace-nowrap">
              참고치 {row.reference}
            </span>
          )}
          <span className="text-foreground shrink-0 text-sm font-semibold whitespace-nowrap">
            {row.value}
          </span>
          {(row.status === 'warning' || row.status === 'danger') && (
            <Badge tone={row.status} size="sm" className="shrink-0">
              {STATUS_BADGE_LABEL[row.status]}
            </Badge>
          )}
        </div>
      </div>
      {row.gauge && (
        <GaugeRangeChart
          {...row.gauge}
          status={row.status ?? 'normal'}
          className="w-full shrink-0"
          animate
        />
      )}
    </li>
  );
}

export function HistoryPanel({ overviews, references }: HistoryPanelProps) {
  const sorted = [...overviews].sort((a, b) => b.checkupDate.localeCompare(a.checkupDate));
  const [selectedDate, setSelectedDate] = useState(sorted[0]?.checkupDate);
  const [expanded, setExpanded] = useState(true);
  const {
    ref: dragScrollRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
  } = useDragScroll<HTMLDivElement>();
  const selectedOverview =
    sorted.find((overview) => overview.checkupDate === selectedDate) ?? sorted[0];

  if (!selectedOverview) return null;

  const sections = toHistorySections(selectedOverview, references);

  return (
    <Card padding="lg" className="w-full max-w-3xl">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <h2 className="text-foreground text-sm font-bold">전체 검진 이력</h2>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'text-foreground-muted h-4.5 w-4.5 shrink-0 transition-transform',
            expanded && 'rotate-180',
          )}
        />
      </button>
      {expanded && (
        <>
          <p className="text-foreground-subtle mt-1 mb-4 text-xs">
            검진일을 선택하면 해당 회차의 전체 항목을 볼 수 있어요
          </p>
          <div
            ref={dragScrollRef}
            className="mb-6 flex cursor-grab gap-2 overflow-x-auto select-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClickCapture={onClickCapture}
          >
            {sorted.map((overview) => (
              <SelectableChip
                key={overview.checkupDate}
                size="sm"
                selected={overview.checkupDate === selectedOverview.checkupDate}
                onClick={() => setSelectedDate(overview.checkupDate)}
              >
                {overview.checkupDate}
              </SelectableChip>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-foreground mb-2 text-sm font-bold">{section.title}</h3>
                <ul>
                  {section.rows.map((row) => (
                    <HistoryRowItem key={row.label} row={row} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
