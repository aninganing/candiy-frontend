'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { InlineAlert } from '@/shared/components/ui/InlineAlert';
import { Input } from '@/shared/components/ui/Input';
import { SelectableChip } from '@/shared/components/ui/SelectableChip';
import { AUTH_METHODS, TELECOMS } from '@/features/checkups/constants/checkupOptions';
import type {
  CheckupRequestInput,
  LoginTypeLevel,
  TelecomCode,
} from '@/features/checkups/types/checkup.types';

export interface CheckupFormProps {
  onSubmit: (input: CheckupRequestInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export function CheckupForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
}: CheckupFormProps) {
  const [loginTypeLevel, setLoginTypeLevel] = useState<LoginTypeLevel>(1);
  const [legalName, setLegalName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [telecom, setTelecom] = useState<TelecomCode>(0);

  const isValid = legalName.trim().length >= 2 && birthdate.length === 8 && phoneNo.length === 11;

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    const currentYear = new Date().getFullYear();
    onSubmit({
      legalName,
      birthdate,
      phoneNo,
      telecom,
      loginTypeLevel,
      startDate: String(currentYear - 1),
      endDate: String(currentYear),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-foreground text-lg font-bold tracking-tight">
            본인 확인을 위해 정보를 입력해주세요
          </h1>
          <p className="text-foreground-muted text-sm">
            간편인증으로 5분 이내에 본인확인이 완료돼요
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-foreground text-sm font-semibold">간편인증 수단 선택</span>
          <div
            role="radiogroup"
            aria-label="간편인증 수단 선택"
            className="grid grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {AUTH_METHODS.map((method) => (
              <SelectableChip
                key={method.level}
                size="sm"
                selected={loginTypeLevel === method.level}
                onClick={() => setLoginTypeLevel(method.level)}
              >
                {method.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        <Input
          label="이름"
          placeholder="홍길동"
          maxLength={20}
          value={legalName}
          onChange={(event) => setLegalName(event.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="생년월일"
            placeholder="19900101"
            helperText="YYYYMMDD 형식"
            inputMode="numeric"
            maxLength={8}
            value={birthdate}
            onChange={(event) => setBirthdate(event.target.value.replace(/\D/g, ''))}
          />
          <Input
            label="휴대폰번호"
            placeholder="01012345678"
            helperText="숫자만 입력"
            inputMode="numeric"
            maxLength={11}
            value={phoneNo}
            onChange={(event) => setPhoneNo(event.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-foreground text-sm font-semibold">통신사</span>
          <div role="radiogroup" aria-label="통신사 선택" className="grid grid-cols-3 gap-2">
            {TELECOMS.map((option) => (
              <SelectableChip
                key={option.code}
                selected={telecom === option.code}
                onClick={() => setTelecom(option.code)}
              >
                {option.label}
              </SelectableChip>
            ))}
          </div>
        </div>

        {errorMessage && <InlineAlert tone="danger">{errorMessage}</InlineAlert>}

        <div className="flex flex-col gap-2.5">
          <Button type="submit" size="lg" fullWidth disabled={!isValid || isSubmitting}>
            {isSubmitting ? '요청 중입니다...' : '본인인증 시작'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>

        <p className="text-foreground-subtle text-xs leading-relaxed">
          입력하신 이름, 생년월일, 휴대폰번호 등 개인정보는 본인인증 목적으로만 사용되며 별도로
          저장되지 않습니다.
        </p>
      </Card>
    </form>
  );
}
