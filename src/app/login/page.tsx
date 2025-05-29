
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-200 to-blue-200 p-4">
      <LoginForm />
    </main>
  );
}
