import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ChartOptions } from 'chart.js';

const lineMock = vi.fn();
vi.mock('react-chartjs-2', () => ({
  Line: (props: { data: unknown; options: unknown }) => {
    lineMock(props);
    return null;
  },
}));

const { LineTrendChart } = await import('./LineTrendChart');

interface LineProps {
  data: { labels: string[]; datasets: { data: number[]; borderColor: string }[] };
  options: ChartOptions<'line'>;
}

function lastLineProps(): LineProps {
  const call = lineMock.mock.calls.at(-1) as [LineProps];
  return call[0];
}

describe('LineTrendChart', () => {
  it('categories를 x축 라벨로, values를 데이터로 전달한다', () => {
    render(
      <LineTrendChart
        values={[24.6, 24.1, 23.5]}
        categories={["'22", "'23", "'24"]}
        status="normal"
        reference={{ kind: 'band', low: 18.5, high: 24.9 }}
      />,
    );

    const props = lastLineProps();
    expect(props.data.labels).toEqual(["'22", "'23", "'24"]);
    expect(props.data.datasets[0].data).toEqual([24.6, 24.1, 23.5]);
  });

  it('band 참고치를 플러그인 옵션으로 전달한다', () => {
    render(
      <LineTrendChart
        values={[24.6, 24.1, 23.5]}
        categories={["'22", "'23", "'24"]}
        status="normal"
        reference={{ kind: 'band', low: 18.5, high: 24.9 }}
      />,
    );

    expect(lastLineProps().options.plugins?.lineReference).toMatchObject({
      kind: 'band',
      low: 18.5,
      high: 24.9,
    });
  });

  it('line 참고치를 플러그인 옵션으로 전달한다', () => {
    render(
      <LineTrendChart
        values={[118, 124, 132]}
        categories={["'22", "'23", "'24"]}
        status="warning"
        reference={{ kind: 'line', boundary: 120 }}
      />,
    );

    expect(lastLineProps().options.plugins?.lineReference).toMatchObject({
      kind: 'line',
      boundary: 120,
    });
  });

  it('line 참고치에 riskBoundary가 있으면 위험색과 함께 전달하고 y축 스케일에도 반영한다', () => {
    render(
      <LineTrendChart
        values={[124, 118]}
        categories={["'23", "'24"]}
        status="normal"
        reference={{ kind: 'line', boundary: 120, riskBoundary: 140 }}
      />,
    );

    const props = lastLineProps();
    expect(props.options.plugins?.lineReference).toMatchObject({
      kind: 'line',
      boundary: 120,
      riskBoundary: 140,
    });
    const { max } = props.options.scales?.y as { max: number };
    expect(max).toBeGreaterThan(140);
  });

  it('status별로 다른 선 색상을 지정한다', () => {
    render(
      <LineTrendChart
        values={[198, 205, 245]}
        categories={["'22", "'23", "'24"]}
        status="danger"
        reference={{ kind: 'line', boundary: 200 }}
      />,
    );
    const dangerColor = lastLineProps().data.datasets[0].borderColor;

    render(
      <LineTrendChart
        values={[198, 205, 245]}
        categories={["'22", "'23", "'24"]}
        status="normal"
        reference={{ kind: 'line', boundary: 200 }}
      />,
    );
    const normalColor = lastLineProps().data.datasets[0].borderColor;

    expect(dangerColor).not.toEqual(normalColor);
  });

  it('y축 min/max에 참고치까지 포함해서 여유 있게 스케일을 잡는다', () => {
    render(
      <LineTrendChart
        values={[198, 205, 245]}
        categories={["'22", "'23", "'24"]}
        status="danger"
        reference={{ kind: 'line', boundary: 200 }}
      />,
    );

    const { min, max } = lastLineProps().options.scales?.y as { min: number; max: number };
    expect(min).toBeLessThan(198);
    expect(max).toBeGreaterThan(245);
  });
});
