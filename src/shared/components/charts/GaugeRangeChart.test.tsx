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

const { GaugeRangeChart } = await import('./GaugeRangeChart');

interface BarProps {
  data: unknown;
  options: ChartOptions<'bar'>;
}

function lastBarProps(): BarProps {
  const call = barMock.mock.calls.at(-1) as [BarProps];
  return call[0];
}

describe('GaugeRangeChart', () => {
  it('x축 스케일을 min/max로 설정한다', () => {
    render(<GaugeRangeChart value={30} min={10} max={90} boundary={70} status="normal" />);

    expect(lastBarProps().options.scales?.x).toMatchObject({ min: 10, max: 90 });
  });

  it('min/value/boundary를 gaugeVisuals 플러그인 옵션으로 전달한다', () => {
    render(<GaugeRangeChart value={30} min={0} max={100} boundary={70} status="normal" />);

    expect(lastBarProps().options.plugins?.gaugeVisuals).toMatchObject({
      min: 0,
      value: 30,
      boundary: 70,
    });
  });

  it('status별로 다른 채움 색상을 지정한다', () => {
    render(<GaugeRangeChart value={90} min={0} max={100} boundary={70} status="danger" />);
    const dangerColor = lastBarProps().options.plugins?.gaugeVisuals?.fillColor;

    render(<GaugeRangeChart value={90} min={0} max={100} boundary={70} status="normal" />);
    const normalColor = lastBarProps().options.plugins?.gaugeVisuals?.fillColor;

    expect(dangerColor).not.toEqual(normalColor);
  });

  it('animate가 기본값(false)이면 value를 애니메이션 없이 즉시 반영한다', () => {
    render(<GaugeRangeChart value={45} min={0} max={100} boundary={70} status="normal" />);

    expect(lastBarProps().options.plugins?.gaugeVisuals?.value).toBe(45);
  });

  it('animate가 true면 마운트 직후엔 min에서 시작해 아직 value에 도달하지 않는다', () => {
    render(<GaugeRangeChart value={45} min={0} max={100} boundary={70} status="normal" animate />);

    expect(lastBarProps().options.plugins?.gaugeVisuals?.value).toBe(0);
  });

  it('size를 지정하면 고정 너비 클래스가 붙는다', () => {
    render(
      <GaugeRangeChart value={30} min={0} max={100} boundary={70} status="normal" size="md" />,
    );

    expect(screen.getByRole('meter')).toHaveClass('w-48');
  });

  it('size를 지정하지 않으면 고정 너비 클래스가 붙지 않는다(부모가 너비를 결정)', () => {
    render(<GaugeRangeChart value={30} min={0} max={100} boundary={70} status="normal" />);

    const meter = screen.getByRole('meter');
    expect(meter.className).not.toMatch(/\bw-\d/);
  });

  it('aria 속성으로 실제 값/범위를 노출한다', () => {
    render(<GaugeRangeChart value={45} min={0} max={100} boundary={70} status="normal" />);

    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '45');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });
});
