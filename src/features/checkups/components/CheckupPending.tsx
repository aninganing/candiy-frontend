'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { InlineAlert } from '@/shared/components/ui/InlineAlert';
import { getAuthMethodLabel } from '@/features/checkups/constants/checkupOptions';
import { AUTH_EXPIRY_SECONDS } from '@/features/checkups/constants/checkupTimings';
import type { LoginTypeLevel } from '@/features/checkups/types/checkup.types';

const CLOCK_ICON = <Clock />;

function formatRemaining(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export interface CheckupPendingProps {
  legalName: string;
  loginTypeLevel: LoginTypeLevel;
  onConfirm: () => void;
  onCancel: () => void;
  isVerifying?: boolean;
  errorMessage?: string;
}

export function CheckupPending({
  legalName,
  loginTypeLevel,
  onConfirm,
  onCancel,
  isVerifying = false,
  errorMessage,
}: CheckupPendingProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(AUTH_EXPIRY_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const methodLabel = getAuthMethodLabel(loginTypeLevel);
  const progressPercent = (remainingSeconds / AUTH_EXPIRY_SECONDS) * 100;

  return (
    <Card padding="lg" className="mx-auto flex max-w-sm flex-col items-center gap-5 text-center">
      <Badge shape="circle" tone="primary" size="lg">
        {CLOCK_ICON}
      </Badge>

      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-lg font-bold tracking-tight">
          {legalName}님의 휴대폰에서
          <br />
          {methodLabel} 인증을 진행해주세요
        </h1>
        <p className="text-foreground-muted text-sm leading-relaxed">
          인증 요청을 확인하고 인증을 완료한 뒤,
          <br />
          아래 [인증 완료] 버튼을 눌러주세요.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-foreground-subtle text-xs">남은 시간</span>
          <span className="text-foreground text-lg font-bold tracking-tight tabular-nums">
            {formatRemaining(remainingSeconds)}
          </span>
        </div>
        <div className="bg-surface-hover h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <InlineAlert tone="warning" className="w-full text-left">
          {errorMessage}
        </InlineAlert>
      )}

      <div className="flex w-full flex-col gap-2.5">
        <Button
          size="lg"
          fullWidth
          onClick={onConfirm}
          disabled={isVerifying || remainingSeconds === 0}
        >
          {isVerifying ? '확인 중입니다...' : '인증 완료'}
        </Button>
        <Button variant="ghost" size="lg" fullWidth onClick={onCancel}>
          취소
        </Button>
      </div>
    </Card>
  );
}
