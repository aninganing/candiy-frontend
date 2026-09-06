import { describe, expect, it } from 'vitest';
import { createQueryClient, shouldPersistQuery } from './queryClient';

async function makeQuery(queryKey: readonly unknown[], meta?: { persist?: boolean }) {
  const queryClient = createQueryClient();
  await queryClient.query({ queryKey, queryFn: () => ({}), meta });
  const query = queryClient.getQueryCache().find({ queryKey });
  if (!query) throw new Error('query not found');
  return query;
}

describe('shouldPersistQuery', () => {
  it('meta.persist가 true인 쿼리는 persist 대상이다', async () => {
    expect(shouldPersistQuery(await makeQuery(['anything'], { persist: true }))).toBe(true);
  });

  it('meta.persist가 없으면 persist 대상이 아니다', async () => {
    expect(shouldPersistQuery(await makeQuery(['no-meta']))).toBe(false);
  });

  it('meta.persist가 false면 persist 대상이 아니다', async () => {
    expect(shouldPersistQuery(await makeQuery(['explicitly-false'], { persist: false }))).toBe(
      false,
    );
  });
});
