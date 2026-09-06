import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toGaugeMetrics } from './gaugeMetrics.mapper';

const data = toCheckupData(checkupDataFixture);

describe('toGaugeMetrics', () => {
  it('설정된 항목마다 값·상태·경계를 계산한다', () => {
    const metrics = toGaugeMetrics(data.overviews[0], data.references);

    const bmi = metrics.find((metric) => metric.key === 'bmi');
    expect(bmi).toMatchObject({ label: 'BMI', unit: 'kg/m²', boundary: 24.9 });
    expect(bmi?.status).toBe('normal');
  });

  it('참고치를 파싱할 수 없는 항목(성별조건/복합값)은 결과에서 제외한다', () => {
    const metrics = toGaugeMetrics(data.overviews[0], data.references);

    expect(metrics.some((metric) => metric.key === 'bloodPressure')).toBe(false);
    expect(metrics.some((metric) => metric.key === 'hemoglobin')).toBe(false);
  });
});
