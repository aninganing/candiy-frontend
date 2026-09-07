import { Card } from '@/shared/components/ui/Card';
import { MetricGaugeGrid } from './MetricGaugeGrid';
import { MetricTrendList } from './MetricTrendList';
import type { CheckupOverview } from '@/features/checkups/types/checkup.types';
import type { GaugeMetric } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import type { TrendMetric } from '@/features/dashboard/mappers/trendMetrics.mapper';

export interface RecentCheckupSummaryProps {
  patientName: string;
  overview: CheckupOverview;
  gaugeMetrics: GaugeMetric[];
  trendMetrics: TrendMetric[];
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-foreground-subtle text-xs">{label}</span>
      <span className="text-foreground text-sm font-semibold">
        {value}
        <span className="text-foreground-subtle ml-0.5 text-xs font-normal">{unit}</span>
      </span>
    </div>
  );
}

export function RecentCheckupSummary({
  patientName,
  overview,
  gaugeMetrics,
  trendMetrics,
}: RecentCheckupSummaryProps) {
  const hasMetrics = gaugeMetrics.length > 0 || trendMetrics.length > 0;

  return (
    <Card padding="lg" className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
          <h1 className="text-foreground text-lg font-bold tracking-tight">
            {patientName}님의 가장 최근 검진 결과
          </h1>
          <span className="text-foreground-subtle text-xs whitespace-nowrap">
            {overview.checkupDate} 검진
          </span>
        </div>
        <p className="text-foreground-muted text-sm leading-relaxed">{overview.evaluation}</p>
        <div className="border-border grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
          <Stat label="신장" value={overview.height} unit="cm" />
          <Stat label="체중" value={overview.weight} unit="kg" />
          <Stat label="혈압" value={overview.bloodPressure} unit="mmHg" />
          <Stat label="BMI" value={overview.bmi} unit="kg/m²" />
        </div>
      </div>
      {hasMetrics && (
        <div className="border-border grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
          <MetricGaugeGrid metrics={gaugeMetrics} />
          <MetricTrendList metrics={trendMetrics} />
        </div>
      )}
    </Card>
  );
}
