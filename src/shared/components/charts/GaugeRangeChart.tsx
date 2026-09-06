'use client';

import { useMemo } from 'react';
import type { ChartOptions, Plugin } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '@/shared/components/charts/chartConfig';
import { useAnimatedValue } from '@/shared/components/charts/useAnimatedValue';
import { useChartColors } from '@/shared/components/charts/chartTheme';
import { cn } from '@/shared/lib/cn';

export type GaugeRangeStatus = 'normal' | 'warning' | 'danger';
export type GaugeRangeSize = 'sm' | 'md' | 'lg';

export interface GaugeRangeChartProps {
  value: number;
  min: number;
  max: number;
  boundary: number;
  status: GaugeRangeStatus;
  /** 지정하지 않으면 부모(예: flex-1)가 너비를 결정한다. */
  size?: GaugeRangeSize;
  /** true면 min에서 value까지 채워지는 애니메이션을 재생한다. */
  animate?: boolean;
  className?: string;
}

const SIZE_WIDTH: Record<GaugeRangeSize, string> = {
  sm: 'w-32',
  md: 'w-48',
  lg: 'w-64',
};

// 채움 막대(양끝 라운드)와 boundary(참고치 경계) 세로선을 직접 그리는 플러그인.
// Chart.js의 기본 BarElement 라운드 처리가 floating bar의 시작 쪽 모서리를 각지게 그려서, 대신 canvas API로 pill 모양을 직접 그린다.
const gaugeVisualsPlugin: Plugin<'bar'> = {
  id: 'gaugeVisuals',
  afterDatasetsDraw(chart) {
    const opts = chart.options.plugins?.gaugeVisuals;
    if (
      !opts ||
      typeof opts.min !== 'number' ||
      typeof opts.value !== 'number' ||
      typeof opts.boundary !== 'number' ||
      !opts.fillColor ||
      !opts.boundaryColor
    ) {
      return;
    }
    const { ctx, scales } = chart;
    // chartArea.top/bottom은 숨긴 축이어도 Chart.js가 남겨두는 여백을 포함해서
    // 캔버스 전체 높이보다 얇다. 컨테이너를 꽉 채우도록 캔버스 논리 높이를 직접 쓴다.
    const top = 0;
    const bottom = chart.height;
    const height = bottom - top;

    const fillStart = scales.x.getPixelForValue(opts.min);
    const fillEnd = scales.x.getPixelForValue(opts.value);
    const fillWidth = Math.max(fillEnd - fillStart, 0);

    if (fillWidth > 0) {
      // roundRect는 radius가 width/height의 절반을 넘으면 에러를 던진다.
      // 애니메이션 중 막대가 아주 얇을 때(fillWidth < height)도 안전하도록 clamp한다.
      const radius = Math.min(height, fillWidth) / 2;
      ctx.save();
      ctx.fillStyle = opts.fillColor;
      ctx.beginPath();
      ctx.roundRect(fillStart, top, fillWidth, height, radius);
      ctx.fill();
      ctx.restore();
    }

    const boundaryX = scales.x.getPixelForValue(opts.boundary);
    ctx.save();
    ctx.strokeStyle = opts.boundaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boundaryX, top);
    ctx.lineTo(boundaryX, bottom);
    ctx.stroke();
    ctx.restore();
  },
};

// 매 렌더마다 새 배열을 만들면(예: plugins={[gaugeVisualsPlugin]}) react-chartjs-2가 plugins prop이 바뀐 것으로 보고 애니메이션 중(매 프레임 리렌더) 차트를 불안정하게 다시 그리는 원인이 될 수 있어, 모듈 스코프의 안정적인 참조로 고정한다.
const GAUGE_PLUGINS = [gaugeVisualsPlugin];

export function GaugeRangeChart({
  value,
  min,
  max,
  boundary,
  status,
  size,
  animate = false,
  className,
}: GaugeRangeChartProps) {
  const colors = useChartColors();
  const statusColor =
    status === 'danger' ? colors.danger : status === 'warning' ? colors.warning : colors.foreground;
  const displayValue = useAnimatedValue(value, min, animate);

  // 실제 채움 막대는 gaugeVisuals 플러그인이 직접 그리므로, 여기 dataset은 스케일을 성립시키기 위한 투명한 자리표시자일 뿐이다.
  const data = useMemo(
    () => ({
      labels: [''],
      datasets: [{ data: [min], backgroundColor: 'transparent', borderWidth: 0 }],
    }),
    [min],
  );

  const options: ChartOptions<'bar'> = useMemo(
    () => ({
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { min, max, display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        gaugeVisuals: {
          min,
          value: displayValue,
          fillColor: statusColor,
          boundary,
          boundaryColor: colors.foregroundMuted,
        },
      },
    }),
    [min, max, boundary, displayValue, statusColor, colors.foregroundMuted],
  );

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cn(
        'bg-foreground-subtle relative h-1.5 overflow-hidden rounded-full',
        size && SIZE_WIDTH[size],
        className,
      )}
    >
      <Bar data={data} options={options} plugins={GAUGE_PLUGINS} />
    </div>
  );
}
