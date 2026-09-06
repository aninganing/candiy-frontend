import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toLipidPanel } from './lipidPanel.mapper';

describe('toLipidPanel', () => {
  it('지질 3항목을 질환의심 기준 대비 비율로 환산해 검진일 오름차순으로 반환한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const result = toLipidPanel(data);

    expect(result?.categories).toEqual(["'23", "'24"]);

    const totalCholesterol = result?.series.find((series) => series.label === '총콜레스테롤(%)');
    expect(totalCholesterol?.values).toEqual([85.4, 76.7]);

    const ldl = result?.series.find((series) => series.label === 'LDL콜레스테롤(%)');
    expect(ldl?.values).toEqual([73.8, 65]);

    const triglyceride = result?.series.find((series) => series.label === '중성지방(%)');
    expect(triglyceride?.values).toEqual([67.5, 55]);
  });

  it('검진 데이터가 없으면 null을 반환한다', () => {
    const data = toCheckupData(checkupDataFixture);

    expect(toLipidPanel({ ...data, overviews: [] })).toBeNull();
  });
});
