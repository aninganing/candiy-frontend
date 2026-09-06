'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { InlineAlert } from '@/shared/components/ui/InlineAlert';
import { Header } from '@/shared/components/layout/Header';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="검진 결과 상세" />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <InlineAlert tone="danger">검진 상세 정보를 불러오는 중 문제가 발생했습니다.</InlineAlert>
          <Button onClick={retry}>다시 시도</Button>
        </div>
      </main>
    </div>
  );
}
