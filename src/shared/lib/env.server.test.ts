import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('serverEnv', () => {
  it('CANDIY_API_KEY가 없으면 모듈 로드 시 에러를 던진다', async () => {
    delete process.env.CANDIY_API_KEY;

    await expect(import('./env.server')).rejects.toThrow();
  });

  it('CANDIY_API_BASE_URL이 없으면 기본값을 사용한다', async () => {
    process.env.CANDIY_API_KEY = 'test-key';
    delete process.env.CANDIY_API_BASE_URL;

    const { serverEnv } = await import('./env.server');

    expect(serverEnv.CANDIY_API_BASE_URL).toBe('https://api.candiy.io');
  });

  it('CANDIY_API_BASE_URL이 주어지면 그 값을 사용한다', async () => {
    process.env.CANDIY_API_KEY = 'test-key';
    process.env.CANDIY_API_BASE_URL = 'https://staging.candiy.io';

    const { serverEnv } = await import('./env.server');

    expect(serverEnv.CANDIY_API_BASE_URL).toBe('https://staging.candiy.io');
  });
});
