import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ChartOptions } from 'chart.js';

const barMock = vi.fn();
vi.mock('react-chartjs-2', () => ({
  Bar: (props: { data: unknown; options: unknown }) => {
    barMock(props);
    return null;
  },
}));

const { BarComparisonChart } = await import('./BarComparisonChart');

interface BarProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string }[];
  };
  options: ChartOptions<'bar'>;
}

function lastBarProps(): BarProps {
  const call = barMock.mock.calls.at(-1) as [BarProps];
  return call[0];
}

const series = [
  { label: '총콜레스테롤(%)', values: [82.5, 85.4, 102.1] },
  { label: 'LDL콜레스테롤(%)', values: [62.5, 65, 86.3] },
];
const seriesColors = ['#4f46e5', '#0d9488'];
const categories = ["'22", "'23", "'24"];

describe('BarComparisonChart', () => {
  it('series를 datasets로, categories를 라벨로, seriesColors를 순서대로 색상에 전달한다', () => {
    render(
      <BarComparisonChart series={series} seriesColors={seriesColors} categories={categories} />,
    );

    const props = lastBarProps();
    expect(props.data.labels).toEqual(categories);
    expect(props.data.datasets).toHaveLength(2);
    expect(props.data.datasets[0].data).toEqual(series[0].values);
    expect(props.data.datasets[0].backgroundColor).toBe(seriesColors[0]);
    expect(props.data.datasets[1].backgroundColor).toBe(seriesColors[1]);
  });

  it('series와 seriesColors 개수가 다르면 에러를 던진다', () => {
    expect(() =>
      render(
        <BarComparisonChart series={series} seriesColors={['#4f46e5']} categories={categories} />,
      ),
    ).toThrow(/개수가 일치해야 합니다/);
  });

  it('기준선(threshold) 값/라벨과 y축 max를 옵션으로 전달한다', () => {
    render(
      <BarComparisonChart
        series={series}
        seriesColors={seriesColors}
        categories={categories}
        max={150}
        thresholdValue={100}
        thresholdLabel="100% = 질환의심 기준"
      />,
    );

    const { options } = lastBarProps();
    expect(options.scales?.y).toMatchObject({ min: 0, max: 150 });
    expect(options.plugins?.barThreshold).toMatchObject({
      value: 100,
      label: '100% = 질환의심 기준',
    });
  });

  it('thresholdLabel을 생략하면 라벨 없이 undefined로 전달한다', () => {
    render(
      <BarComparisonChart series={series} seriesColors={seriesColors} categories={categories} />,
    );

    expect(lastBarProps().options.plugins?.barThreshold?.label).toBeUndefined();
  });

  it('series 라벨과 색상 스와치를 범례로 렌더링한다', () => {
    render(
      <BarComparisonChart series={series} seriesColors={seriesColors} categories={categories} />,
    );

    expect(screen.getByText('총콜레스테롤(%)')).toBeInTheDocument();
    expect(screen.getByText('LDL콜레스테롤(%)')).toBeInTheDocument();

    const swatches = document.querySelectorAll('span.inline-block.h-2\\.5.w-2\\.5');
    expect(swatches).toHaveLength(series.length);
    expect(swatches[0]).toHaveStyle({ backgroundColor: seriesColors[0] });
    expect(swatches[1]).toHaveStyle({ backgroundColor: seriesColors[1] });
  });

  it('seriesColors가 몇 개든 그대로 순서대로 사용한다', () => {
    const fiveSeries = [
      ...series,
      { label: '중성지방(%)', values: [60, 67.5, 84] },
      { label: '공복혈당(%)', values: [70, 78, 92] },
      { label: '허리둘레(%)', values: [88, 94, 101] },
    ];
    const fiveColors = ['#111111', '#222222', '#333333', '#444444', '#555555'];

    render(
      <BarComparisonChart series={fiveSeries} seriesColors={fiveColors} categories={categories} />,
    );

    const backgroundColors = lastBarProps().data.datasets.map((d) => d.backgroundColor);
    expect(backgroundColors).toEqual(fiveColors);
  });
});
