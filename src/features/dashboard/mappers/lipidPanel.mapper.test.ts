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

  it('항목마다 고정된 색상을 부여한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const result = toLipidPanel(data);

    expect(result?.series.find((s) => s.label === '총콜레스테롤(%)')?.color).toBe('#4f46e5');
    expect(result?.series.find((s) => s.label === 'LDL콜레스테롤(%)')?.color).toBe('#0d9488');
    expect(result?.series.find((s) => s.label === '중성지방(%)')?.color).toBe('#c026d3');
  });

  it('일부 항목의 참고치를 파싱할 수 없으면 그 항목만 빼고, 나머지는 원래 색상을 유지한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const references = data.references.map((reference) =>
      reference.refType === '질환의심'
        ? { ...reference, totalCholesterol: '남 240이상 / 여 230이상' }
        : reference,
    );

    const result = toLipidPanel({ ...data, references });

    expect(result?.series.some((s) => s.label === '총콜레스테롤(%)')).toBe(false);
    expect(result?.series.find((s) => s.label === 'LDL콜레스테롤(%)')?.color).toBe('#0d9488');
    expect(result?.series.find((s) => s.label === '중성지방(%)')?.color).toBe('#c026d3');
  });

  it('지질 항목 값이 빈 문자열이면(측정 안 됨) 0%가 아니라 null을 반환한다', () => {
    const data = toCheckupData(checkupDataFixture);
    const overviews = data.overviews.map((overview) => ({
      ...overview,
      totalCholesterol: '',
      ldlCholesterol: '',
      triglyceride: '',
    }));

    expect(toLipidPanel({ ...data, overviews })).toBeNull();
  });
});
