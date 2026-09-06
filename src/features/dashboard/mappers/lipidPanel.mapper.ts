import {
  parseNumericValue,
  parseReferenceBound,
} from '@/features/checkups/mappers/referenceRange.mapper';
import type {
  CheckupData,
  CheckupOverview,
  CheckupReference,
} from '@/features/checkups/types/checkup.types';

export interface LipidPanelSeries {
  label: string;
  values: number[];
  color: string;
}

export interface LipidPanelData {
  categories: string[];
  series: LipidPanelSeries[];
}

interface LipidField {
  key: Extract<keyof CheckupOverview, 'totalCholesterol' | 'ldlCholesterol' | 'triglyceride'>;
  label: string;
  color: string;
}

// 위험치가 "X이상" 방향(높을수록 위험)인 지질 항목만 다룬다 — %(=질환의심 기준 대비 비율) 프레임과 방향이 맞기 때문.
// 색상을 항목에 고정해 둔다 — 일부 항목이 빠져도(값 없음/참고치 파싱 불가) 남은 항목의 색이 매번 같도록.
const LIPID_FIELDS: LipidField[] = [
  { key: 'totalCholesterol', label: '총콜레스테롤(%)', color: '#4f46e5' },
  { key: 'ldlCholesterol', label: 'LDL콜레스테롤(%)', color: '#0d9488' },
  { key: 'triglyceride', label: '중성지방(%)', color: '#c026d3' },
];

const MAX_COUNT = 3;

function findReference(references: CheckupReference[], refType: string) {
  return references.find((reference) => reference.refType === refType);
}

function toShortYearLabel(checkupDate: string): string {
  return `'${checkupDate.slice(2, 4)}`;
}

// 각 지질 항목의 실측값을 질환의심 기준(=100%) 대비 비율로 환산해, 최근 검진 3건까지 비교할 수 있게 만든다.
export function toLipidPanel(data: CheckupData): LipidPanelData | null {
  const sorted = [...data.overviews]
    .sort((a, b) => a.checkupDate.localeCompare(b.checkupDate))
    .slice(-MAX_COUNT);
  if (sorted.length === 0) return null;

  const riskReference = findReference(data.references, '질환의심');
  const series: LipidPanelSeries[] = [];

  for (const field of LIPID_FIELDS) {
    const riskBound = parseReferenceBound(riskReference?.[field.key]);
    if (!riskBound || riskBound.min === undefined) continue;

    const parsedValues = sorted.map((overview) => parseNumericValue(overview[field.key]));
    if (parsedValues.some((value) => value === null)) continue;
    const values = parsedValues as number[];

    const percentValues = values.map((value) => Math.round((value / riskBound.min!) * 1000) / 10);
    series.push({ label: field.label, values: percentValues, color: field.color });
  }

  if (series.length === 0) return null;
  return { categories: sorted.map((overview) => toShortYearLabel(overview.checkupDate)), series };
}
