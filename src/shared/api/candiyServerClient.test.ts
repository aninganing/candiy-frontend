import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV, CANDIY_API_KEY: 'test-key' };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('candiyServerClient', () => {
  it('serverEnv 값으로 baseURL과 x-api-key 헤더를 구성한다', async () => {
    process.env.CANDIY_API_BASE_URL = 'https://staging.candiy.io';

    const { candiyServerClient } = await import('./candiyServerClient');

    expect(candiyServerClient.defaults.baseURL).toBe('https://staging.candiy.io');
    expect(candiyServerClient.defaults.headers['x-api-key']).toBe('test-key');
  });
});
