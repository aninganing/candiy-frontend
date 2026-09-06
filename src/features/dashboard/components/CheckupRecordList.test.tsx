import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CheckupRecord } from '@/features/checkups/types/checkup.types';
import { CheckupRecordList } from './CheckupRecordList';

const records: CheckupRecord[] = [
  {
    caseType: '0',
    checkupType: '일반',
    checkupDate: '2024-05-10',
    organizationName: '서울병원 건강검진센터',
    pdfData: '',
    questionnaire: [],
  },
  {
    caseType: '0',
    checkupType: '종합',
    checkupDate: '2023-04-22',
    organizationName: '강남 검진의원',
    pdfData: '',
    questionnaire: [],
  },
];

describe('CheckupRecordList', () => {
  it('총 건수와 각 기록의 검진일·기관명·검진유형을 최신순으로 표시한다', () => {
    render(<CheckupRecordList records={records} />);

    expect(screen.getByText('총 2건')).toBeInTheDocument();
    const dates = screen.getAllByText(/^\d{4}-\d{2}-\d{2}$/).map((el) => el.textContent);
    expect(dates).toEqual(['2024-05-10', '2023-04-22']);
    expect(screen.getByText('서울병원 건강검진센터')).toBeInTheDocument();
    expect(screen.getByText('강남 검진의원')).toBeInTheDocument();
    expect(screen.getByText('일반')).toBeInTheDocument();
    expect(screen.getByText('종합')).toBeInTheDocument();
  });

  it('overviews 개수와 무관하게 records 개수만으로 건수를 센다', () => {
    const singleOverviewButTwoRecords = records;

    render(<CheckupRecordList records={singleOverviewButTwoRecords} />);

    expect(screen.getByText('총 2건')).toBeInTheDocument();
  });
});
