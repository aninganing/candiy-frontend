import { ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export interface CheckupIntroProps {
  onStart: () => void;
}

export function CheckupIntro({ onStart }: CheckupIntroProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="bg-primary/10 flex h-18 w-18 items-center justify-center rounded-full">
        <ShieldCheck size={34} className="text-primary" />
      </div>
      <div className="flex flex-col gap-2.5">
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          국민건강보험공단 건강검진 결과 조회
        </h1>
        <p className="text-foreground-muted text-sm leading-relaxed">
          본인인증을 통해 최근의 건강검진 결과를 한 번에 확인하세요.
        </p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2.5 pt-2">
        <Button size="lg" fullWidth onClick={onStart}>
          건강검진 조회 시작
        </Button>
      </div>
    </div>
  );
}
