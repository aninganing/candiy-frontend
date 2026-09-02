// CANDiY 에러 응답과 그 외 실패를 동일한 형태로 정규화해 features 레이어에 전달한다.
export class ApiError extends Error {
  readonly code?: string;
  readonly httpStatus?: number;

  constructor(message: string, options?: { code?: string; httpStatus?: number; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = 'ApiError';
    this.code = options?.code;
    this.httpStatus = options?.httpStatus;
  }
}

// CANDiY 오류코드 문서 기준 원본 에러 응답 형태 (AT-xxx/AE-xxx/VE-xxx/SE-xxx/TE-xxx 등)
export interface CandiyErrorPayload {
  status: 'error';
  message: string;
  code: string;
}

export function isCandiyErrorPayload(value: unknown): value is CandiyErrorPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).status === 'error' &&
    typeof (value as Record<string, unknown>).code === 'string'
  );
}
