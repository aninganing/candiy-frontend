import 'server-only';
import axios from 'axios';
import { serverEnv } from '@/shared/lib/env.server';

// CANDiY API를 직접 호출하는 서버 전용 axios 인스턴스. Route Handler에서만 import한다.
export const candiyServerClient = axios.create({
  baseURL: serverEnv.CANDIY_API_BASE_URL,
  timeout: 300_000,
  headers: {
    'x-api-key': serverEnv.CANDIY_API_KEY,
    'Content-Type': 'application/json',
  },
});
