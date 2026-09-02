import axios from 'axios';
import { ApiError, isCandiyErrorPayload } from '@/shared/api/errors';

// 우리 앱 Route Handler(/api/**)만 호출한다. CANDiY는 서버 프록시(candiyServerClient.ts)를 거친다.
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data;
      if (isCandiyErrorPayload(payload)) {
        return Promise.reject(
          new ApiError(payload.message, {
            code: payload.code,
            httpStatus: error.response?.status,
            cause: error,
          }),
        );
      }
      return Promise.reject(
        new ApiError(error.message, { httpStatus: error.response?.status, cause: error }),
      );
    }
    return Promise.reject(error);
  },
);

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  const { data } = await apiClient.post<TResponse>(path, body);
  return data;
}

export async function apiGet<TResponse>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>(path, { params });
  return data;
}
