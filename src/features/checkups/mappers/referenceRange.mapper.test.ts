import { describe, expect, it } from 'vitest';
import { classifyMetricStatus, parseReferenceBound, pickGaugeBoundary } from './referenceRange.mapper';

describe('parseReferenceBound', () => {
  it('범위 패턴을 파싱한다', () => {
    expect(parseReferenceBound('18.5-24.9')).toEqual({ min: 18.5, max: 24.9 });
  });

  it('이상/이하/미만/초과 패턴을 파싱한다', () => {
    expect(parseReferenceBound('60이상')).toEqual({ min: 60 });
    expect(parseReferenceBound('35이하')).toEqual({ max: 35 });
    expect(parseReferenceBound('100미만')).toEqual({ max: 100 });
    expect(parseReferenceBound('1.6초과')).toEqual({ min: 1.6 });
  });

  it('성별조건/복합값처럼 지원 범위 밖 패턴은 null을 반환한다', () => {
    expect(parseReferenceBound('남: 13-16.5 / 여: 12-15.5')).toBeNull();
    expect(parseReferenceBound('120미만 이며/80미만')).toBeNull();
  });

  it('빈 값이면 null을 반환한다', () => {
    expect(parseReferenceBound(undefined)).toBeNull();
  });
});

describe('classifyMetricStatus', () => {
  const normal = { max: 24.9, min: 18.5 };
  const risk = { min: 30 };

  it('정상 범위 안이면 normal', () => {
    expect(classifyMetricStatus(22, normal, risk)).toBe('normal');
  });

  it('질환의심 범위 안이면 danger', () => {
    expect(classifyMetricStatus(31, normal, risk)).toBe('danger');
  });

  it('둘 다 아니면(경계 구간) warning', () => {
    expect(classifyMetricStatus(27, normal, risk)).toBe('warning');
  });
});

describe('pickGaugeBoundary', () => {
  it('상한이 있으면 상한을 사용한다', () => {
    expect(pickGaugeBoundary({ min: 18.5, max: 24.9 })).toBe(24.9);
  });

  it('상한이 없으면 하한을 사용한다', () => {
    expect(pickGaugeBoundary({ min: 60 })).toBe(60);
  });

  it('참고치가 없으면 undefined를 반환한다', () => {
    expect(pickGaugeBoundary(null)).toBeUndefined();
  });
});
