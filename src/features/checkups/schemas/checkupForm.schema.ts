import { z } from 'zod';

export const checkupFormSchema = z.object({
  loginTypeLevel: z.union([
    z.literal(1),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
    z.literal(11),
    z.literal(12),
    z.literal(13),
  ]),
  legalName: z.string().trim().min(2, '이름을 2자 이상 입력해주세요'),
  birthdate: z.string().regex(/^\d{8}$/, 'YYYYMMDD 형식으로 입력해주세요'),
  phoneNo: z.string().regex(/^\d{11}$/, '숫자 11자리를 입력해주세요'),
  telecom: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

export type CheckupFormValues = z.infer<typeof checkupFormSchema>;
