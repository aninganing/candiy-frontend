import { z } from 'zod';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const loginSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요'),
  password: z.string().regex(PASSWORD_PATTERN, '영문, 숫자를 포함해 8자 이상 입력해주세요'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
