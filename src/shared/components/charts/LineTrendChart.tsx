'use client';

import { useMemo, useState } from 'react';
import type { ChartOptions, Plugin } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '@/shared/components/charts/chartConfig';
import { ChartTooltip } from '@/shared/components/charts/ChartTooltip';
import {
  getStatusColor,
  useChartColors,
  type ChartStatus,
} from '@/shared/components/charts/chartTheme';
import { cn } from '@/shared/lib/cn';

export type LineTrendReference =
  { kind: 'band'; low: number; high: number } | { kind: 'line'; boundary: number };

export interface LineTrendChartProps {
  values: number[];
  categories: string[];
  status: ChartStatus;
  reference: LineTrendReference;
  height?: number;
  className?: string;
}

// 참고치가 상/하한 range면 배경 밴드+같은 색 점선 경계, 한쪽 기준(미만/이상)뿐이면 중립색 점선 기준선 하나만 그리는 플러그인.
const lineReferencePlugin: Plugin<'line'> = {
  id: 'lineReference',
  beforeDatasetsDraw(chart) {
    const opts = chart.options.plugins?.lineReference;
    if (!opts) return;
    const { ctx, chartArea, scales } = chart;

    if (
      opts.kind === 'band' &&
      typeof opts.low === 'number' &&
      typeof opts.high === 'number' &&
      opts.bandColor &&
      opts.lineColor
    ) {
      const yHigh = scales.y.getPixelForValue(opts.high);
      const yLow = scales.y.getPixelForValue(opts.low);
      ctx.save();
      ctx.fillStyle = opts.bandColor;
      ctx.fillRect(chartArea.left, yHigh, chartArea.right - chartArea.left, yLow - yHigh);
      ctx.strokeStyle = opts.lineColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      [yHigh, yLow].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
      });
      ctx.restore();
      return;
    }

    if (opts.kind === 'line' && typeof opts.boundary === 'number' && opts.lineColor) {
      const y = scales.y.getPixelForValue(opts.boundary);
      ctx.save();
      ctx.strokeStyle = opts.lineColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
      ctx.restore();
    }
  },
};

const LINE_PLUGINS = [lineReferencePlugin];

export function LineTrendChart({
  values,
  categories,
  status,
  reference,
  height = 90,
  className,
}: LineTrendChartProps) {
  const colors = useChartColors();
  const color = getStatusColor(colors, status);

  const referenceValues =
    reference.kind === 'band' ? [reference.low, reference.high] : [reference.boundary];
  const allValues = [...values, ...referenceValues];
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const range = dataMax - dataMin || 1;
  const slack = range * 0.18;
  const yMin = dataMin - slack;
  const yMax = dataMax + slack;

  const tickFont = { size: 10, weight: 700 as const };

  // 값이 가까우면 y축에 실제값을 다 라벨링하는 대신, 점에 hover하면 정확한 값을 ChartTooltip으로 보여준다.
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, label: '', value: '', visible: false });

  const data = useMemo(
    () => ({
      labels: categories,
      datasets: [
        {
          data: values,
          borderColor: color,
          backgroundColor: color,
          pointBackgroundColor: color,
          pointRadius: 3,
          borderWidth: 2,
          tension: 0,
        },
      ],
    }),
    [categories, values, color],
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { top: 4, right: 4 } },
      interaction: { mode: 'nearest', intersect: true },
      scales: {
        x: {
          grid: { display: false },
          border: { color: colors.border },
          ticks: { color: colors.foregroundMuted, font: tickFont },
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { display: false },
          border: { display: false },
          afterBuildTicks: (scale) => {
            scale.ticks = referenceValues.map((value) => ({ value }));
          },
          ticks: {
            color: colors.foregroundMuted,
            font: tickFont,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: (context) => {
            const { tooltip: model } = context;
            if (model.opacity === 0 || !model.dataPoints?.length) {
              setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
              return;
            }
            const point = model.dataPoints[0];
            setTooltip({
              x: model.caretX,
              y: model.caretY,
              label: String(point.label),
              value: String(point.formattedValue),
              visible: true,
            });
          },
        },
        lineReference:
          reference.kind === 'band'
            ? {
                kind: 'band',
                low: reference.low,
                high: reference.high,
                bandColor: colors.successBg,
                lineColor: colors.success,
              }
            : { kind: 'line', boundary: reference.boundary, lineColor: colors.foregroundSubtle },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tickFont는 매 렌더 재생성되는 리터럴이라 deps에서 제외
    [yMin, yMax, colors, values, reference],
  );

  return (
    <div className={cn('relative', className)} style={{ height }}>
      <Line data={data} options={options} plugins={LINE_PLUGINS} />
      <ChartTooltip {...tooltip} />
    </div>
  );
}
