import { z } from 'zod';

// 서버 전용 비밀값은 env.server.ts에서 별도로 검증한다.
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_MODE: z.enum(['mock', 'live']).default('mock'),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
});
