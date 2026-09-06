import { Header } from '@/shared/components/layout/Header';

export default function Loading() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="검진 결과 상세" />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-foreground-muted text-sm">불러오는 중입니다...</p>
      </main>
    </div>
  );
}
