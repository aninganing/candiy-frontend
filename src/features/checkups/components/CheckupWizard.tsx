'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Header } from '@/shared/components/layout/Header';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/config/site';
import { useCheckupData } from '@/features/checkups/hooks/useCheckupData';
import { useCheckupWizard } from '@/features/checkups/hooks/useCheckupWizard';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { CheckupForm } from './CheckupForm';
import { CheckupIntro } from './CheckupIntro';
import { CheckupPending } from './CheckupPending';
import { CheckupSuccess } from './CheckupSuccess';

export function CheckupWizard() {
  const router = useRouter();
  const {
    state,
    start,
    reset,
    submitPersonalInfo,
    confirmAuthentication,
    isSubmitting,
    submitError,
    isVerifying,
    verifyError,
  } = useCheckupWizard();
  const { data } = useCheckupData();
  const userName = useAuthStore((state) => state.user?.name);
  const handleLogout = useLogout();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header
        title="건강검진 조회"
        actions={
          <Button
            variant="ghost"
            size="md"
            icon={<LogOut className="h-4 w-4" />}
            onClick={handleLogout}
            aria-label="로그아웃"
          >
            <span className="hidden sm:inline">로그아웃</span>
          </Button>
        }
      />
      <main className="flex flex-1 flex-col">
        {state.step === 'idle' && <CheckupIntro onStart={start} userName={userName} />}

        {state.step === 'form' && (
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-120">
              <CheckupForm
                onSubmit={submitPersonalInfo}
                onCancel={reset}
                isSubmitting={isSubmitting}
                errorMessage={submitError?.message}
              />
            </div>
          </div>
        )}

        {state.step === 'pending' && (
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <CheckupPending
              legalName={userName ?? state.input.legalName}
              loginTypeLevel={state.input.loginTypeLevel}
              onConfirm={confirmAuthentication}
              onCancel={reset}
              isVerifying={isVerifying}
              errorMessage={verifyError?.message}
            />
          </div>
        )}

        {state.step === 'success' && data && (
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <CheckupSuccess
              data={data}
              userName={userName}
              onConfirm={() => router.push(ROUTES.dashboard)}
              onReset={reset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
