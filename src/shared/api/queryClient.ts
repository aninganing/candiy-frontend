import { QueryClient, type Query } from '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { persist?: boolean };
  }
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false },
    },
  });
}

// 새로고침/뒤로가기에도 유지하고 싶은 쿼리는 정의하는 곳(useQuery의 meta: { persist: true })에서 스스로 표시한다.
// 이 파일은 어떤 feature가 어떤 쿼리를 쓰는지 몰라도 되고, persist 대상을 늘릴 때도 쿼리 정의부만 고치면 된다.
export function shouldPersistQuery(query: Query): boolean {
  return query.meta?.persist === true;
}
