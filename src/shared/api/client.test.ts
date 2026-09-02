import { AxiosError, type AxiosResponse } from 'axios';
import { afterEach, describe, expect, it } from 'vitest';
import { apiClient, apiGet, apiPost } from './client';
import { ApiError } from './errors';

const originalAdapter = apiClient.defaults.adapter;

function mockAdapter(handler: NonNullable<typeof apiClient.defaults.adapter>) {
  apiClient.defaults.adapter = handler;
}

afterEach(() => {
  apiClient.defaults.adapter = originalAdapter;
});

describe('apiGet / apiPost', () => {
  it('성공 시 response.data를 그대로 반환한다', async () => {
    mockAdapter(async (config) => ({
      data: { hello: 'world' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }));

    await expect(apiGet('/ping')).resolves.toEqual({ hello: 'world' });
  });

  it('apiPost는 body를 그대로 전달한다', async () => {
    mockAdapter(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }));

    const result = await apiPost<{ ok: boolean }>('/checkups', { year: 2026 });

    expect(result).toEqual({ ok: true });
  });
});

describe('apiClient 에러 정규화', () => {
  it('CANDiY 에러 응답을 code/message/httpStatus가 채워진 ApiError로 변환한다', async () => {
    mockAdapter(async (config) => {
      throw new AxiosError('Request failed with status code 400', 'ERR_BAD_REQUEST', config, null, {
        status: 400,
        data: { status: 'error', code: 'VE-001', message: '잘못된 요청입니다.' },
      } as AxiosResponse);
    });

    await expect(apiGet('/checkups')).rejects.toMatchObject({
      name: 'ApiError',
      message: '잘못된 요청입니다.',
      code: 'VE-001',
      httpStatus: 400,
    });
  });

  it('CANDiY 에러 형태가 아니면 code 없이 axios 메시지로 ApiError를 만든다', async () => {
    mockAdapter(async (config) => {
      throw new AxiosError('Network Error', 'ERR_NETWORK', config, null, {
        status: 500,
        data: { message: 'Internal Server Error' },
      } as AxiosResponse);
    });

    const error: unknown = await apiGet('/checkups').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw error;

    expect(error.message).toBe('Network Error');
    expect(error.code).toBeUndefined();
    expect(error.httpStatus).toBe(500);
  });
});
