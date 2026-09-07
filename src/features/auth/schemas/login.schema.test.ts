import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('이름이 비어있으면 실패한다', () => {
    const result = loginSchema.safeParse({ name: '', password: 'candiy123' });

    expect(result.success).toBe(false);
  });

  it('비밀번호가 영문/숫자 중 하나만 포함하면 실패한다', () => {
    expect(loginSchema.safeParse({ name: '홍길동', password: 'abcdefgh' }).success).toBe(false);
    expect(loginSchema.safeParse({ name: '홍길동', password: '12345678' }).success).toBe(false);
  });

  it('비밀번호가 8자 미만이면 실패한다', () => {
    const result = loginSchema.safeParse({ name: '홍길동', password: 'abc123' });

    expect(result.success).toBe(false);
  });

  it('이름과 영문+숫자 조합 8자 이상 비밀번호면 통과한다', () => {
    const result = loginSchema.safeParse({ name: '홍길동', password: 'candiy123' });

    expect(result.success).toBe(true);
  });
});
