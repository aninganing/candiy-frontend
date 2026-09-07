import { LineChart } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { LinkButton } from '@/shared/components/ui/LinkButton';
import { ROUTES } from '@/config/site';

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <div className="bg-primary/10 flex h-18 w-18 items-center justify-center rounded-full">
          <LineChart size={34} className="text-primary" />
        </div>
        <div className="flex flex-col gap-2.5">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            10년간의 건강검진 데이터를
            <br />
            한눈에 조회해보세요
          </h1>
          <p className="text-foreground-muted text-sm leading-relaxed">
            국민건강보험공단 건강검진 결과를 본인인증만으로 간편하게 확인할 수 있어요.
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2.5 pt-2">
          <LinkButton href={ROUTES.checkups} size="lg" fullWidth>
            시작하기
          </LinkButton>
        </div>
      </main>
    </div>
  );
}
