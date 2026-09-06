import { GAUGE_METRICS, HISTORY_SECTIONS } from '@/config/metrics';
import {
  classifyMetricStatus,
  parseReferenceBound,
  pickGaugeBoundary,
} from '@/features/checkups/mappers/referenceRange.mapper';
import type { CheckupOverview, CheckupReference } from '@/features/checkups/types/checkup.types';
import type { ChartStatus } from '@/shared/components/charts/chartTheme';

export interface HistoryRowGauge {
  value: number;
  min: number;
  max: number;
  boundary: number;
}

export interface HistoryRow {
  label: string;
  value: string;
  reference?: string;
  status?: ChartStatus;
  gauge?: HistoryRowGauge;
}

export interface HistorySection {
  title: string;
  rows: HistoryRow[];
}

const GAUGE_SCALES = new Map<keyof CheckupOverview, (typeof GAUGE_METRICS)[number]>(
  GAUGE_METRICS.map((metric) => [metric.key, metric]),
);

function getReferenceValue(
  reference: CheckupReference | undefined,
  key: keyof CheckupOverview,
): string | undefined {
  return (reference as unknown as Record<string, string | undefined> | undefined)?.[key];
}

function findReference(references: CheckupReference[], refType: string) {
  return references.find((reference) => reference.refType === refType);
}

// CheckupOverview의 22개 항목 전체를 섹션별로 나열한다.
// 참고치를 단일 상·하한으로 파싱할 수 있는 항목은 상태(정상/주의/위험)와 게이지를 함께 계산하고(GAUGE_METRICS 스케일 재사용), 성별조건/복합값처럼 파싱 불가한 항목은 값과 참고치 원문만 그대로 보여준다
export function toHistorySections(
  overview: CheckupOverview,
  references: CheckupReference[],
): HistorySection[] {
  const normalReference = findReference(references, '정상(A)');
  const riskReference = findReference(references, '질환의심');

  return HISTORY_SECTIONS.map((section) => ({
    title: section.title,
    rows: section.fields.map((field) => {
      const rawValue = overview[field.key];
      const normalRefText = getReferenceValue(normalReference, field.key);
      const normalBound = parseReferenceBound(normalRefText);
      const riskBound = parseReferenceBound(getReferenceValue(riskReference, field.key));

      const numericValue = Number(rawValue);
      const hasNumericValue = rawValue !== '' && !Number.isNaN(numericValue);

      const status: ChartStatus | undefined =
        normalBound && hasNumericValue
          ? classifyMetricStatus(numericValue, normalBound, riskBound)
          : undefined;

      const scale = GAUGE_SCALES.get(field.key);
      const boundary = normalBound ? pickGaugeBoundary(normalBound) : undefined;
      const gauge: HistoryRowGauge | undefined =
        scale && hasNumericValue && boundary !== undefined
          ? { value: numericValue, min: scale.min, max: scale.max, boundary }
          : undefined;

      return {
        label: field.label,
        value: rawValue,
        reference: normalRefText,
        status,
        gauge,
      };
    }),
  }));
}
