import { GaugeRangeChart } from '@/shared/components/charts/GaugeRangeChart';
import type { ChartStatus } from '@/shared/components/charts/chartTheme';
import type { GaugeMetric } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { cn } from '@/shared/lib/cn';

export interface MetricGaugeGridProps {
  metrics: GaugeMetric[];
}

const VALUE_COLOR: Record<ChartStatus, string> = {
  normal: 'text-foreground',
  warning: 'text-warning',
  danger: 'text-danger',
};

const STATUS_LEGEND: { status: ChartStatus; label: string; dotClassName: string }[] = [
  { status: 'normal', label: '정상', dotClassName: 'bg-foreground' },
  { status: 'warning', label: '주의', dotClassName: 'bg-warning' },
  { status: 'danger', label: '위험', dotClassName: 'bg-danger' },
];

export function MetricGaugeGrid({ metrics }: MetricGaugeGridProps) {
  if (metrics.length === 0) return null;

  return (
    <div>
      <h2 className="text-foreground mb-3 text-sm font-bold">주요 수치</h2>
      <ul className="border-border text-foreground-muted mb-4 flex gap-4 border-b pb-4 text-xs">
        {STATUS_LEGEND.map(({ status, label, dotClassName }) => (
          <li key={status} className="flex items-center gap-1.5">
            <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dotClassName)} />
            {label}
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-5">
        {metrics.map((metric) => (
          <li key={metric.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-foreground-muted text-xs">{metric.label}</span>
              <span className={cn('text-sm font-semibold', VALUE_COLOR[metric.status])}>
                {metric.value}
                <span className="text-foreground-subtle ml-0.5 text-xs font-normal">
                  {metric.unit}
                </span>
              </span>
            </div>
            <GaugeRangeChart
              value={metric.value}
              min={metric.min}
              max={metric.max}
              boundary={metric.boundary}
              status={metric.status}
              animate
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
