'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Eye, EyeOff, Package } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggedIn, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [mounted, isLoggedIn, router]);

  useEffect(() => {
    if (error) {
      setHasError(true);
      const timer = setTimeout(() => setHasError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (data: LoginForm) => {
    clearError();
    try {
      await login(data.username, data.password);
      router.push('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Left Panel — Branding */}
      <div
        style={{
          width: '50%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FF6B00 0%, #E55A00 50%, #FF8C33 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        {/* Geometric shapes */}
        <div style={{ position: 'absolute', top: 80, left: 80, width: 160, height: 160, border: '2px solid rgba(255,255,255,0.1)', borderRadius: 24, transform: 'rotate(12deg)' }} />
        <div style={{ position: 'absolute', bottom: 128, right: 64, width: 224, height: 224, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '50%', left: '33%', width: 80, height: 80, background: 'rgba(255,255,255,0.05)', borderRadius: 16, transform: 'rotate(-12deg)' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 64px' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Package style={{ width: 40, height: 40, color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.2, marginBottom: 16 }}>
            Smart Inventory
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: 400, lineHeight: 1.6 }}>
            Control Your Stock, Grow Your Business
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
            <div style={{ width: 32, height: 8, borderRadius: 4, background: 'white' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: 420 }} className={cn(hasError && 'animate-shake')}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E' }}>Smart Inventory</h1>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Selamat Datang! 👋</h2>
            <p style={{ color: '#6B7280', fontSize: 15 }}>
              Masuk ke akun Anda untuk mengelola inventaris
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Input
              label="USERNAME"
              placeholder="Masukkan username"
              icon={<User style={{ width: 18, height: 18 }} />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="PASSWORD"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              icon={<Lock style={{ width: 18, height: 18 }} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: '#9CA3AF' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            {error && (
              <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12 }} className="animate-slide-up">
                <p style={{ fontSize: 14, color: '#DC2626' }}>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
              style={{ padding: '14px 0', fontSize: 16, marginTop: 4 }}
            >
              Sign In
            </Button>
          </form>

          <div style={{ marginTop: 32, padding: 16, background: '#F9FAFB', borderRadius: 12 }}>
            <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>DEMO CREDENTIALS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#6B7280' }}>
              <p><span style={{ fontWeight: 600, color: '#374151' }}>Admin:</span> admin / admin123</p>
              <p><span style={{ fontWeight: 600, color: '#374151' }}>User:</span> user / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
