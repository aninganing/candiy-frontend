'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { ROUTES } from '@/config/site';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { name: '', password: '' },
  });

  function onSubmit(values: LoginFormValues) {
    login(values.name.trim());
    router.push(ROUTES.checkups);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-foreground text-lg font-bold tracking-tight">로그인</h1>
          <p className="text-foreground-muted text-sm">
            이름과 비밀번호를 입력하고 건강검진 결과를 조회해보세요
          </p>
        </div>

        <Input
          label="이름"
          placeholder="홍길동"
          errorText={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="영문, 숫자 포함 8자 이상"
          errorText={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" size="lg" fullWidth disabled={!isValid}>
          로그인
        </Button>
      </Card>
    </form>
  );
}
