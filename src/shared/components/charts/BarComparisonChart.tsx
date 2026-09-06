'use client';

import { useMemo } from 'react';
import type { ChartOptions, Plugin } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '@/shared/components/charts/chartConfig';
import { useChartColors } from '@/shared/components/charts/chartTheme';
import { cn } from '@/shared/lib/cn';

export interface BarComparisonSeries {
  label: string;
  values: number[];
}

export interface BarComparisonChartProps {
  series: BarComparisonSeries[];
  seriesColors: string[];
  categories: string[];
  max?: number;
  thresholdValue?: number;
  thresholdLabel?: string;
  height?: number;
  className?: string;
}

const TICK_FONT = { size: 10, weight: 700 as const };
const LABEL_FONT = '700 10px sans-serif';

// 기준선(질환의심 100%) 초과 시 시각적으로 눈에 띄게 점선으로 표시하는 플러그인.
const barThresholdPlugin: Plugin<'bar'> = {
  id: 'barThreshold',
  afterDatasetsDraw(chart) {
    const opts = chart.options.plugins?.barThreshold;
    if (!opts || typeof opts.value !== 'number' || !opts.lineColor) return;
    const { ctx, chartArea, scales } = chart;
    const y = scales.y.getPixelForValue(opts.value);
    if (y < chartArea.top || y > chartArea.bottom) return;

    ctx.save();
    ctx.strokeStyle = opts.lineColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();

    if (opts.label) {
      ctx.font = LABEL_FONT;
      ctx.fillStyle = opts.lineColor;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(opts.label, chartArea.right, y - 4);
    }
    ctx.restore();
  },
};

// max를 넘는 값은 막대가 잘려도(clip) 실제 값은 그대로 읽을 수 있게 막대 위에 라벨을 그린다.
const barValueLabelsPlugin: Plugin<'bar'> = {
  id: 'barValueLabels',
  afterDatasetsDraw(chart) {
    const opts = chart.options.plugins?.barValueLabels;
    if (!opts || !opts.color) return;
    const { ctx, chartArea } = chart;

    ctx.save();
    ctx.font = LABEL_FONT;
    ctx.fillStyle = opts.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        if (typeof value !== 'number') return;
        const y = Math.max(element.y - 4, chartArea.top + 10);
        ctx.fillText(String(Math.round(value)), element.x, y);
      });
    });
    ctx.restore();
  },
};

const BAR_PLUGINS = [barThresholdPlugin, barValueLabelsPlugin];

export function BarComparisonChart({
  series,
  seriesColors,
  categories,
  max = 120,
  thresholdValue = 100,
  thresholdLabel,
  height = 220,
  className,
}: BarComparisonChartProps) {
  if (seriesColors.length !== series.length) {
    throw new Error(
      `BarComparisonChart: series(${series.length}개)와 seriesColors(${seriesColors.length}개)의 개수가 일치해야 합니다.`,
    );
  }

  const colors = useChartColors();

  const data = useMemo(
    () => ({
      labels: categories,
      datasets: series.map((s, index) => ({
        label: s.label,
        data: s.values,
        backgroundColor: seriesColors[index],
        borderRadius: 3,
      })),
    }),
    [categories, series, seriesColors],
  );

  const options: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { top: 16, right: 4 } },
      scales: {
        x: {
          grid: { display: false },
          border: { color: colors.border },
          ticks: { color: colors.foregroundMuted, font: TICK_FONT },
        },
        y: {
          min: 0,
          max,
          grid: { display: false },
          border: { display: false },
          ticks: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        barThreshold: {
          value: thresholdValue,
          label: thresholdLabel,
          lineColor: colors.danger,
        },
        barValueLabels: { color: colors.foregroundSubtle },
      },
    }),
    [colors, max, thresholdValue, thresholdLabel],
  );

  return (
    <div className={cn(className)}>
      <div className="mb-3 flex flex-wrap gap-3.5">
        {series.map((s, index) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: seriesColors[index] }}
            />
            <span className="text-foreground-muted text-xs">{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height }}>
        <Bar data={data} options={options} plugins={BAR_PLUGINS} />
      </div>
    </div>
  );
}
