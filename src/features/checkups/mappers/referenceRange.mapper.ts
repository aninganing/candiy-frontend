export interface ReferenceBound {
  min?: number;
  max?: number;
}

const RANGE = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/;
const AT_LEAST = /^(\d+(?:\.\d+)?)\s*이상$/;
const AT_MOST = /^(\d+(?:\.\d+)?)\s*이하$/;
const LESS_THAN = /^(\d+(?:\.\d+)?)\s*미만$/;
const MORE_THAN = /^(\d+(?:\.\d+)?)\s*초과$/;

// 성별조건(남:/여:)이나 복합값(혈압처럼 "/"로 묶인 값)은 지원 범위 밖이라 null을 반환한다.
export function parseReferenceBound(text: string | undefined): ReferenceBound | null {
  if (!text) return null;
  const trimmed = text.trim();

  const range = RANGE.exec(trimmed);
  if (range) return { min: Number(range[1]), max: Number(range[2]) };

  const atLeast = AT_LEAST.exec(trimmed);
  if (atLeast) return { min: Number(atLeast[1]) };

  const atMost = AT_MOST.exec(trimmed);
  if (atMost) return { max: Number(atMost[1]) };

  const lessThan = LESS_THAN.exec(trimmed);
  if (lessThan) return { max: Number(lessThan[1]) };

  const moreThan = MORE_THAN.exec(trimmed);
  if (moreThan) return { min: Number(moreThan[1]) };

  return null;
}

function isWithinBound(value: number, bound: ReferenceBound): boolean {
  return (bound.min === undefined || value >= bound.min) && (bound.max === undefined || value <= bound.max);
}

export type MetricStatus = 'normal' | 'warning' | 'danger';

// 정상(A) 범위에 들면 normal, 질환의심 범위에 들면 danger, 둘 다 아니면(경계 구간) warning으로 분류한다.
export function classifyMetricStatus(
  value: number,
  normalBound: ReferenceBound | null,
  riskBound: ReferenceBound | null,
): MetricStatus {
  if (normalBound && isWithinBound(value, normalBound)) return 'normal';
  if (riskBound && isWithinBound(value, riskBound)) return 'danger';
  return 'warning';
}

// 게이지에는 경계선을 하나만 그릴 수 있어, 정상 범위의 위/아래 경계 중 존재하는 쪽을 사용한다.
export function pickGaugeBoundary(normalBound: ReferenceBound | null): number | undefined {
  if (!normalBound) return undefined;
  return normalBound.max ?? normalBound.min;
}
