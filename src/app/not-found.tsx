import { SearchX } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LinkButton } from '@/shared/components/ui/LinkButton';
import { ROUTES } from '@/config/site';

const HOME_LINK = (
  <LinkButton href={ROUTES.home} size="md">
    홈으로 돌아가기
  </LinkButton>
);

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <EmptyState
          icon={<SearchX size={32} />}
          title="페이지를 찾을 수 없습니다"
          description="요청하신 페이지가 존재하지 않거나 삭제되었어요."
          action={HOME_LINK}
        />
      </main>
    </div>
  );
}
