import { describe, expect, it } from 'vitest';
import { ApiError, isCandiyErrorPayload } from './errors';

describe('ApiError', () => {
  it('code/httpStatus/cause를 보존한다', () => {
    const cause = new Error('network down');
    const error = new ApiError('요청에 실패했습니다.', { code: 'VE-001', httpStatus: 400, cause });

    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('요청에 실패했습니다.');
    expect(error.code).toBe('VE-001');
    expect(error.httpStatus).toBe(400);
    expect(error.cause).toBe(cause);
  });

  it('options 없이도 생성할 수 있다', () => {
    const error = new ApiError('알 수 없는 오류');

    expect(error.code).toBeUndefined();
    expect(error.httpStatus).toBeUndefined();
  });
});

describe('isCandiyErrorPayload', () => {
  it('CANDiY 에러 응답 형태이면 true를 반환한다', () => {
    expect(
      isCandiyErrorPayload({ status: 'error', code: 'AT-001', message: '인증이 필요합니다.' }),
    ).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['배열', []],
    ['status가 error가 아님', { status: 'ok', code: 'AT-001' }],
    ['code가 string이 아님', { status: 'error', code: 123 }],
    ['code 없음', { status: 'error' }],
  ])('%s이면 false를 반환한다', (_label, value) => {
    expect(isCandiyErrorPayload(value)).toBe(false);
  });
});
