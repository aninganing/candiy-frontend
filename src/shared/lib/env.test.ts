import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('clientEnv', () => {
  it('NEXT_PUBLIC_API_MODE가 없으면 mock으로 기본값이 설정된다', async () => {
    delete process.env.NEXT_PUBLIC_API_MODE;
    const { clientEnv } = await import('./env');

    expect(clientEnv.NEXT_PUBLIC_API_MODE).toBe('mock');
  });

  it('live를 그대로 사용한다', async () => {
    process.env.NEXT_PUBLIC_API_MODE = 'live';
    const { clientEnv } = await import('./env');

    expect(clientEnv.NEXT_PUBLIC_API_MODE).toBe('live');
  });

  it('mock/live가 아닌 값이면 모듈 로드 시 에러를 던진다', async () => {
    process.env.NEXT_PUBLIC_API_MODE = 'staging';

    await expect(import('./env')).rejects.toThrow();
  });
});
