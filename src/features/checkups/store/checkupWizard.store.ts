import { create } from 'zustand';
import type {
  CheckupChallenge,
  CheckupRequestInput,
} from '@/features/checkups/types/checkup.types';

// 인증 완료 후 받은 CheckupData(서버 데이터)는 TanStack Query 캐시(queryKeys.checkups.data())에 저장한다.
// 해당 store는 위저드 단계(UI 상태)만 갖는다.
type CheckupWizardState =
  | { step: 'idle' }
  | { step: 'form' }
  | { step: 'pending'; input: CheckupRequestInput; id: string; challenge: CheckupChallenge }
  | { step: 'success' };

interface CheckupWizardStore {
  state: CheckupWizardState;
  start: () => void;
  reset: () => void;
  setChallenge: (input: CheckupRequestInput, id: string, challenge: CheckupChallenge) => void;
  setVerified: () => void;
}

export const useCheckupWizardStore = create<CheckupWizardStore>((set) => ({
  state: { step: 'idle' },
  start: () => set({ state: { step: 'form' } }),
  reset: () => set({ state: { step: 'idle' } }),
  setChallenge: (input, id, challenge) => set({ state: { step: 'pending', input, id, challenge } }),
  setVerified: () => set({ state: { step: 'success' } }),
}));
