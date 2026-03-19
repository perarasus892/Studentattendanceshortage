'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [code] = useState(() => String(Math.floor(10000 + Math.random() * 90000)));
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (codeInput !== code) {
      setError('Please enter the code shown');
      return;
    }

    try {
      // reuse auth system: allow username to be email or username
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
        <div className="w-full flex items-center justify-center bg-white">
          <div className="w-full p-10">
          <div className="flex flex-col items-center mb-6">
            <img src="/placeholder-logo.png" alt="logo" className="w-24 h-24 object-contain mb-4" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground text-center">DWARAKA DOSS GOVERDHAN<br/>DOSS VAISHNAV COLLEGE<br/>LMS</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-transparent text-foreground text-lg"
                placeholder="Username or email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-transparent text-foreground text-lg"
                placeholder="Password"
              />
            </div>

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-900">{code}</div>
              <div className="text-sm text-muted-foreground mt-2">Enter the code above here *:</div>
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                required
                className="mt-2 w-40 px-3 py-2 border border-input rounded-md text-center mx-auto block"
              />
              <div className="text-xs text-muted-foreground mt-2">Can't read the image? click</div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 text-white rounded-md font-bold hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
