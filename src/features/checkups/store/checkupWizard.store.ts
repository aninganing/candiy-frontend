import { create } from 'zustand';
import type {
  CheckupChallenge,
  CheckupData,
  CheckupRequestInput,
} from '@/features/checkups/types/checkup.types';

type CheckupWizardState =
  | { step: 'idle' }
  | { step: 'form' }
  | { step: 'pending'; input: CheckupRequestInput; id: string; challenge: CheckupChallenge }
  | { step: 'success'; data: CheckupData };

interface CheckupWizardStore {
  state: CheckupWizardState;
  start: () => void;
  reset: () => void;
  setChallenge: (input: CheckupRequestInput, id: string, challenge: CheckupChallenge) => void;
  setVerified: (data: CheckupData) => void;
}

export const useCheckupWizardStore = create<CheckupWizardStore>((set) => ({
  state: { step: 'idle' },
  start: () => set({ state: { step: 'form' } }),
  reset: () => set({ state: { step: 'idle' } }),
  setChallenge: (input, id, challenge) => set({ state: { step: 'pending', input, id, challenge } }),
  setVerified: (data) => set({ state: { step: 'success', data } }),
}));
