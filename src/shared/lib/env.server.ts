import 'server-only';
import { z } from 'zod';

/**
 * 서버 전용 env. 'server-only'를 import하므로 클라이언트 컴포넌트/번들에서
 * 실수로 import하면 빌드 타임에 에러가 난다. Route Handler 등 서버 코드에서만 사용.
 */
const serverEnvSchema = z.object({
  CANDIY_API_KEY: z.string().min(1, 'CANDIY_API_KEY가 설정되지 않았습니다.'),
  CANDIY_API_BASE_URL: z.url().default('https://api.candiy.io'),
});

export const serverEnv = serverEnvSchema.parse({
  CANDIY_API_KEY: process.env.CANDIY_API_KEY,
  CANDIY_API_BASE_URL: process.env.CANDIY_API_BASE_URL,
});
