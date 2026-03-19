'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-card rounded-xl border border-border shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Login...</h1>
        <p className="text-sm text-muted-foreground">
          Please use the login page. If you are not redirected, <a href="/login" className="text-primary underline">click here</a>.
        </p>
      </div>
    </div>
  );
}
