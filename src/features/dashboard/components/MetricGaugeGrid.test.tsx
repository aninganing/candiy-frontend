import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toGaugeMetrics } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { MetricGaugeGrid } from './MetricGaugeGrid';

const data = toCheckupData(checkupDataFixture);
const metrics = toGaugeMetrics(data.overviews[0], data.references);

describe('MetricGaugeGrid', () => {
  it('제목과 각 항목의 라벨·값을 게이지와 함께 표시한다', () => {
    render(<MetricGaugeGrid metrics={metrics} />);

    expect(screen.getByText('주요 수치')).toBeInTheDocument();
    expect(screen.getByText('BMI')).toBeInTheDocument();
    expect(screen.getAllByRole('meter')).toHaveLength(metrics.length);
  });

  it('정상/주의/위험 상태 색상 범례를 표시한다', () => {
    render(<MetricGaugeGrid metrics={metrics} />);

    expect(screen.getByText('정상')).toBeInTheDocument();
    expect(screen.getByText('주의')).toBeInTheDocument();
    expect(screen.getByText('위험')).toBeInTheDocument();
  });

  it('항목이 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<MetricGaugeGrid metrics={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
