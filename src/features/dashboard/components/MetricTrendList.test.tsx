import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toTrendMetrics } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { MetricTrendList } from './MetricTrendList';

const metrics = toTrendMetrics(toCheckupData(checkupDataFixture));

describe('MetricTrendList', () => {
  it('제목과 설명, 항목별 라벨/최신 값을 표시한다', () => {
    render(<MetricTrendList metrics={metrics} />);

    expect(screen.getByText('핵심 지표 추이')).toBeInTheDocument();
    expect(screen.getByText('최근 3회 검진 기준')).toBeInTheDocument();
    expect(screen.getByText('BMI')).toBeInTheDocument();
    expect(screen.getByText('수축기 혈압')).toBeInTheDocument();
    expect(screen.getByText('이완기 혈압')).toBeInTheDocument();
  });

  it('항목이 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<MetricTrendList metrics={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
