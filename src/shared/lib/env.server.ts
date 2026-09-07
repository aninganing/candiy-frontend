import 'server-only';
import { z } from 'zod';

// 'server-only'가 클라이언트 번들에서의 실수 import를 빌드 타임에 막아준다.
const serverEnvSchema = z.object({
  CANDIY_API_KEY: z.string().min(1, 'CANDIY_API_KEY가 설정되지 않았습니다.'),
  CANDIY_API_BASE_URL: z.url().default('https://api.candiy.io'),
  NEXT_PUBLIC_API_MODE: z.enum(['mock', 'live']).default('mock'),
});

export const serverEnv = serverEnvSchema.parse({
  CANDIY_API_KEY: process.env.CANDIY_API_KEY,
  CANDIY_API_BASE_URL: process.env.CANDIY_API_BASE_URL,
  NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
});
