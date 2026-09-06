import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { toHistorySections } from './historyDetail.mapper';

const data = toCheckupData(checkupDataFixture);

function findRow(sections: ReturnType<typeof toHistorySections>, label: string) {
  return sections.flatMap((section) => section.rows).find((row) => row.label === label);
}

describe('toHistorySections', () => {
  it('참고치를 단일 상·하한으로 파싱할 수 있는 항목은 상태와 게이지를 계산한다', () => {
    const sections = toHistorySections(data.overviews[0], data.references);

    const bmi = findRow(sections, 'BMI');
    expect(bmi?.value).toBe('23.5');
    expect(bmi?.status).toBe('normal');
    expect(bmi?.gauge).toMatchObject({ value: 23.5, min: 10, max: 40, boundary: 24.9 });
  });

  it('성별조건/복합값처럼 파싱 불가한 항목은 값·참고치 원문만 보여주고 상태·게이지는 없다', () => {
    const sections = toHistorySections(data.overviews[0], data.references);

    const bloodPressure = findRow(sections, '혈압');
    expect(bloodPressure?.value).toBe('118/76');
    expect(bloodPressure?.reference).toBe('120미만 이며/80미만');
    expect(bloodPressure?.status).toBeUndefined();
    expect(bloodPressure?.gauge).toBeUndefined();
  });

  it('참고치 자체가 없는 항목은 값만 보여준다', () => {
    const sections = toHistorySections(data.overviews[0], data.references);

    const height = findRow(sections, '신장');
    expect(height?.value).toBe('170.5');
    expect(height?.reference).toBeUndefined();
    expect(height?.status).toBeUndefined();
  });

  it('종합소견처럼 CheckupReference에 아예 없는 항목도 값만 보여준다', () => {
    const sections = toHistorySections(data.overviews[0], data.references);

    const evaluation = findRow(sections, '종합판정');
    expect(evaluation?.value).toBe('정A');
    expect(evaluation?.reference).toBeUndefined();
  });

  it('22개 항목을 7개 섹션으로 모두 포함한다', () => {
    const sections = toHistorySections(data.overviews[0], data.references);

    expect(sections).toHaveLength(7);
    expect(sections.flatMap((section) => section.rows)).toHaveLength(22);
  });
});
