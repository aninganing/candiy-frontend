import { Header } from '@/shared/components/layout/Header';
import { Spinner } from '@/shared/components/feedback/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="건강검진 대시보드" />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10">
        <Spinner size="lg" label="검진 결과 불러오는 중" />
        <p className="text-foreground-muted text-sm">불러오는 중입니다...</p>
      </main>
    </div>
  );
}
