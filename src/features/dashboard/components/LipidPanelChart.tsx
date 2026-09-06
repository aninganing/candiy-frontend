import { Card } from '@/shared/components/ui/Card';
import { BarComparisonChart } from '@/shared/components/charts/BarComparisonChart';
import type { LipidPanelData } from '@/features/dashboard/mappers/lipidPanel.mapper';

export interface LipidPanelChartProps {
  data: LipidPanelData | null;
}

export function LipidPanelChart({ data }: LipidPanelChartProps) {
  return (
    <Card padding="lg" className="w-full max-w-lg">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-foreground text-sm font-bold">지질 패널 비교</h2>
        <p className="text-foreground-subtle text-xs">
          질환의심 기준(100%) 대비 비율 · 최근 3회 검진 기준
        </p>
      </div>
      {data ? (
        <BarComparisonChart
          categories={data.categories}
          series={data.series}
          seriesColors={data.series.map((series) => series.color)}
          thresholdLabel="질환의심 기준"
        />
      ) : (
        <p className="text-foreground-subtle py-6 text-center text-sm">
          지질 패널 비교 값이 없습니다
        </p>
      )}
    </Card>
  );
}
