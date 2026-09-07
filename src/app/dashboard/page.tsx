import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { AuthGuard } from '@/features/auth/components/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
