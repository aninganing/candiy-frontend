import { Card } from '@/shared/components/ui/Card';
import { LineTrendChart } from '@/shared/components/charts/LineTrendChart';
import type { ChartStatus } from '@/shared/components/charts/chartTheme';
import type { TrendMetric } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { cn } from '@/shared/lib/cn';

export interface MetricTrendListProps {
  metrics: TrendMetric[];
}

const VALUE_COLOR: Record<ChartStatus, string> = {
  normal: 'text-foreground',
  warning: 'text-warning',
  danger: 'text-danger',
};

export function MetricTrendList({ metrics }: MetricTrendListProps) {
  if (metrics.length === 0) return null;

  return (
    <Card padding="lg" className="w-full max-w-lg">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-foreground text-sm font-bold">핵심 지표 추이</h2>
        <p className="text-foreground-subtle text-xs">최근 3회 검진 기준</p>
      </div>
      <ul className="flex flex-col gap-6">
        {metrics.map((metric) => (
          <li key={metric.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-foreground-muted text-xs">{metric.label}</span>
              <span className={cn('text-sm font-semibold', VALUE_COLOR[metric.status])}>
                {metric.values.at(-1)}
                <span className="text-foreground-subtle ml-0.5 text-xs font-normal">
                  {metric.unit}
                </span>
              </span>
            </div>
            <LineTrendChart
              values={metric.values}
              categories={metric.categories}
              status={metric.status}
              reference={metric.reference}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
