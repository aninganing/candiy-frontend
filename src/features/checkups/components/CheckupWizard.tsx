'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/shared/components/layout/Header';
import { useCheckupData } from '@/features/checkups/hooks/useCheckupData';
import { useCheckupWizard } from '@/features/checkups/hooks/useCheckupWizard';
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

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header title="건강검진 조회" />
      <main className="flex flex-1 flex-col">
        {state.step === 'idle' && <CheckupIntro onStart={start} />}

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
              legalName={state.input.legalName}
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
              onConfirm={() => router.push('/dashboard')}
              onReset={reset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
