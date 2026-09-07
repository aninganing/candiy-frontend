import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toTrendMetrics } from './trendMetrics.mapper';

describe('toTrendMetrics', () => {
  it('BMI, 수축기/이완기 혈압을 검진일 오름차순으로 정렬해 반환한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const metrics = toTrendMetrics(data);

    const bmi = metrics.find((metric) => metric.key === 'bmi');
    expect(bmi).toMatchObject({
      label: 'BMI',
      categories: ["'23", "'24"],
      values: [24.1, 23.5],
      reference: { kind: 'band', low: 18.5, high: 24.9 },
    });

    const systolic = metrics.find((metric) => metric.key === 'systolicBloodPressure');
    expect(systolic).toMatchObject({
      label: '수축기 혈압',
      values: [124, 118],
      reference: { kind: 'line', boundary: 120, riskBoundary: 140 },
    });

    const diastolic = metrics.find((metric) => metric.key === 'diastolicBloodPressure');
    expect(diastolic).toMatchObject({
      label: '이완기 혈압',
      values: [80, 76],
      reference: { kind: 'line', boundary: 80, riskBoundary: 90 },
    });
  });

  it('검진이 1건뿐이면 추이가 성립하지 않아 빈 배열을 반환한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const singleOverview = { ...data, overviews: [data.overviews[0]] };

    expect(toTrendMetrics(singleOverview)).toEqual([]);
  });

  it('검진이 3건을 넘으면 가장 최근 3건만 사용한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const [newer, older] = data.overviews;
    const overviews = [
      { ...older, checkupDate: '2021-04-22' },
      { ...older, checkupDate: '2022-04-22' },
      older,
      newer,
    ];

    const metrics = toTrendMetrics({ ...data, overviews });

    const bmi = metrics.find((metric) => metric.key === 'bmi');
    expect(bmi?.categories).toEqual(["'22", "'23", "'24"]);
  });

  it('BMI 값이 빈 문자열이면(측정 안 됨) 0으로 취급하지 않고 BMI 추이를 제외한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const overviews = data.overviews.map((overview) => ({ ...overview, bmi: '' }));

    const metrics = toTrendMetrics({ ...data, overviews });

    expect(metrics.some((metric) => metric.key === 'bmi')).toBe(false);
  });
});
