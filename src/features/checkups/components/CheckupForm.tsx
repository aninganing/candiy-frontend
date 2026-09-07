'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { InlineAlert } from '@/shared/components/ui/InlineAlert';
import { Input } from '@/shared/components/ui/Input';
import { SelectableChip } from '@/shared/components/ui/SelectableChip';
import { AUTH_METHODS, TELECOMS } from '@/features/checkups/constants/checkupOptions';
import {
  checkupFormSchema,
  type CheckupFormValues,
} from '@/features/checkups/schemas/checkupForm.schema';
import type { CheckupRequestInput } from '@/features/checkups/types/checkup.types';

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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckupFormValues>({
    resolver: zodResolver(checkupFormSchema),
    mode: 'onChange',
    defaultValues: {
      loginTypeLevel: 1,
      legalName: '',
      birthdate: '',
      phoneNo: '',
      telecom: 0,
    },
  });

  function onValid(values: CheckupFormValues) {
    const currentYear = new Date().getFullYear();
    // 최근 10년(올해 포함)을 조회한다 — CheckupSuccess의 "최근 10년간" 안내 문구와 맞춘 범위.
    onSubmit({
      ...values,
      startDate: String(currentYear - 9),
      endDate: String(currentYear),
    });
  }

  return (
    <form onSubmit={handleSubmit(onValid)}>
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
          <Controller
            control={control}
            name="loginTypeLevel"
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-label="간편인증 수단 선택"
                className="grid grid-cols-3 gap-2 sm:grid-cols-4"
              >
                {AUTH_METHODS.map((method) => (
                  <SelectableChip
                    key={method.level}
                    size="sm"
                    selected={field.value === method.level}
                    onClick={() => field.onChange(method.level)}
                  >
                    {method.label}
                  </SelectableChip>
                ))}
              </div>
            )}
          />
        </div>

        <Input
          label="이름"
          placeholder="홍길동"
          maxLength={20}
          errorText={errors.legalName?.message}
          {...register('legalName')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name="birthdate"
            render={({ field }) => (
              <Input
                label="생년월일"
                placeholder="19900101"
                helperText="YYYYMMDD 형식"
                inputMode="numeric"
                maxLength={8}
                errorText={errors.birthdate?.message}
                {...field}
                onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
              />
            )}
          />
          <Controller
            control={control}
            name="phoneNo"
            render={({ field }) => (
              <Input
                label="휴대폰번호"
                placeholder="01012345678"
                helperText="숫자만 입력"
                inputMode="numeric"
                maxLength={11}
                errorText={errors.phoneNo?.message}
                {...field}
                onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-foreground text-sm font-semibold">통신사</span>
          <Controller
            control={control}
            name="telecom"
            render={({ field }) => (
              <div role="radiogroup" aria-label="통신사 선택" className="grid grid-cols-3 gap-2">
                {TELECOMS.map((option) => (
                  <SelectableChip
                    key={option.code}
                    selected={field.value === option.code}
                    onClick={() => field.onChange(option.code)}
                  >
                    {option.label}
                  </SelectableChip>
                ))}
              </div>
            )}
          />
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
