import { describe, expect, it } from 'vitest';
import { checkupFormSchema } from './checkupForm.schema';

const validInput = {
  loginTypeLevel: 1,
  legalName: '홍길동',
  birthdate: '19900101',
  phoneNo: '01012345678',
  telecom: 0,
};

describe('checkupFormSchema', () => {
  it('모든 필드가 유효하면 통과한다', () => {
    expect(checkupFormSchema.safeParse(validInput).success).toBe(true);
  });

  it('이름이 2자 미만이면 실패한다', () => {
    expect(checkupFormSchema.safeParse({ ...validInput, legalName: '홍' }).success).toBe(false);
  });

  it('생년월일이 8자리 숫자가 아니면 실패한다', () => {
    expect(checkupFormSchema.safeParse({ ...validInput, birthdate: '1990-01-01' }).success).toBe(
      false,
    );
    expect(checkupFormSchema.safeParse({ ...validInput, birthdate: '199001' }).success).toBe(
      false,
    );
  });

  it('휴대폰번호가 11자리 숫자가 아니면 실패한다', () => {
    expect(checkupFormSchema.safeParse({ ...validInput, phoneNo: '010-1234-5678' }).success).toBe(
      false,
    );
  });

  it('loginTypeLevel/telecom이 정의된 값이 아니면 실패한다', () => {
    expect(checkupFormSchema.safeParse({ ...validInput, loginTypeLevel: 2 }).success).toBe(false);
    expect(checkupFormSchema.safeParse({ ...validInput, telecom: 3 }).success).toBe(false);
  });
});
