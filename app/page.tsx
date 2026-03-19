'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard/' + user.role);
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-card rounded-xl border border-border shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Login...</h1>
        <p className="text-sm text-muted-foreground">
          If you are not redirected automatically, <a href="/login" className="text-primary underline">click here</a>.
        </p>
      </div>
    </div>
  );
}
