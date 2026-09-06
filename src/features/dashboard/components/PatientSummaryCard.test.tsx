import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { PatientSummaryCard } from './PatientSummaryCard';

const overview = toCheckupData(checkupDataFixture).overviews[0];

describe('PatientSummaryCard', () => {
  it('환자명, 검진일, 종합소견, BMI, 혈압을 표시한다', () => {
    render(<PatientSummaryCard patientName="홍길동" overview={overview} />);

    expect(screen.getByText('홍길동님')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(overview.checkupDate))).toBeInTheDocument();
    expect(screen.getByText(overview.evaluation)).toBeInTheDocument();
    expect(screen.getByText(overview.bmi)).toBeInTheDocument();
    expect(screen.getByText(overview.bloodPressure)).toBeInTheDocument();
  });
});
