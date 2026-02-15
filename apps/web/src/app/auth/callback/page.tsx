'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (error) {
      router.replace('/?auth_error=' + encodeURIComponent(error));
      return;
    }

    if (success === 'true') {
      refreshUser().then(() => {
        router.replace('/');
      });
      return;
    }

    router.replace('/');
  }, [searchParams, refreshUser, router]);

  return <p>Авторизация...</p>;
}

export default function AuthCallbackPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Suspense fallback={<p>Загрузка...</p>}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
