import { CheckupWizard } from '@/features/checkups/components/CheckupWizard';
import { AuthGuard } from '@/features/auth/components/AuthGuard';

export default function CheckupsPage() {
  return (
    <AuthGuard>
      <CheckupWizard />
    </AuthGuard>
  );
}
