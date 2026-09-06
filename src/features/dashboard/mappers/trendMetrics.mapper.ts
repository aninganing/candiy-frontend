import {
  classifyMetricStatus,
  parseCompoundReferenceBound,
  parseCompoundValue,
  parseReferenceBound,
  type ReferenceBound,
} from '@/features/checkups/mappers/referenceRange.mapper';
import type { CheckupData, CheckupReference } from '@/features/checkups/types/checkup.types';
import type { ChartStatus } from '@/shared/components/charts/chartTheme';
import type { LineTrendReference } from '@/shared/components/charts/LineTrendChart';

export interface TrendMetric {
  key: string;
  label: string;
  unit: string;
  values: number[];
  categories: string[];
  status: ChartStatus;
  reference: LineTrendReference;
}

function findReference(references: CheckupReference[], refType: string) {
  return references.find((reference) => reference.refType === refType);
}

// 정상이 상한 방향(X미만/이하)이면 위험은 그 반대쪽 하한(X이상/초과)에서 시작하고, 정상이 하한 방향이면 위험은 상한에서 시작한다.
// 두 경계가 같은 값이면(예: GFR 60) 점선이 겹치므로 표시하지 않는다.
function pickRiskBoundary(
  bound: ReferenceBound,
  riskBound: ReferenceBound | null,
): number | undefined {
  if (!riskBound) return undefined;
  const value = bound.max !== undefined ? riskBound.min : riskBound.max;
  if (value === undefined || value === bound.max || value === bound.min) return undefined;
  return value;
}

function toLineReference(
  bound: ReferenceBound,
  riskBound: ReferenceBound | null = null,
): LineTrendReference | null {
  if (bound.min !== undefined && bound.max !== undefined) {
    return { kind: 'band', low: bound.min, high: bound.max };
  }
  if (bound.max !== undefined) {
    return { kind: 'line', boundary: bound.max, riskBoundary: pickRiskBoundary(bound, riskBound) };
  }
  if (bound.min !== undefined) {
    return { kind: 'line', boundary: bound.min, riskBoundary: pickRiskBoundary(bound, riskBound) };
  }
  return null;
}

function toShortYearLabel(checkupDate: string): string {
  return `'${checkupDate.slice(2, 4)}`;
}

const MAX_TREND_COUNT = 3;

// BMI, 수축기/이완기 혈압 3개 항목만 우선 다룬다. 검진이 2건 미만이면 추이라는 프레임이 성립하지 않아 빈 배열을 반환하고,
// 너무 오래된 값까지 보이지 않도록 최근 검진 3건까지만 사용한다.
export function toTrendMetrics(data: CheckupData): TrendMetric[] {
  const sorted = [...data.overviews]
    .sort((a, b) => a.checkupDate.localeCompare(b.checkupDate))
    .slice(-MAX_TREND_COUNT);
  if (sorted.length < 2) return [];

  const categories = sorted.map((overview) => toShortYearLabel(overview.checkupDate));
  const normalReference = findReference(data.references, '정상(A)');
  const riskReference = findReference(data.references, '질환의심');

  const metrics: TrendMetric[] = [];

  const bmiValues = sorted.map((overview) => Number(overview.bmi));
  if (bmiValues.every((value) => !Number.isNaN(value))) {
    const normalBound = parseReferenceBound(normalReference?.bmi);
    const riskBound = parseReferenceBound(riskReference?.bmi);
    const reference = normalBound && toLineReference(normalBound);
    if (reference) {
      metrics.push({
        key: 'bmi',
        label: 'BMI',
        unit: 'kg/m²',
        values: bmiValues,
        categories,
        status: classifyMetricStatus(bmiValues.at(-1)!, normalBound, riskBound),
        reference,
      });
    }
  }

  const bloodPressures = sorted.map((overview) => parseCompoundValue(overview.bloodPressure));
  if (bloodPressures.every((pair) => pair !== null)) {
    const systolicValues = bloodPressures.map((pair) => pair![0]);
    const diastolicValues = bloodPressures.map((pair) => pair![1]);
    const [normalSystolic, normalDiastolic] = parseCompoundReferenceBound(
      normalReference?.bloodPressure,
    );
    const [riskSystolic, riskDiastolic] = parseCompoundReferenceBound(riskReference?.bloodPressure);

    const systolicReference = normalSystolic && toLineReference(normalSystolic, riskSystolic);
    if (systolicReference) {
      metrics.push({
        key: 'systolicBloodPressure',
        label: '수축기 혈압',
        unit: 'mmHg',
        values: systolicValues,
        categories,
        status: classifyMetricStatus(systolicValues.at(-1)!, normalSystolic, riskSystolic),
        reference: systolicReference,
      });
    }

    const diastolicReference = normalDiastolic && toLineReference(normalDiastolic, riskDiastolic);
    if (diastolicReference) {
      metrics.push({
        key: 'diastolicBloodPressure',
        label: '이완기 혈압',
        unit: 'mmHg',
        values: diastolicValues,
        categories,
        status: classifyMetricStatus(diastolicValues.at(-1)!, normalDiastolic, riskDiastolic),
        reference: diastolicReference,
      });
    }
  }

  return metrics;
}
