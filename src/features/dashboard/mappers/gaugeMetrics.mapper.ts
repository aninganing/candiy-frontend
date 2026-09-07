import { GAUGE_METRICS } from '@/config/metrics';
import {
  classifyMetricStatus,
  parseNumericValue,
  parseReferenceBound,
  pickGaugeBoundary,
} from '@/features/checkups/mappers/referenceRange.mapper';
import type { CheckupOverview, CheckupReference } from '@/features/checkups/types/checkup.types';
import type { ChartStatus } from '@/shared/components/charts/chartTheme';

export interface GaugeMetric {
  key: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  boundary: number;
  status: ChartStatus;
}

function findReference(references: CheckupReference[], refType: string) {
  return references.find((reference) => reference.refType === refType);
}

export function toGaugeMetrics(
  overview: CheckupOverview,
  references: CheckupReference[],
): GaugeMetric[] {
  const normalReference = findReference(references, '정상(A)');
  const riskReference = findReference(references, '질환의심');

  return GAUGE_METRICS.reduce<GaugeMetric[]>((metrics, config) => {
    const value = parseNumericValue(overview[config.key]);
    if (value === null) return metrics;

    const normalBound = parseReferenceBound(normalReference?.[config.key]);
    const riskBound = parseReferenceBound(riskReference?.[config.key]);
    const boundary = pickGaugeBoundary(normalBound);
    if (boundary === undefined) return metrics;

    metrics.push({
      key: config.key,
      label: config.label,
      unit: config.unit,
      value,
      min: config.min,
      max: config.max,
      boundary,
      status: classifyMetricStatus(value, normalBound, riskBound),
    });
    return metrics;
  }, []);
}
