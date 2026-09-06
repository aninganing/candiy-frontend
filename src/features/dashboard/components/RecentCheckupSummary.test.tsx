import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toGaugeMetrics } from '@/features/dashboard/mappers/gaugeMetrics.mapper';
import { toTrendMetrics } from '@/features/dashboard/mappers/trendMetrics.mapper';
import { RecentCheckupSummary } from './RecentCheckupSummary';

const data = toCheckupData(checkupDataFixture);
const overview = data.overviews[0];
const gaugeMetrics = toGaugeMetrics(overview, data.references);
const trendMetrics = toTrendMetrics(data);

describe('RecentCheckupSummary', () => {
  it('환자명·검진일·종합소견과 신장/체중/혈압/BMI를 표시한다', () => {
    render(
      <RecentCheckupSummary
        patientName={data.patientName}
        overview={overview}
        gaugeMetrics={gaugeMetrics}
        trendMetrics={trendMetrics}
      />,
    );

    expect(screen.getByText(`${data.patientName}님의 최근 검진 결과`)).toBeInTheDocument();
    expect(screen.getByText(`${overview.checkupDate} 검진`)).toBeInTheDocument();
    expect(screen.getByText(overview.evaluation)).toBeInTheDocument();
    expect(screen.getByText(overview.height)).toBeInTheDocument();
    expect(screen.getByText(overview.weight)).toBeInTheDocument();
    expect(screen.getByText(overview.bloodPressure)).toBeInTheDocument();
    // BMI 값은 상단 요약과 게이지 목록 두 곳에 나타난다.
    expect(screen.getAllByText(overview.bmi).length).toBeGreaterThanOrEqual(1);
  });

  it('게이지·추이 항목을 함께 표시한다', () => {
    render(
      <RecentCheckupSummary
        patientName={data.patientName}
        overview={overview}
        gaugeMetrics={gaugeMetrics}
        trendMetrics={trendMetrics}
      />,
    );

    expect(screen.getByText('주요 수치')).toBeInTheDocument();
    expect(screen.getByText('핵심 지표 추이')).toBeInTheDocument();
  });

  it('게이지·추이 항목이 모두 없으면 그 영역을 렌더링하지 않는다', () => {
    render(
      <RecentCheckupSummary
        patientName={data.patientName}
        overview={overview}
        gaugeMetrics={[]}
        trendMetrics={[]}
      />,
    );

    expect(screen.queryByText('주요 수치')).not.toBeInTheDocument();
    expect(screen.queryByText('핵심 지표 추이')).not.toBeInTheDocument();
  });
});
