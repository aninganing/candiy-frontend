import { Card } from '@/shared/components/ui/Card';
import { BarComparisonChart } from '@/shared/components/charts/BarComparisonChart';
import type { LipidPanelData } from '@/features/dashboard/mappers/lipidPanel.mapper';

export interface LipidPanelChartProps {
  data: LipidPanelData | null;
}

const SERIES_COLORS = ['#4f46e5', '#0d9488', '#c026d3'];

export function LipidPanelChart({ data }: LipidPanelChartProps) {
  if (!data) return null;

  return (
    <Card padding="lg" className="w-full max-w-lg">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-foreground text-sm font-bold">지질 패널 비교</h2>
        <p className="text-foreground-subtle text-xs">
          질환의심 기준(100%) 대비 비율 · 최근 3회 검진 기준
        </p>
      </div>
      <BarComparisonChart
        categories={data.categories}
        series={data.series}
        seriesColors={SERIES_COLORS}
        thresholdLabel="질환의심 기준"
      />
    </Card>
  );
}
