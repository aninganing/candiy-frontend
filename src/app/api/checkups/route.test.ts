import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const post = vi.fn();
vi.mock('@/shared/api/candiyServerClient', () => ({
  candiyServerClient: { post },
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  post.mockReset();
});

describe('POST /api/checkups', () => {
  it('mock 모드에서는 실제 CANDiY API를 호출하지 않고 fixture를 반환한다', async () => {
    vi.stubEnv('CANDIY_API_KEY', 'test-key');
    vi.stubEnv('NEXT_PUBLIC_API_MODE', 'mock');
    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/checkups', { method: 'POST', body: JSON.stringify({}) }),
    );
    const json = await response.json();

    expect(post).not.toHaveBeenCalled();
    expect(json.status).toBe('success');
  });

  it('live 모드에서는 candiyServerClient로 실제 API를 호출한다', async () => {
    vi.stubEnv('CANDIY_API_KEY', 'test-key');
    vi.stubEnv('NEXT_PUBLIC_API_MODE', 'live');
    post.mockResolvedValueOnce({ data: { status: 'success', data: {} } });
    const { POST } = await import('./route');

    await POST(
      new Request('http://localhost/api/checkups', { method: 'POST', body: JSON.stringify({}) }),
    );

    expect(post).toHaveBeenCalledWith('/v1/nhis/checkup', {});
  });
});
