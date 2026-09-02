import { z } from 'zod';

/**
 * 클라이언트(브라우저) 번들에 포함되어도 안전한 env만 여기서 검증한다.
 * 서버 전용 비밀값(CANDIY_API_KEY 등)은 env.server.ts에서 별도로 검증한다.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_MODE: z.enum(['mock', 'live']).default('mock'),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
});
