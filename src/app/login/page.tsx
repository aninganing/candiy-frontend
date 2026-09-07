import { Header } from '@/shared/components/layout/Header';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-100">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
